"""
AI Report Card Comment Generator.
Generates personalized, professionally phrased, constructive report card remarks
tailored to academic performance, classroom effort, and growth trajectories.
Zero external cloud keys required.
"""
from typing import Dict, Any, List

def generate_report_comments(
    student_name: str,
    subject: str,
    grade_percentage: float,
    effort_level: str = "Consistent", # "Exemplary", "Consistent", "Inconsistent", "Needs Motivation"
    strength_focus: str = "Analytical problem-solving"
) -> Dict[str, Any]:
    first_name = student_name.split()[0] if student_name else "Student"
    
    # Tier assessment
    if grade_percentage >= 90:
        perf_tier = "Distinction"
    elif grade_percentage >= 80:
        perf_tier = "Commendable"
    elif grade_percentage >= 70:
        perf_tier = "Proficient"
    elif grade_percentage >= 60:
        perf_tier = "Developing"
    else:
        perf_tier = "Needs Remediation"

    # Option 1: Balanced & Professional
    if perf_tier in ["Distinction", "Commendable"]:
        opt1 = (
            f"{first_name} has demonstrated exemplary mastery in {subject} this academic term, earning a score of {grade_percentage:.1f}%. "
            f"Their aptitude in {strength_focus.lower()} and {effort_level.lower()} contributions to classroom discussions enrich our learning environment. "
            f"I encourage {first_name} to continue pursuing advanced inquiry and honors-level challenges in the upcoming semester."
        )
    elif perf_tier == "Proficient":
        opt1 = (
            f"{first_name} has shown steady, commendable competence in {subject} ({grade_percentage:.1f}%). "
            f"They maintain a {effort_level.lower()} work ethic and showcase solid intuition in {strength_focus.lower()}. "
            f"To reach the next grade tier, {first_name} should focus on refining test review strategies and asking for targeted clarification during guided labs."
        )
    else:
        opt1 = (
            f"{first_name} is currently working towards standard grade-level expectations in {subject} ({grade_percentage:.1f}%). "
            f"While {first_name} exhibits potential in {strength_focus.lower()}, their academic progress has been hindered by {effort_level.lower()} completion of daily exercises. "
            f"With regular attendance at after-school tutoring and dedicated homework review, {first_name} can build the solid foundation needed for future success."
        )

    # Option 2: Growth Mindset & Action-Oriented
    if perf_tier in ["Distinction", "Commendable"]:
        opt2 = (
            f"It has been a pleasure teaching {first_name} in {subject}. They approach complex problem sets with genuine curiosity and resilience. "
            f"Their focus on {strength_focus.lower()} serves as an inspiration to peers. "
            f"Next term, {first_name} will benefit from taking on collaborative peer-mentoring roles to further solidify their leadership."
        )
    elif perf_tier == "Proficient":
        opt2 = (
            f"{first_name} possesses strong intellectual curiosity and has demonstrated commendable perseverance across our {subject} units. "
            f"They respond well to constructive feedback, particularly when applying {strength_focus.lower()}. "
            f"Developing a more systematic study schedule before major chapter examinations will help translate this effort into higher summative marks."
        )
    else:
        opt2 = (
            f"{first_name} has shown flashes of insight when engaging with {strength_focus.lower()} in {subject}. "
            f"However, closing the current performance gap will require a renewed commitment to active classroom participation and timely task submissions. "
            f"I look forward to partnering with {first_name} and their family to implement proactive study milestones."
        )

    # Option 3: Concise Summary for Standard Transcripts
    if perf_tier in ["Distinction", "Commendable"]:
        opt3 = f"Outstanding academic performance in {subject}. Demonstrates superior acumen in {strength_focus.lower()} with {effort_level.lower()} diligence. Highly recommended for advanced placement."
    elif perf_tier == "Proficient":
        opt3 = f"Sound, consistent progression in {subject}. Shows good comprehension of core principles. Encouraged to deepen independent revision to achieve mastery."
    else:
        opt3 = f"Academic intervention recommended in {subject}. Focus required on daily assignment completion and fundamental skills reinforcement. Tutoring is strongly advised."

    return {
        "student_name": student_name,
        "subject": subject,
        "grade_percentage": grade_percentage,
        "performance_tier": perf_tier,
        "comments": [
            {
                "style": "Balanced & Comprehensive",
                "text": opt1,
                "character_count": len(opt1)
            },
            {
                "style": "Growth Mindset & Student-Centered",
                "text": opt2,
                "character_count": len(opt2)
            },
            {
                "style": "Concise Transcript Format",
                "text": opt3,
                "character_count": len(opt3)
            }
        ]
    }
