"""
AI Timetable Optimizer & Constraint Satisfaction Solver.
Detects scheduling collisions and generates balanced, conflict-free weekly timetables.
"""
from typing import List, Dict, Any

DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"]
PERIODS = [
    {"period": 1, "start": "08:30", "end": "09:20"},
    {"period": 2, "start": "09:25", "end": "10:15"},
    {"period": 3, "start": "10:30", "end": "11:20"},
    {"period": 4, "start": "11:25", "end": "12:15"},
    {"period": 5, "start": "13:00", "end": "13:50"},
    {"period": 6, "start": "13:55", "end": "14:45"},
]

def detect_conflicts(slots: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
    """
    Checks for:
    1. Teacher double-booking (same teacher, day, period)
    2. Room double-booking (same room, day, period)
    3. Student section double-booking (same section, day, period)
    """
    conflicts = []
    seen_teacher = {}
    seen_room = {}
    seen_section = {}

    for idx, slot in enumerate(slots):
        day = slot.get("day_of_week")
        period = slot.get("period")
        t_id = slot.get("teacher_id")
        t_name = slot.get("teacher_name", f"Teacher #{t_id}")
        room = slot.get("room_name")
        section = slot.get("grade_section")
        c_name = slot.get("course_name", f"Course #{slot.get('course_id')}")

        time_key = f"{day}-P{period}"

        # 1. Teacher check
        if t_id:
            t_key = f"{t_id}@{time_key}"
            if t_key in seen_teacher:
                conflicts.append({
                    "type": "Teacher Conflict",
                    "severity": "High",
                    "description": f"{t_name} is double-booked on {day} Period {period} between '{seen_teacher[t_key]['course_name']}' and '{c_name}'.",
                    "slots": [seen_teacher[t_key]["index"], idx]
                })
            else:
                seen_teacher[t_key] = {"index": idx, "course_name": c_name}

        # 2. Room check
        if room:
            r_key = f"{room}@{time_key}"
            if r_key in seen_room:
                conflicts.append({
                    "type": "Room Collision",
                    "severity": "Medium",
                    "description": f"Room '{room}' is assigned to multiple classes on {day} Period {period} ('{seen_room[r_key]['course_name']}' and '{c_name}').",
                    "slots": [seen_room[r_key]["index"], idx]
                })
            else:
                seen_room[r_key] = {"index": idx, "course_name": c_name}

        # 3. Section check
        if section:
            s_key = f"{section}@{time_key}"
            if s_key in seen_section:
                conflicts.append({
                    "type": "Class Section Overlap",
                    "severity": "High",
                    "description": f"Class '{section}' has overlapping courses scheduled on {day} Period {period}.",
                    "slots": [seen_section[s_key]["index"], idx]
                })
            else:
                seen_section[s_key] = {"index": idx, "course_name": c_name}

    return conflicts

def optimize_and_generate_schedule(
    sections: List[str],
    courses_with_teachers: List[Dict[str, Any]],
    rooms: List[str]
) -> List[Dict[str, Any]]:
    """
    AI heuristic constraint solver to distribute course allocations
    evenly across the 5 days and 6 periods without collisions.
    """
    schedule = []
    teacher_busy = set() # (day, period, teacher_id)
    room_busy = set()    # (day, period, room)
    section_busy = set() # (day, period, section)

    for section in sections:
        # We need to fill up the week for this section
        for day in DAYS:
            for p_info in PERIODS:
                period = p_info["period"]
                if (day, period, section) in section_busy:
                    continue

                # Find a suitable course for this section
                assigned = False
                for c in courses_with_teachers:
                    t_id = c.get("teacher_id")
                    if (day, period, t_id) not in teacher_busy:
                        # Find an open room
                        chosen_room = None
                        for r in rooms:
                            if (day, period, r) not in room_busy:
                                chosen_room = r
                                break

                        if chosen_room:
                            # Allocate slot
                            teacher_busy.add((day, period, t_id))
                            room_busy.add((day, period, chosen_room))
                            section_busy.add((day, period, section))
                            
                            schedule.append({
                                "day_of_week": day,
                                "period": period,
                                "start_time": p_info["start"],
                                "end_time": p_info["end"],
                                "course_id": c["id"],
                                "course_name": c["course_name"],
                                "course_code": c["course_code"],
                                "teacher_id": t_id,
                                "teacher_name": c.get("teacher_name", "Assigned Faculty"),
                                "grade_section": section,
                                "room_name": chosen_room
                            })
                            assigned = True
                            break

    return schedule

