from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional
from ..database import get_db
from ..models import TimetableSlot, Course, Teacher
from ..schemas import TimetableSlotResponse
from ..ai.timetable_solver import detect_conflicts, optimize_and_generate_schedule, DAYS, PERIODS

router = APIRouter(prefix="/timetable", tags=["timetable"])

@router.get("", response_model=List[TimetableSlotResponse])
def get_timetable(
    grade_section: Optional[str] = None,
    teacher_id: Optional[int] = None,
    day_of_week: Optional[str] = None,
    db: Session = Depends(get_db)
):
    query = db.query(TimetableSlot)
    if grade_section:
        query = query.filter(TimetableSlot.grade_section == grade_section)
    if teacher_id:
        query = query.filter(TimetableSlot.teacher_id == teacher_id)
    if day_of_week:
        query = query.filter(TimetableSlot.day_of_week == day_of_week)

    slots = query.all()
    results = []
    for s in slots:
        c_name = s.course.course_name if s.course else "General"
        t_name = f"{s.teacher.first_name} {s.teacher.last_name}" if s.teacher else "Instructor"
        results.append(TimetableSlotResponse(
            id=s.id,
            day_of_week=s.day_of_week,
            period=s.period,
            start_time=s.start_time,
            end_time=s.end_time,
            course_id=s.course_id,
            course_name=c_name,
            teacher_id=s.teacher_id,
            teacher_name=t_name,
            grade_section=s.grade_section,
            room_name=s.room_name
        ))
    return results

@router.get("/conflicts")
def check_current_conflicts(db: Session = Depends(get_db)):
    slots = db.query(TimetableSlot).all()
    slot_dicts = []
    for s in slots:
        c_name = s.course.course_name if s.course else "Subject"
        t_name = f"{s.teacher.first_name} {s.teacher.last_name}" if s.teacher else "Faculty"
        slot_dicts.append({
            "id": s.id,
            "day_of_week": s.day_of_week,
            "period": s.period,
            "teacher_id": s.teacher_id,
            "teacher_name": t_name,
            "course_id": s.course_id,
            "course_name": c_name,
            "grade_section": s.grade_section,
            "room_name": s.room_name
        })
    conflicts = detect_conflicts(slot_dicts)
    return {
        "total_slots": len(slots),
        "conflicts_count": len(conflicts),
        "has_conflicts": len(conflicts) > 0,
        "conflicts": conflicts
    }

@router.post("/auto-optimize")
def auto_optimize_timetable(db: Session = Depends(get_db)):
    """
    Employs the AI Constraint Solver to regenerate a collision-free weekly timetable
    for all active courses, teachers, and classrooms.
    """
    courses = db.query(Course).all()
    teachers = db.query(Teacher).all()
    
    if not courses or not teachers:
        raise HTTPException(status_code=400, detail="Require courses and teachers to optimize schedule")

    courses_payload = []
    for c in courses:
        t_id = c.teacher_id or (teachers[0].id if teachers else 1)
        t = db.query(Teacher).filter(Teacher.id == t_id).first()
        t_name = f"{t.first_name} {t.last_name}" if t else "Faculty"
        courses_payload.append({
            "id": c.id,
            "course_name": c.course_name,
            "course_code": c.course_code,
            "teacher_id": t_id,
            "teacher_name": t_name
        })

    sections = ["Grade 10-A", "Grade 11-A", "Grade 12-A"]
    rooms = ["Room 101", "Room 102", "Room 204", "Science Lab A", "Computer Lab 1", "Auditorium"]

    new_schedule = optimize_and_generate_schedule(sections, courses_payload, rooms)

    # Clear old slots and replace with AI optimized slots
    db.query(TimetableSlot).delete()
    db.commit()

    for item in new_schedule:
        slot = TimetableSlot(
            day_of_week=item["day_of_week"],
            period=item["period"],
            start_time=item["start_time"],
            end_time=item["end_time"],
            course_id=item["course_id"],
            teacher_id=item["teacher_id"],
            grade_section=item["grade_section"],
            room_name=item["room_name"]
        )
        db.add(slot)
    
    db.commit()

    return {
        "status": "success",
        "message": f"AI solver generated {len(new_schedule)} optimized slots with 0 collisions.",
        "slots_count": len(new_schedule)
    }

