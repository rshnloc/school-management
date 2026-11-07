from pydantic import BaseModel, EmailStr, Field
from typing import List, Optional, Dict, Any
from datetime import datetime

# Student Schemas
class StudentBase(BaseModel):
    first_name: str
    last_name: str
    email: str
    grade_level: str
    section: str = "A"
    date_of_birth: str = "2008-05-15"
    gender: str = "Unspecified"
    address: str = "123 Example Street, Example City"
    guardian_name: str = "Guardian Example"
    guardian_phone: str = "+1-555-0100"
    guardian_email: str = "guardian.example@example.com"
    status: str = "Active"

class StudentCreate(StudentBase):
    pass

class StudentUpdate(BaseModel):
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    email: Optional[str] = None
    grade_level: Optional[str] = None
    section: Optional[str] = None
    status: Optional[str] = None
    guardian_phone: Optional[str] = None
    guardian_email: Optional[str] = None

class StudentResponse(StudentBase):
    id: int
    student_id: str
    enrollment_date: str
    gpa: float
    attendance_rate: float
    ai_risk_level: str
    ai_risk_score: float
    ai_risk_factors: str
    ai_recommendation: str

    class Config:
        from_attributes = True

# Teacher Schemas
class TeacherBase(BaseModel):
    first_name: str
    last_name: str
    email: str
    department: str
    subject_specialty: str
    phone: str = "+1-555-0199"
    office_room: str = "Room 204"
    qualification: str = "M.Sc., B.Ed."
    status: str = "Active"

class TeacherCreate(TeacherBase):
    pass

class TeacherResponse(TeacherBase):
    id: int
    teacher_id: str

    class Config:
        from_attributes = True

# Course Schemas
class CourseBase(BaseModel):
    course_code: str
    course_name: str
    department: str
    grade_level: str
    credits: int = 3
    teacher_id: Optional[int] = None
    room: str = "Hall 101"
    syllabus: str = "Standard curriculum syllabus guidelines."

class CourseCreate(CourseBase):
    pass

class CourseResponse(CourseBase):
    id: int
    teacher_name: Optional[str] = None

    class Config:
        from_attributes = True

# Attendance Schemas
class AttendanceRecord(BaseModel):
    student_id: int
    date: str
    status: str # Present, Absent, Late, Excused
    remarks: Optional[str] = ""

class AttendanceBatchCreate(BaseModel):
    records: List[AttendanceRecord]

class AttendanceResponse(AttendanceRecord):
    id: int
    student_name: Optional[str] = None

    class Config:
        from_attributes = True

# Grade Schemas
class GradeCreate(BaseModel):
    student_id: int
    course_id: int
    assessment_name: str
    assessment_type: str = "Exam"
    max_score: float = 100.0
    score: float
    remarks: Optional[str] = ""

class GradeResponse(GradeCreate):
    id: int
    date: str
    student_name: Optional[str] = None
    course_name: Optional[str] = None

    class Config:
        from_attributes = True

# Fee Schemas
class FeeInvoiceResponse(BaseModel):
    id: int
    invoice_number: str
    student_id: int
    student_name: Optional[str] = None
    title: str
    amount: float
    due_date: str
    status: str
    paid_date: Optional[str] = None
    payment_method: Optional[str] = None

    class Config:
        from_attributes = True

class FeePayRequest(BaseModel):
    payment_method: str = "Online Bank Transfer (Demo)"

# Timetable Schemas
class TimetableSlotResponse(BaseModel):
    id: int
    day_of_week: str
    period: int
    start_time: str
    end_time: str
    course_id: int
    course_name: Optional[str] = None
    teacher_id: int
    teacher_name: Optional[str] = None
    grade_section: str
    room_name: str

    class Config:
        from_attributes = True

# Announcement Schemas
class AnnouncementCreate(BaseModel):
    title: str
    content: str
    category: str = "General"
    target_audience: str = "All"
    pinned: bool = False

class AnnouncementResponse(AnnouncementCreate):
    id: int
    author: str
    created_at: datetime

    class Config:
        from_attributes = True

# AI Schemas
class AutoGradeRequest(BaseModel):
    student_id: int
    course_id: int
    assignment_title: str
    rubric_guidelines: Optional[str] = "Evaluate clarity, thesis development, argument rigor, evidence, and grammatical mechanics."
    submission_text: str

class LessonPlanRequest(BaseModel):
    subject: str
    topic: str
    grade_level: str
    duration_minutes: int = 45
    objectives: Optional[str] = ""
    include_quiz: bool = True

class EduBotChatRequest(BaseModel):
    message: str
    user_role: str = "student" # student, teacher, parent, admin
    chat_history: Optional[List[Dict[str, str]]] = []

class TimetableConflictCheckRequest(BaseModel):
    slots: List[Dict[str, Any]]

class BehaviorAnalysisRequest(BaseModel):
    student_id: int
    context_type: str = "Teacher Observation" # Teacher Observation, Student Reflection, Counselor Note
    notes_text: str

class ReportCommentRequest(BaseModel):
    student_id: int
    course_name: str
    grade_percentage: float
    effort_level: str = "Consistent"
    strength_focus: str = "Analytical problem-solving"


