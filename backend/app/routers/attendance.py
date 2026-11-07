from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime
from ..database import get_db
from ..models import Attendance, Student
from ..schemas import AttendanceResponse, AttendanceBatchCreate
from ..ai.risk_predictor import predict_student_risk
import json

router = APIRouter(prefix="/attendance", tags=["attendance"])

@router.get("", response_model=List[AttendanceResponse])
def get_attendance(
    date: Optional[str] = None,
    student_id: Optional[int] = None,
    db: Session = Depends(get_db)
):
    query = db.query(Attendance)
    if date:
        query = query.filter(Attendance.date == date)
    if student_id:
        query = query.filter(Attendance.student_id == student_id)
    
    records = query.order_by(Attendance.id.desc()).all()
    out = []
    for r in records:
        s_name = f"{r.student.first_name} {r.student.last_name}" if r.student else "Student"
        out.append(AttendanceResponse(
            id=r.id,
            student_id=r.student_id,
            student_name=s_name,
            date=r.date,
            status=r.status,
            remarks=r.remarks or ""
        ))
    return out

@router.post("/batch")
def record_batch_attendance(data: AttendanceBatchCreate, db: Session = Depends(get_db)):
    updated_students = set()
    for item in data.records:
        existing = db.query(Attendance).filter(
            Attendance.student_id == item.student_id,
            Attendance.date == item.date
        ).first()

        if existing:
            existing.status = item.status
            existing.remarks = item.remarks or ""
        else:
            rec = Attendance(
                student_id=item.student_id,
                date=item.date,
                status=item.status,
                remarks=item.remarks or ""
            )
            db.add(rec)
        updated_students.add(item.student_id)

    db.commit()

    # Recalculate AI risk score for updated students
    for s_id in updated_students:
        stu = db.query(Student).filter(Student.id == s_id).first()
        if stu:
            eval_res = predict_student_risk(stu, db)
            stu.attendance_rate = eval_res["attendance_rate"]
            stu.ai_risk_level = eval_res["risk_level"]
            stu.ai_risk_score = eval_res["risk_score"]
            stu.ai_risk_factors = json.dumps(eval_res["factors"])
            stu.ai_recommendation = eval_res["recommendation"]
    
    db.commit()
    return {"message": f"Successfully updated attendance for {len(data.records)} records."}

@router.get("/summary")
def get_attendance_summary(db: Session = Depends(get_db)):
    all_recs = db.query(Attendance).all()
    total = len(all_recs)
    if total == 0:
        return {
            "total_records": 0,
            "present_count": 0,
            "absent_count": 0,
            "late_count": 0,
            "excused_count": 0,
            "overall_rate": 95.0
        }
    
    present = sum(1 for a in all_recs if a.status == "Present")
    absent = sum(1 for a in all_recs if a.status == "Absent")
    late = sum(1 for a in all_recs if a.status == "Late")
    excused = sum(1 for a in all_recs if a.status == "Excused")
    rate = round(((present + excused + (late * 0.5)) / total) * 100.0, 1)

    return {
        "total_records": total,
        "present_count": present,
        "absent_count": absent,
        "late_count": late,
        "excused_count": excused,
        "overall_rate": rate
    }

