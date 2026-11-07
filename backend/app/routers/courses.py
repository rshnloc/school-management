from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from ..database import get_db
from ..models import Course, Teacher
from ..schemas import CourseResponse, CourseCreate

router = APIRouter(prefix="/courses", tags=["courses"])

@router.get("", response_model=List[CourseResponse])
def get_courses(db: Session = Depends(get_db)):
    courses = db.query(Course).all()
    results = []
    for c in courses:
        t_name = f"{c.teacher.first_name} {c.teacher.last_name}" if c.teacher else "Unassigned"
        results.append(CourseResponse(
            id=c.id,
            course_code=c.course_code,
            course_name=c.course_name,
            department=c.department,
            grade_level=c.grade_level,
            credits=c.credits,
            teacher_id=c.teacher_id,
            teacher_name=t_name,
            room=c.room,
            syllabus=c.syllabus
        ))
    return results

@router.post("", response_model=CourseResponse)
def create_course(data: CourseCreate, db: Session = Depends(get_db)):
    course = Course(
        course_code=data.course_code,
        course_name=data.course_name,
        department=data.department,
        grade_level=data.grade_level,
        credits=data.credits,
        teacher_id=data.teacher_id,
        room=data.room,
        syllabus=data.syllabus
    )
    db.add(course)
    db.commit()
    db.refresh(course)
    t_name = f"{course.teacher.first_name} {course.teacher.last_name}" if course.teacher else "Unassigned"
    return CourseResponse(
        id=course.id,
        course_code=course.course_code,
        course_name=course.course_name,
        department=course.department,
        grade_level=course.grade_level,
        credits=course.credits,
        teacher_id=course.teacher_id,
        teacher_name=t_name,
        room=course.room,
        syllabus=course.syllabus
    )

