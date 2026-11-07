"""
Database Seed Script with Example Data.
Fully compliant with strict zero-PII and zero-credential guidelines.
All records use fictional names, example domains (@example.com), and 555-telephony numbers.
"""
from sqlalchemy.orm import Session
from datetime import datetime, timedelta
import json
from .models import Student, Teacher, Course, Attendance, Grade, TimetableSlot, FeeInvoice, Announcement
from .ai.risk_predictor import predict_student_risk

def seed_database(db: Session):
    # Only seed if database is empty
    if db.query(Student).first():
        return

    print("Seeding initial example school database...")

    # 1. Teachers (Faculty)
    teachers_data = [
        {
            "teacher_id": "TCH-101",
            "first_name": "Dr. Eleanor",
            "last_name": "Vance",
            "email": "dr.vance@example.com",
            "department": "Sciences",
            "subject_specialty": "AP Physics & Mechanics",
            "phone": "+1-555-0191",
            "office_room": "Lab Bldg 302",
            "qualification": "Ph.D. in Applied Physics"
        },
        {
            "teacher_id": "TCH-102",
            "first_name": "Prof. Marcus",
            "last_name": "Sterling",
            "email": "prof.sterling@example.com",
            "department": "Mathematics",
            "subject_specialty": "Calculus BC & Statistics",
            "phone": "+1-555-0192",
            "office_room": "Math Tower 104",
            "qualification": "M.Sc. in Pure Mathematics"
        },
        {
            "teacher_id": "TCH-103",
            "first_name": "Ms. Clara",
            "last_name": "Oswald",
            "email": "ms.oswald@example.com",
            "department": "Humanities",
            "subject_specialty": "World Literature & Composition",
            "phone": "+1-555-0193",
            "office_room": "Humanities Hall 210",
            "qualification": "M.A. in English Literature"
        },
        {
            "teacher_id": "TCH-104",
            "first_name": "Mr. Alan",
            "last_name": "Turing",
            "email": "mr.turing@example.com",
            "department": "Computer Science",
            "subject_specialty": "Data Structures & AI Foundations",
            "phone": "+1-555-0194",
            "office_room": "Tech Lab 401",
            "qualification": "M.Tech in Computer Science"
        },
        {
            "teacher_id": "TCH-105",
            "first_name": "Dr. Sarah",
            "last_name": "Lin",
            "email": "dr.lin@example.com",
            "department": "Social Sciences",
            "subject_specialty": "Global Economics & Civics",
            "phone": "+1-555-0195",
            "office_room": "Hall 115",
            "qualification": "Ph.D. in Political Economy"
        }
    ]

    teacher_objs = []
    for t in teachers_data:
        obj = Teacher(**t)
        db.add(obj)
        teacher_objs.append(obj)
    db.commit()

    # 2. Courses
    courses_data = [
        {
            "course_code": "PHYS-301",
            "course_name": "Advanced AP Physics",
            "department": "Sciences",
            "grade_level": "Grade 11",
            "credits": 4,
            "teacher_id": teacher_objs[0].id,
            "room": "Lab Bldg 302",
            "syllabus": "Classical mechanics, electromagnetism, wave thermodynamics, and optics."
        },
        {
            "course_code": "MATH-201",
            "course_name": "Calculus & Analytical Geometry",
            "department": "Mathematics",
            "grade_level": "Grade 11",
            "credits": 4,
            "teacher_id": teacher_objs[1].id,
            "room": "Math Tower 104",
            "syllabus": "Derivatives, integrals, limits, differential approximations, and Taylor series."
        },
        {
            "course_code": "LIT-101",
            "course_name": "World Literature & Rhetoric",
            "department": "Humanities",
            "grade_level": "Grade 10",
            "credits": 3,
            "teacher_id": teacher_objs[2].id,
            "room": "Humanities Hall 210",
            "syllabus": "Critical analysis of global texts, argumentative essays, and rhetoric."
        },
        {
            "course_code": "CS-202",
            "course_name": "Computer Science & AI Algorithms",
            "department": "Computer Science",
            "grade_level": "Grade 10",
            "credits": 3,
            "teacher_id": teacher_objs[3].id,
            "room": "Tech Lab 401",
            "syllabus": "Algorithm design, Python data structures, recursion, and machine learning principles."
        },
        {
            "course_code": "ECON-105",
            "course_name": "Macroeconomics & Global Trade",
            "department": "Social Sciences",
            "grade_level": "Grade 12",
            "credits": 3,
            "teacher_id": teacher_objs[4].id,
            "room": "Hall 115",
            "syllabus": "Fiscal policy, monetary theory, inflation metrics, and international exchange."
        }
    ]

    course_objs = []
    for c in courses_data:
        obj = Course(**c)
        db.add(obj)
        course_objs.append(obj)
    db.commit()

    # 3. Students (with diverse academic profiles to demonstrate AI Risk Engine)
    students_data = [
        {
            "student_id": "STU-2024-001",
            "first_name": "Jordan",
            "last_name": "Carter",
            "email": "jordan.carter@example.com",
            "grade_level": "Grade 11",
            "section": "A",
            "date_of_birth": "2007-04-12",
            "gender": "Non-binary",
            "address": "100 Example Way, Example City, EX 10001",
            "guardian_name": "Guardian Carter",
            "guardian_phone": "+1-555-0111",
            "guardian_email": "guardian.carter@example.com",
            "gpa": 3.92,
            "attendance_rate": 98.5
        },
        {
            "student_id": "STU-2024-002",
            "first_name": "Casey",
            "last_name": "Taylor",
            "email": "casey.taylor@example.com",
            "grade_level": "Grade 11",
            "section": "A",
            "date_of_birth": "2007-09-23",
            "gender": "Female",
            "address": "102 Example Way, Example City, EX 10001",
            "guardian_name": "Guardian Taylor",
            "guardian_phone": "+1-555-0112",
            "guardian_email": "guardian.taylor@example.com",
            "gpa": 2.15,
            "attendance_rate": 72.0 # High risk candidate
        },
        {
            "student_id": "STU-2024-003",
            "first_name": "Avery",
            "last_name": "Brooks",
            "email": "avery.brooks@example.com",
            "grade_level": "Grade 10",
            "section": "A",
            "date_of_birth": "2008-02-18",
            "gender": "Male",
            "address": "104 Example Way, Example City, EX 10001",
            "guardian_name": "Guardian Brooks",
            "guardian_phone": "+1-555-0113",
            "guardian_email": "guardian.brooks@example.com",
            "gpa": 3.45,
            "attendance_rate": 94.0
        },
        {
            "student_id": "STU-2024-004",
            "first_name": "Morgan",
            "last_name": "Riley",
            "email": "morgan.riley@example.com",
            "grade_level": "Grade 10",
            "section": "A",
            "date_of_birth": "2008-11-05",
            "gender": "Female",
            "address": "106 Example Way, Example City, EX 10001",
            "guardian_name": "Guardian Riley",
            "guardian_phone": "+1-555-0114",
            "guardian_email": "guardian.riley@example.com",
            "gpa": 2.85,
            "attendance_rate": 84.5 # Medium risk candidate
        },
        {
            "student_id": "STU-2024-005",
            "first_name": "Dakota",
            "last_name": "Reed",
            "email": "dakota.reed@example.com",
            "grade_level": "Grade 12",
            "section": "A",
            "date_of_birth": "2006-08-30",
            "gender": "Male",
            "address": "108 Example Way, Example City, EX 10001",
            "guardian_name": "Guardian Reed",
            "guardian_phone": "+1-555-0115",
            "guardian_email": "guardian.reed@example.com",
            "gpa": 3.78,
            "attendance_rate": 96.0
        },
        {
            "student_id": "STU-2024-006",
            "first_name": "Quinn",
            "last_name": "Harper",
            "email": "quinn.harper@example.com",
            "grade_level": "Grade 12",
            "section": "A",
            "date_of_birth": "2006-12-14",
            "gender": "Non-binary",
            "address": "110 Example Way, Example City, EX 10001",
            "guardian_name": "Guardian Harper",
            "guardian_phone": "+1-555-0116",
            "guardian_email": "guardian.harper@example.com",
            "gpa": 1.95,
            "attendance_rate": 68.0 # High risk candidate
        }
    ]

    student_objs = []
    for s in students_data:
        obj = Student(**s)
        db.add(obj)
        student_objs.append(obj)
    db.commit()

    # 4. Generate Attendance History (past 14 days)
    today = datetime.utcnow().date()
    for s_idx, student in enumerate(student_objs):
        for day_offset in range(14, 0, -1):
            att_date = (today - timedelta(days=day_offset)).strftime("%Y-%m-%d")
            # Determine status based on student risk profile
            if student.attendance_rate < 75.0:
                # Often absent or late
                status = "Absent" if (day_offset % 3 == 0) else ("Late" if day_offset % 2 == 0 else "Present")
            elif student.attendance_rate < 88.0:
                status = "Late" if (day_offset % 4 == 0) else "Present"
            else:
                status = "Present" if day_offset != 7 else "Excused"

            att = Attendance(
                student_id=student.id,
                date=att_date,
                status=status,
                remarks="Routine roll call" if status == "Present" else "Unexcused absence"
            )
            db.add(att)
    db.commit()

    # 5. Grades History
    assessment_templates = [
        ("Quiz 1: Fundamentals", "Quiz", 100.0),
        ("Midterm Examination", "Exam", 100.0),
        ("Research Assignment", "Assignment", 100.0),
        ("Lab Practical Exercise", "Quiz", 100.0)
    ]

    for student in student_objs:
        for course in course_objs[:3]:
            for asm_name, asm_type, max_s in assessment_templates:
                if student.gpa >= 3.5:
                    score = 92.0 + (hash(f"{student.id}{course.id}{asm_name}") % 8)
                elif student.gpa >= 2.5:
                    score = 74.0 + (hash(f"{student.id}{course.id}{asm_name}") % 12)
                else:
                    score = 52.0 + (hash(f"{student.id}{course.id}{asm_name}") % 14)

                grade = Grade(
                    student_id=student.id,
                    course_id=course.id,
                    assessment_name=asm_name,
                    assessment_type=asm_type,
                    max_score=max_s,
                    score=min(100.0, max(40.0, float(score))),
                    remarks="Evaluated by faculty."
                )
                db.add(grade)
    db.commit()

    # 6. Run initial AI Risk Prediction for each student
    for student in student_objs:
        eval_res = predict_student_risk(student, db)
        student.attendance_rate = eval_res["attendance_rate"]
        student.ai_risk_level = eval_res["risk_level"]
        student.ai_risk_score = eval_res["risk_score"]
        student.ai_risk_factors = json.dumps(eval_res["factors"])
        student.ai_recommendation = eval_res["recommendation"]
    db.commit()

    # 7. Timetable Slots
    days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"]
    periods = [
        (1, "08:30", "09:20"),
        (2, "09:25", "10:15"),
        (3, "10:30", "11:20"),
        (4, "11:25", "12:15"),
        (5, "13:00", "13:50"),
        (6, "13:55", "14:45")
    ]

    slot_count = 0
    for day in days:
        for p_num, s_time, e_time in periods[:4]: # 4 periods per day
            c_idx = (slot_count) % len(course_objs)
            selected_course = course_objs[c_idx]
            slot = TimetableSlot(
                day_of_week=day,
                period=p_num,
                start_time=s_time,
                end_time=e_time,
                course_id=selected_course.id,
                teacher_id=selected_course.teacher_id,
                grade_section="Grade 11-A",
                room_name=selected_course.room
            )
            db.add(slot)
            slot_count += 1
    db.commit()

    # 8. Fee Invoices
    for s in student_objs:
        inv1 = FeeInvoice(
            invoice_number=f"INV-2024-{s.id:03d}-1",
            student_id=s.id,
            title="Fall 2024 Academic Tuition",
            amount=2450.00,
            due_date="2024-09-15",
            status="Paid" if s.id % 2 == 0 else "Pending",
            paid_date="2024-09-10" if s.id % 2 == 0 else None,
            payment_method="ACH Bank Transfer" if s.id % 2 == 0 else None
        )
        inv2 = FeeInvoice(
            invoice_number=f"INV-2024-{s.id:03d}-2",
            student_id=s.id,
            title="STEM Technology & Laboratory Fee",
            amount=320.00,
            due_date="2024-10-01",
            status="Paid",
            paid_date="2024-09-28",
            payment_method="Credit Card"
        )
        db.add(inv1)
        db.add(inv2)
    db.commit()

    # 9. Announcements
    announcements_data = [
        {
            "title": "Welcome to the 2024-2025 Academic Year",
            "content": "Nexora Academy welcomes all returning and incoming scholars. Campus orientation sessions and course registrations are officially complete.",
            "category": "General",
            "target_audience": "All",
            "pinned": True
        },
        {
            "title": "AI Early-Warning System Active for Midterm Prep",
            "content": "Faculty and students can now access personalized AI study diagnostics and predictive mastery analytics in their respective dashboards.",
            "category": "Academic",
            "target_audience": "All",
            "pinned": True
        },
        {
            "title": "Annual STEM & Robotics Exhibition Registration Open",
            "content": "Students interested in participating in the regional Robotics and AI hackathon must register their team proposals by next Friday.",
            "category": "Event",
            "target_audience": "Students",
            "pinned": False
        },
        {
            "title": "Parent-Teacher Advisory Conference Scheduled",
            "content": "Individual 15-minute consultations regarding student progression and intervention strategies will be conducted on October 25th.",
            "category": "General",
            "target_audience": "Parents",
            "pinned": False
        }
    ]

    for a in announcements_data:
        db.add(Announcement(**a, author="Administration"))
    db.commit()

    print("Database successfully seeded with clean example data.")

