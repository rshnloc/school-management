from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional
from ..database import get_db
from ..models import Grade, Student, Course
from ..schemas import GradeResponse, GradeCreate
from ..ai.risk_predictor import predict_student_risk
import json

router = APIRouter(prefix="/grades", tags=["grades"])

@router.get("", response_model=List[GradeResponse])
def get_grades(
    student_id: Optional[int] = None,
    course_id: Optional[int] = None,
    db: Session = Depends(get_db)
):
    query = db.query(Grade)
    if student_id:
        query = query.filter(Grade.student_id == student_id)
    if course_id:
        query = query.filter(Grade.course_id == course_id)
    
    grades = query.order_by(Grade.id.desc()).all()
    results = []
    for g in grades:
        s_name = f"{g.student.first_name} {g.student.last_name}" if g.student else "Student"
        c_name = g.course.course_name if g.course else "Course"
        results.append(GradeResponse(
            id=g.id,
            student_id=g.student_id,
            course_id=g.course_id,
            assessment_name=g.assessment_name,
            assessment_type=g.assessment_type,
            max_score=g.max_score,
            score=g.score,
            date=g.date,
            remarks=g.remarks or "",
            student_name=s_name,
            course_name=c_name
        ))
    return results

@router.post("", response_model=GradeResponse)
def add_grade(data: GradeCreate, db: Session = Depends(get_db)):
    grade = Grade(
        student_id=data.student_id,
        course_id=data.course_id,
        assessment_name=data.assessment_name,
        assessment_type=data.assessment_type,
        max_score=data.max_score,
        score=data.score,
        remarks=data.remarks or ""
    )
    db.add(grade)
    db.commit()
    db.refresh(grade)

    # Recalculate student GPA and AI risk score
    student = db.query(Student).filter(Student.id == data.student_id).first()
    if student:
        all_grades = db.query(Grade).filter(Grade.student_id == student.id).all()
        if all_grades:
            avg_score = sum(g.score for g in all_grades) / len(all_grades)
            student.gpa = round(min(4.0, max(1.0, (avg_score / 20.0) - 1.0)), 2)
        
        eval_res = predict_student_risk(student, db)
        student.ai_risk_level = eval_res["risk_level"]
        student.ai_risk_score = eval_res["risk_score"]
        student.ai_risk_factors = json.dumps(eval_res["factors"])
        student.ai_recommendation = eval_res["recommendation"]
        db.commit()

    s_name = f"{grade.student.first_name} {grade.student.last_name}" if grade.student else "Student"
    c_name = grade.course.course_name if grade.course else "Course"

    return GradeResponse(
        id=grade.id,
        student_id=grade.student_id,
        course_id=grade.course_id,
        assessment_name=grade.assessment_name,
        assessment_type=grade.assessment_type,
        max_score=grade.max_score,
        score=grade.score,
        date=grade.date,
        remarks=grade.remarks or "",
        student_name=s_name,
        course_name=c_name
    )

