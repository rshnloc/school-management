"""
AI Early Warning & Student At-Risk Prediction System.
Uses algorithmic multi-attribute predictive modeling to assess dropout & failure risk,
detecting negative momentum early before term exams.
"""
import json
from typing import Dict, Any, List
from sqlalchemy.orm import Session
from ..models import Student, Attendance, Grade, AssignmentSubmission

def predict_student_risk(student: Student, db: Session) -> Dict[str, Any]:
    """
    Evaluates academic, attendance, and assignment metrics to calculate
    an at-risk score (0 to 100) and personalized intervention strategy.
    """
    # 1. Attendance Analysis
    attendances = db.query(Attendance).filter(Attendance.student_id == student.id).all()
    total_att = len(attendances)
    if total_att > 0:
        present_count = sum(1 for a in attendances if a.status in ["Present", "Excused"])
        late_count = sum(1 for a in attendances if a.status == "Late")
        absent_count = sum(1 for a in attendances if a.status == "Absent")
        att_rate = ((present_count + (late_count * 0.5)) / total_att) * 100.0
    else:
        att_rate = student.attendance_rate or 95.0
        absent_count = 0
        late_count = 0

    # 2. Grades Analysis
    grades = db.query(Grade).filter(Grade.student_id == student.id).all()
    if grades:
        scores = [g.score for g in grades]
        avg_score = sum(scores) / len(scores)
        failing_grades_count = sum(1 for g in grades if g.score < 60)
        # Recent momentum: compare last 2 vs previous
        if len(scores) >= 3:
            recent_avg = sum(scores[-2:]) / 2.0
            prior_avg = sum(scores[:-2]) / len(scores[:-2])
            momentum = recent_avg - prior_avg # negative means deteriorating
        else:
            momentum = 0.0
    else:
        avg_score = 80.0
        failing_grades_count = 0
        momentum = 0.0

    # 3. Assignment Analysis
    submissions = db.query(AssignmentSubmission).filter(AssignmentSubmission.student_id == student.id).all()
    sub_scores = [s.score for s in submissions if s.score > 0]
    avg_sub_score = (sum(sub_scores) / len(sub_scores)) if sub_scores else avg_score

    # 4. Multi-Factor Score Calculation (0 to 100, where 100 is maximum risk)
    # Factor weights:
    # Attendance Risk: 35%
    # Academic Score Risk: 40%
    # Momentum / Trend Risk: 15%
    # Failing Assessments Count: 10%

    # Attendance component (ideal is 100%)
    if att_rate >= 90:
        att_risk = (100 - att_rate) * 1.5 # 0-15
    elif att_rate >= 75:
        att_risk = 15 + (90 - att_rate) * 2.5 # 15-52.5
    else:
        att_risk = 52.5 + min(47.5, (75 - att_rate) * 2.0)

    # Academic score component (ideal is 100%)
    if avg_score >= 85:
        acad_risk = (100 - avg_score) * 0.5 # 0-7.5
    elif avg_score >= 70:
        acad_risk = 7.5 + (85 - avg_score) * 2.0 # 7.5-37.5
    elif avg_score >= 60:
        acad_risk = 37.5 + (70 - avg_score) * 3.0 # 37.5-67.5
    else:
        acad_risk = 67.5 + min(32.5, (60 - avg_score) * 2.0)

    # Momentum component (negative momentum increases risk)
    momentum_risk = 0.0
    if momentum < -10:
        momentum_risk = 25.0
    elif momentum < -5:
        momentum_risk = 15.0
    elif momentum < 0:
        momentum_risk = 5.0
    else:
        momentum_risk = 0.0

    # Failing grades penalty
    fail_penalty = min(25.0, failing_grades_count * 8.0)

    # Combined composite risk score
    composite_risk = (att_risk * 0.35) + (acad_risk * 0.40) + (momentum_risk * 0.15) + (fail_penalty * 0.10)
    composite_risk = max(2.0, min(98.5, round(composite_risk, 1)))

    # Identify primary contributing risk factors
    factors = []
    if att_rate < 80:
        factors.append(f"Critical attendance deficit: {att_rate:.1f}% attendance with {absent_count} recorded absences.")
    elif att_rate < 90:
        factors.append(f"Suboptimal attendance pattern: {att_rate:.1f}% with occasional unexcused absences.")

    if failing_grades_count > 0:
        factors.append(f"Recorded {failing_grades_count} assessment(s) below passing threshold (60%).")

    if momentum < -5:
        factors.append(f"Downtrend in recent performance trajectory ({momentum:+.1f} point shift).")

    if avg_score < 70:
        factors.append(f"Overall academic average is low ({avg_score:.1f}%).")

    if not factors:
        factors.append("Consistent attendance and solid academic grade stability.")

    # Determine risk category
    if composite_risk >= 65:
        level = "High"
        recommendation = (
            f"URGENT INTERVENTION: Schedule academic counseling session immediately. "
            f"Coordinate 1-on-1 subject remediation in struggling topics. Alert guardian "
            f"({student.guardian_name}) regarding {absent_count} absences and initiate peer study mentoring."
        )
    elif composite_risk >= 35:
        level = "Medium"
        recommendation = (
            f"PROACTIVE MONITORING: Recommend teacher check-ins after weekly quizzes. "
            f"Encourage attendance at after-school study labs to reverse the recent score momentum. "
            f"Send bi-weekly progress alert to guardian."
        )
    else:
        level = "Low"
        recommendation = (
            f"EXEMPLARY TRAJECTORY: Student demonstrates sound mastery ({avg_score:.1f}% avg) "
            f"and high attendance stability ({att_rate:.1f}%). Eligible for advanced enrichment modules."
        )

    return {
        "risk_score": composite_risk,
        "risk_level": level,
        "attendance_rate": round(att_rate, 1),
        "avg_score": round(avg_score, 1),
        "factors": factors,
        "recommendation": recommendation
    }

