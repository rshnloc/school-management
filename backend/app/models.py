from sqlalchemy import Column, Integer, String, Float, Text, Boolean, Date, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime, date
from .database import Base

class Student(Base):
    __tablename__ = "students"

    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(String(50), unique=True, index=True)
    first_name = Column(String(100), nullable=False)
    last_name = Column(String(100), nullable=False)
    email = Column(String(150), unique=True, index=True)
    grade_level = Column(String(50), nullable=False)
    section = Column(String(20), default="A")
    date_of_birth = Column(String(20), default="2008-05-15")
    gender = Column(String(20), default="Unspecified")
    address = Column(String(255), default="123 Example Street, Example City")
    guardian_name = Column(String(150), default="Guardian Example")
    guardian_phone = Column(String(50), default="+1-555-0100")
    guardian_email = Column(String(150), default="guardian.example@example.com")
    enrollment_date = Column(String(20), default="2024-09-01")
    status = Column(String(20), default="Active") # Active, Inactive, Graduated
    gpa = Column(Float, default=3.5)
    attendance_rate = Column(Float, default=95.0) # Percentage
    
    # AI Predictive Analytics Fields
    ai_risk_level = Column(String(20), default="Low") # Low, Medium, High
    ai_risk_score = Column(Float, default=12.5) # 0 to 100 scale
    ai_risk_factors = Column(Text, default="[]") # JSON list of factors
    ai_recommendation = Column(Text, default="Consistently meeting expectations.")
    last_risk_evaluation = Column(DateTime, default=datetime.utcnow)

    # Relationships
    attendances = relationship("Attendance", back_populates="student", cascade="all, delete-orphan")
    grades = relationship("Grade", back_populates="student", cascade="all, delete-orphan")
    submissions = relationship("AssignmentSubmission", back_populates="student", cascade="all, delete-orphan")
    invoices = relationship("FeeInvoice", back_populates="student", cascade="all, delete-orphan")


class Teacher(Base):
    __tablename__ = "teachers"

    id = Column(Integer, primary_key=True, index=True)
    teacher_id = Column(String(50), unique=True, index=True)
    first_name = Column(String(100), nullable=False)
    last_name = Column(String(100), nullable=False)
    email = Column(String(150), unique=True, index=True)
    department = Column(String(100), nullable=False)
    subject_specialty = Column(String(100), nullable=False)
    phone = Column(String(50), default="+1-555-0199")
    office_room = Column(String(50), default="Room 204")
    qualification = Column(String(100), default="M.Sc., B.Ed.")
    status = Column(String(20), default="Active")

    courses = relationship("Course", back_populates="teacher")
    timetable_slots = relationship("TimetableSlot", back_populates="teacher")


class Course(Base):
    __tablename__ = "courses"

    id = Column(Integer, primary_key=True, index=True)
    course_code = Column(String(20), unique=True, index=True)
    course_name = Column(String(150), nullable=False)
    department = Column(String(100), nullable=False)
    grade_level = Column(String(50), nullable=False)
    credits = Column(Integer, default=3)
    teacher_id = Column(Integer, ForeignKey("teachers.id"), nullable=True)
    room = Column(String(50), default="Hall 101")
    syllabus = Column(Text, default="Standard curriculum syllabus guidelines.")

    teacher = relationship("Teacher", back_populates="courses")
    grades = relationship("Grade", back_populates="course")
    submissions = relationship("AssignmentSubmission", back_populates="course")
    timetable_slots = relationship("TimetableSlot", back_populates="course")


class Attendance(Base):
    __tablename__ = "attendance"

    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(Integer, ForeignKey("students.id"), nullable=False)
    date = Column(String(20), nullable=False) # YYYY-MM-DD
    status = Column(String(20), nullable=False) # Present, Absent, Late, Excused
    remarks = Column(String(255), default="")

    student = relationship("Student", back_populates="attendances")


class Grade(Base):
    __tablename__ = "grades"

    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(Integer, ForeignKey("students.id"), nullable=False)
    course_id = Column(Integer, ForeignKey("courses.id"), nullable=False)
    assessment_name = Column(String(150), nullable=False) # e.g. "Unit 1 Quiz", "Midterm Exam"
    assessment_type = Column(String(50), default="Exam") # Exam, Quiz, Homework, Project
    max_score = Column(Float, default=100.0)
    score = Column(Float, nullable=False)
    date = Column(String(20), default=lambda: datetime.utcnow().strftime("%Y-%m-%d"))
    remarks = Column(String(255), default="")

    student = relationship("Student", back_populates="grades")
    course = relationship("Course", back_populates="grades")


class AssignmentSubmission(Base):
    __tablename__ = "assignment_submissions"

    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(Integer, ForeignKey("students.id"), nullable=False)
    course_id = Column(Integer, ForeignKey("courses.id"), nullable=False)
    title = Column(String(200), nullable=False)
    prompt = Column(Text, nullable=False)
    submission_text = Column(Text, nullable=False)
    submitted_at = Column(DateTime, default=datetime.utcnow)
    status = Column(String(50), default="AI_Graded") # Submitted, AI_Graded, Finalized
    score = Column(Float, default=0.0)
    letter_grade = Column(String(10), default="B")
    ai_rubric_json = Column(Text, default="{}")
    ai_feedback = Column(Text, default="")
    teacher_notes = Column(Text, default="")

    student = relationship("Student", back_populates="submissions")
    course = relationship("Course", back_populates="submissions")


class TimetableSlot(Base):
    __tablename__ = "timetable_slots"

    id = Column(Integer, primary_key=True, index=True)
    day_of_week = Column(String(20), nullable=False) # Monday, Tuesday, Wednesday, Thursday, Friday
    period = Column(Integer, nullable=False) # 1 through 6
    start_time = Column(String(20), nullable=False) # e.g. "08:30"
    end_time = Column(String(20), nullable=False) # e.g. "09:25"
    course_id = Column(Integer, ForeignKey("courses.id"), nullable=False)
    teacher_id = Column(Integer, ForeignKey("teachers.id"), nullable=False)
    grade_section = Column(String(50), nullable=False) # e.g. "Grade 10-A"
    room_name = Column(String(50), default="Room 101")

    course = relationship("Course", back_populates="timetable_slots")
    teacher = relationship("Teacher", back_populates="timetable_slots")


class FeeInvoice(Base):
    __tablename__ = "fee_invoices"

    id = Column(Integer, primary_key=True, index=True)
    invoice_number = Column(String(50), unique=True, index=True)
    student_id = Column(Integer, ForeignKey("students.id"), nullable=False)
    title = Column(String(150), nullable=False) # e.g. "Fall Term Tuition", "Lab & Tech Fee"
    amount = Column(Float, nullable=False)
    due_date = Column(String(20), nullable=False)
    status = Column(String(20), default="Pending") # Paid, Pending, Overdue
    paid_date = Column(String(20), nullable=True)
    payment_method = Column(String(50), nullable=True)

    student = relationship("Student", back_populates="invoices")


class Announcement(Base):
    __tablename__ = "announcements"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(200), nullable=False)
    content = Column(Text, nullable=False)
    category = Column(String(50), default="General") # Academic, Event, Urgent, General, AI-Alert
    target_audience = Column(String(50), default="All") # All, Students, Teachers, Parents
    author = Column(String(100), default="Administration")
    created_at = Column(DateTime, default=datetime.utcnow)
    pinned = Column(Boolean, default=False)

