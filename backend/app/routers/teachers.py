from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from ..database import get_db
from ..models import Teacher
from ..schemas import TeacherResponse, TeacherCreate

router = APIRouter(prefix="/teachers", tags=["teachers"])

@router.get("", response_model=List[TeacherResponse])
def get_teachers(db: Session = Depends(get_db)):
    return db.query(Teacher).all()

@router.get("/{teacher_id}", response_model=TeacherResponse)
def get_teacher(teacher_id: int, db: Session = Depends(get_db)):
    teacher = db.query(Teacher).filter(Teacher.id == teacher_id).first()
    if not teacher:
        raise HTTPException(status_code=404, detail="Teacher not found")
    return teacher

@router.post("", response_model=TeacherResponse)
def create_teacher(data: TeacherCreate, db: Session = Depends(get_db)):
    count = db.query(Teacher).count() + 1
    generated_id = f"TCH-{count + 100:03d}"
    teacher = Teacher(
        teacher_id=generated_id,
        first_name=data.first_name,
        last_name=data.last_name,
        email=data.email,
        department=data.department,
        subject_specialty=data.subject_specialty,
        phone=data.phone,
        office_room=data.office_room,
        qualification=data.qualification,
        status=data.status
    )
    db.add(teacher)
    db.commit()
    db.refresh(teacher)
    return teacher

