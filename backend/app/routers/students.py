from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from ..database import get_db
from ..models import Student, Attendance, Grade
from ..schemas import StudentResponse, StudentCreate, StudentUpdate
from ..ai.risk_predictor import predict_student_risk
import json

router = APIRouter(prefix="/students", tags=["students"])

@router.get("", response_model=List[StudentResponse])
def get_students(
    search: Optional[str] = None,
    grade_level: Optional[str] = None,
    risk_level: Optional[str] = None,
    db: Session = Depends(get_db)
):
    query = db.query(Student)
    if search:
        s = f"%{search}%"
        query = query.filter((Student.first_name.ilike(s)) | (Student.last_name.ilike(s)) | (Student.student_id.ilike(s)))
    if grade_level and grade_level != "All":
        query = query.filter(Student.grade_level == grade_level)
    if risk_level and risk_level != "All":
        query = query.filter(Student.ai_risk_level == risk_level)
    return query.order_by(Student.id.desc()).all()

@router.get("/{student_id}", response_model=StudentResponse)
def get_student(student_id: int, db: Session = Depends(get_db)):
    student = db.query(Student).filter(Student.id == student_id).first()
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")
    return student

@router.post("", response_model=StudentResponse)
def create_student(data: StudentCreate, db: Session = Depends(get_db)):
    # Generate mock student ID
    count = db.query(Student).count() + 1
    generated_id = f"STU-2024-{count:03d}"
    
    student = Student(
        student_id=generated_id,
        first_name=data.first_name,
        last_name=data.last_name,
        email=data.email,
        grade_level=data.grade_level,
        section=data.section,
        date_of_birth=data.date_of_birth,
        gender=data.gender,
        address=data.address,
        guardian_name=data.guardian_name,
        guardian_phone=data.guardian_phone,
        guardian_email=data.guardian_email,
        status=data.status,
        gpa=3.5,
        attendance_rate=96.0,
        ai_risk_level="Low",
        ai_risk_score=15.0,
        ai_risk_factors=json.dumps(["Initial baseline enrollment."]),
        ai_recommendation="Baseline profile created. Monitoring academic orientation."
    )
    db.add(student)
    db.commit()
    db.refresh(student)

    # Calculate initial risk assessment
    risk_eval = predict_student_risk(student, db)
    student.ai_risk_level = risk_eval["risk_level"]
    student.ai_risk_score = risk_eval["risk_score"]
    student.ai_risk_factors = json.dumps(risk_eval["factors"])
    student.ai_recommendation = risk_eval["recommendation"]
    db.commit()
    db.refresh(student)
    return student

@router.put("/{student_id}", response_model=StudentResponse)
def update_student(student_id: int, data: StudentUpdate, db: Session = Depends(get_db)):
    student = db.query(Student).filter(Student.id == student_id).first()
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")
    
    for key, value in data.dict(exclude_unset=True).items():
        setattr(student, key, value)
    
    db.commit()
    db.refresh(student)
    return student

@router.delete("/{student_id}")
def delete_student(student_id: int, db: Session = Depends(get_db)):
    student = db.query(Student).filter(Student.id == student_id).first()
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")
    db.delete(student)
    db.commit()
    return {"message": "Student record deleted successfully"}

@router.get("/{student_id}/report-card")
def get_student_report_card(student_id: int, db: Session = Depends(get_db)):
    student = db.query(Student).filter(Student.id == student_id).first()
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")
    
    grades = db.query(Grade).filter(Grade.student_id == student_id).all()
    attendances = db.query(Attendance).filter(Attendance.student_id == student_id).all()
    
    total_att = len(attendances)
    present_att = sum(1 for a in attendances if a.status in ["Present", "Excused"])
    rate = (present_att / total_att * 100.0) if total_att > 0 else student.attendance_rate

    course_summary = {}
    for g in grades:
        c_name = g.course.course_name if g.course else "General"
        if c_name not in course_summary:
            course_summary[c_name] = []
        course_summary[c_name].append(g.score)

    computed_courses = []
    total_score = 0.0
    for c_name, scores in course_summary.items():
        c_avg = sum(scores) / len(scores)
        total_score += c_avg
        grade_letter = "A" if c_avg >= 90 else "B" if c_avg >= 80 else "C" if c_avg >= 70 else "D" if c_avg >= 60 else "F"
        computed_courses.append({
            "course_name": c_name,
            "average_score": round(c_avg, 1),
            "letter_grade": grade_letter,
            "assessments_count": len(scores)
        })

    overall_avg = (total_score / len(computed_courses)) if computed_courses else 85.0
    gpa = round(min(4.0, (overall_avg / 20.0) - 1.0), 2) if overall_avg >= 60 else 1.5

    return {
        "student": {
            "id": student.id,
            "student_id": student.student_id,
            "name": f"{student.first_name} {student.last_name}",
            "grade_level": student.grade_level,
            "section": student.section,
            "email": student.email,
            "guardian_name": student.guardian_name,
            "guardian_phone": student.guardian_phone
        },
        "academic_term": "Academic Year 2024-2025 (Term 1)",
        "gpa": gpa,
        "overall_average": round(overall_avg, 1),
        "attendance_rate": round(rate, 1),
        "ai_risk_level": student.ai_risk_level,
        "ai_recommendation": student.ai_recommendation,
        "courses": computed_courses
    }

