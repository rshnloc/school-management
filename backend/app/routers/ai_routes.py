from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import Dict, Any, List
import json
from ..database import get_db
from ..models import Student, Course, AssignmentSubmission, Attendance, Grade
from ..schemas import AutoGradeRequest, LessonPlanRequest, EduBotChatRequest, BehaviorAnalysisRequest, ReportCommentRequest
from ..ai.risk_predictor import predict_student_risk
from ..ai.auto_grader import analyze_and_grade_submission
from ..ai.lesson_planner import generate_lesson_plan
from ..ai.edubot import generate_chat_response
from ..ai.behavior_analyzer import analyze_student_behavior
from ..ai.comment_generator import generate_report_comments

router = APIRouter(prefix="/ai", tags=["ai"])

@router.post("/predict-risk/{student_id}")
def evaluate_student_risk(student_id: int, db: Session = Depends(get_db)):
    student = db.query(Student).filter(Student.id == student_id).first()
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")

    result = predict_student_risk(student, db)
    student.attendance_rate = result["attendance_rate"]
    student.ai_risk_level = result["risk_level"]
    student.ai_risk_score = result["risk_score"]
    student.ai_risk_factors = json.dumps(result["factors"])
    student.ai_recommendation = result["recommendation"]
    db.commit()

    return {
        "student_id": student.id,
        "student_name": f"{student.first_name} {student.last_name}",
        "grade_level": student.grade_level,
        "evaluation": result
    }

@router.post("/batch-evaluate-risk")
def batch_evaluate_risk(db: Session = Depends(get_db)):
    students = db.query(Student).all()
    results = []
    for s in students:
        eval_res = predict_student_risk(s, db)
        s.attendance_rate = eval_res["attendance_rate"]
        s.ai_risk_level = eval_res["risk_level"]
        s.ai_risk_score = eval_res["risk_score"]
        s.ai_risk_factors = json.dumps(eval_res["factors"])
        s.ai_recommendation = eval_res["recommendation"]
        results.append({
            "id": s.id,
            "name": f"{s.first_name} {s.last_name}",
            "grade_level": s.grade_level,
            "risk_score": eval_res["risk_score"],
            "risk_level": eval_res["risk_level"],
            "recommendation": eval_res["recommendation"]
        })
    db.commit()
    return {
        "total_evaluated": len(students),
        "results": sorted(results, key=lambda x: x["risk_score"], reverse=True)
    }

@router.post("/auto-grade")
def auto_grade_submission(req: AutoGradeRequest, db: Session = Depends(get_db)):
    student = db.query(Student).filter(Student.id == req.student_id).first()
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")
    
    course = db.query(Course).filter(Course.id == req.course_id).first()
    if not course:
        raise HTTPException(status_code=404, detail="Course not found")

    analysis = analyze_and_grade_submission(
        title=req.assignment_title,
        prompt=course.syllabus or "Analyze and discuss the fundamental concepts.",
        text=req.submission_text,
        rubric_guidelines=req.rubric_guidelines or ""
    )

    # Save submission record
    sub = AssignmentSubmission(
        student_id=req.student_id,
        course_id=req.course_id,
        title=req.assignment_title,
        prompt=course.course_name,
        submission_text=req.submission_text,
        status="AI_Graded",
        score=analysis["score"],
        letter_grade=analysis["letter_grade"],
        ai_rubric_json=json.dumps(analysis["rubric_breakdown"]),
        ai_feedback=analysis["feedback_summary"],
        teacher_notes="Verified by Nexora Automated Rubric Analysis."
    )
    db.add(sub)
    db.commit()
    db.refresh(sub)

    return {
        "submission_id": sub.id,
        "student_name": f"{student.first_name} {student.last_name}",
        "course_name": course.course_name,
        "title": req.assignment_title,
        "score": analysis["score"],
        "letter_grade": analysis["letter_grade"],
        "metrics": {
            "word_count": analysis["word_count"],
            "sentence_count": analysis["sentence_count"],
            "paragraph_count": analysis["paragraph_count"],
            "lexical_diversity": analysis["lexical_diversity"]
        },
        "rubric_breakdown": analysis["rubric_breakdown"],
        "strengths": analysis["strengths"],
        "improvements": analysis["improvements"],
        "feedback_summary": analysis["feedback_summary"]
    }

@router.post("/generate-lesson-plan")
def create_ai_lesson_plan(req: LessonPlanRequest):
    plan = generate_lesson_plan(
        subject=req.subject,
        topic=req.topic,
        grade_level=req.grade_level,
        duration_minutes=req.duration_minutes,
        objectives=req.objectives or "",
        include_quiz=req.include_quiz
    )
    return plan

@router.post("/chat")
def edubot_chat(req: EduBotChatRequest):
    res = generate_chat_response(
        message=req.message,
        user_role=req.user_role,
        history=req.chat_history
    )
    return res

@router.post("/analyze-behavior")
def evaluate_student_behavior(req: BehaviorAnalysisRequest, db: Session = Depends(get_db)):
    student = db.query(Student).filter(Student.id == req.student_id).first()
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")

    analysis = analyze_student_behavior(
        student_name=f"{student.first_name} {student.last_name}",
        context_type=req.context_type,
        notes_text=req.notes_text
    )
    return analysis

@router.post("/generate-report-comment")
def create_report_comment(req: ReportCommentRequest, db: Session = Depends(get_db)):
    student = db.query(Student).filter(Student.id == req.student_id).first()
    student_name = f"{student.first_name} {student.last_name}" if student else "Student"

    result = generate_report_comments(
        student_name=student_name,
        subject=req.course_name,
        grade_percentage=req.grade_percentage,
        effort_level=req.effort_level,
        strength_focus=req.strength_focus
    )
    return result

@router.get("/analytics-overview")
def get_analytics_overview(db: Session = Depends(get_db)):
    students = db.query(Student).all()
    total_students = len(students)
    
    high_risk = sum(1 for s in students if s.ai_risk_level == "High")
    med_risk = sum(1 for s in students if s.ai_risk_level == "Medium")
    low_risk = sum(1 for s in students if s.ai_risk_level == "Low")
    
    avg_gpa = round(sum(s.gpa for s in students) / max(1, total_students), 2)
    avg_attendance = round(sum(s.attendance_rate for s in students) / max(1, total_students), 1)

    # Top at-risk students needing intervention
    sorted_risk = sorted(students, key=lambda s: s.ai_risk_score, reverse=True)[:5]
    intervention_roster = []
    for s in sorted_risk:
        intervention_roster.append({
            "id": s.id,
            "student_id": s.student_id,
            "name": f"{s.first_name} {s.last_name}",
            "grade_level": s.grade_level,
            "risk_score": s.ai_risk_score,
            "risk_level": s.ai_risk_level,
            "attendance_rate": s.attendance_rate,
            "gpa": s.gpa,
            "recommendation": s.ai_recommendation
        })

    return {
        "total_students": total_students,
        "average_gpa": avg_gpa,
        "average_attendance": avg_attendance,
        "risk_breakdown": {
            "high": high_risk,
            "medium": med_risk,
            "low": low_risk
        },
        "intervention_roster": intervention_roster
    }

