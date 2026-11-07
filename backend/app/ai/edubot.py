"""
EduBot AI - Intelligent Campus Assistant & Virtual Counselor.
Answers academic, administrative, and student life queries using semantic keyword routing
and contextual knowledge synthesis. Strictly zero external cloud credentials needed.
"""
import re
from typing import Dict, Any, List

KNOWLEDGE_BASE = [
    {
        "category": "grading",
        "keywords": ["grade", "gpa", "marking", "scale", "failing", "a+", "report card", "honor roll"],
        "answer": (
            "**Nexora Academy Grading Framework:**\n\n"
            "• **A+ (93-100%):** 4.0 GPA - Advanced Mastery & Distinction\n"
            "• **A (85-92%):** 3.8 GPA - Exemplary Achievement\n"
            "• **B+ (78-84%):** 3.3 GPA - Commendable Competence\n"
            "• **B (70-77%):** 3.0 GPA - Proficient Standard\n"
            "• **C (60-69%):** 2.0 GPA - Minimum Passing Criterion\n"
            "• **Below 60%:** Academic Intervention Triggered (<2.0 GPA)\n\n"
            "*Honor Roll distinction requires a minimum unweighted GPA of 3.75 with zero unexcused absences.*"
        ),
        "actions": ["View Gradebook", "Check GPA Forecast", "Schedule Tutoring"]
    },
    {
        "category": "attendance",
        "keywords": ["attendance", "absent", "absence", "late", "tardy", "leave", "sick", "missed class"],
        "answer": (
            "**Nexora Academy Attendance Policy:**\n\n"
            "• **Minimum Threshold:** Students must maintain at least 85% attendance across all enrolled courses to be eligible for final examinations.\n"
            "• **Excused Absences:** Medical notes or guardian notices must be submitted via the parent portal within 48 hours of return.\n"
            "• **Tardy Policy:** 3 late arrivals equal 1 recorded unexcused absence.\n"
            "• **AI Early-Alert:** The predictive system alerts homeroom teachers when a student's attendance drops below 90%."
        ),
        "actions": ["Submit Absence Note", "View Attendance Log", "Contact Homeroom"]
    },
    {
        "category": "fees",
        "keywords": ["fee", "tuition", "payment", "invoice", "cost", "scholarship", "financial aid", "receipt"],
        "answer": (
            "**Tuition & Fee Guidelines:**\n\n"
            "• **Term Billing:** Tuition installments are billed bi-annually (Fall Term due Sept 15, Spring Term due Feb 10).\n"
            "• **Payment Channels:** Credit/Debit Card, ACH Direct Bank Transfer, or In-Person Cashier.\n"
            "• **Late Surcharge:** A $25 administrative grace-period fee is applied 10 business days past the deadline.\n"
            "• **Need-Based Scholarships:** Applications for Academic Excellence & Need Grants open every semester in the Financial Aid portal."
        ),
        "actions": ["Pay Current Balance", "Download Receipt", "Apply for Aid"]
    },
    {
        "category": "schedule",
        "keywords": ["timetable", "schedule", "period", "bell", "timing", "hours", "calendar", "classes"],
        "answer": (
            "**Standard Daily Schedule (Mon - Fri):**\n\n"
            "• **08:30 - 09:20:** Period 1\n"
            "• **09:25 - 10:15:** Period 2\n"
            "• **10:15 - 10:30:** Morning Recess & Snack\n"
            "• **10:30 - 11:20:** Period 3\n"
            "• **11:25 - 12:15:** Period 4\n"
            "• **12:15 - 13:00:** Lunch & Clubs\n"
            "• **13:00 - 13:50:** Period 5\n"
            "• **13:55 - 14:45:** Period 6 (Independent Lab / Advisory)\n"
            "• **15:00 - 16:30:** After-School Athletics & Study Hall"
        ),
        "actions": ["View My Timetable", "Classroom Map", "Download PDF"]
    },
    {
        "category": "counseling",
        "keywords": ["counselor", "counseling", "stress", "mental health", "anxiety", "help", "advisor", "burnout"],
        "answer": (
            "**Student Counseling & Wellness Services:**\n\n"
            "We care deeply about your mental, emotional, and academic well-being. "
            "Our Student Counseling Center is located in **Room 104** (Main Administration Building).\n\n"
            "• **Walk-in Hours:** Monday - Friday, 9:00 AM – 4:00 PM\n"
            "• **Confidential Guidance:** Academic pressure management, peer conflict resolution, college admissions advisory.\n"
            "• **Study Coaching:** AI-assisted study timetable planning and exam stress workshops every Tuesday afternoon."
        ),
        "actions": ["Book Confidential Slot", "Chat with Peer Mentor", "Self-Care Resources"]
    },
    {
        "category": "library",
        "keywords": ["library", "book", "borrow", "research", "quiet study", "database", "computer lab"],
        "answer": (
            "**Nexora Learning Commons & Library:**\n\n"
            "• **Operating Hours:** Monday to Friday, 08:00 AM – 17:30 PM\n"
            "• **Book Loan Policy:** Up to 4 physical books for 14 calendar days (renewable online).\n"
            "• **Digital Archives:** Full access to JSTOR, ScienceDirect, and EBSCOhost via campus Wi-Fi.\n"
            "• **Study Pods:** 6 group collaboration rooms with smart monitors (reserve 24h in advance)."
        ),
        "actions": ["Search Book Catalog", "Reserve Study Pod", "Access Digital JSTOR"]
    },
    {
        "category": "clubs",
        "keywords": ["club", "extracurricular", "sports", "robotics", "debate", "drama", "athletics", "olympiad"],
        "answer": (
            "**Student Clubs & Extracurricular Activities:**\n\n"
            "• **AI & Robotics Society:** Meets Wednesdays 15:15 in Lab 302\n"
            "• **Debate & Model UN:** Meets Tuesdays & Thursdays in Lecture Hall B\n"
            "• **Math & Science Olympiad:** Meets Mondays 15:30 in Room 204\n"
            "• **Visual Arts & Theater Guild:** Meets Fridays 15:00 in Studio 1\n"
            "• **Athletics:** Basketball, Soccer, Track & Field, Swimming (Tryouts in early Sept/Feb)."
        ),
        "actions": ["Browse All 14 Clubs", "Register for Club Fair", "Athletics Calendar"]
    }
]

def generate_chat_response(message: str, user_role: str = "student", history: List[Dict[str, str]] = None) -> Dict[str, Any]:
    msg_lower = message.lower().strip()
    
    # 1. Check knowledge base match by keyword score
    best_match = None
    best_score = 0
    for item in KNOWLEDGE_BASE:
        score = sum(1 for kw in item["keywords"] if kw in msg_lower)
        if score > best_score:
            best_score = score
            best_match = item

    if best_match and best_score >= 1:
        prefix = ""
        if user_role == "teacher":
            prefix = "*(Faculty Information Desk)* "
        elif user_role == "parent":
            prefix = "*(Parent Portal Assistance)* "

        return {
            "reply": prefix + best_match["answer"],
            "category": best_match["category"],
            "suggested_actions": best_match["actions"],
            "confidence": 0.95
        }

    # 2. Check greetings
    if any(g in msg_lower for g in ["hello", "hi", "hey", "good morning", "good afternoon"]):
        return {
            "reply": (
                f"Hello! I am **EduBot**, Nexora Academy's intelligent virtual assistant. "
                f"I can assist you with course syllabi, grade breakdowns, attendance policies, "
                f"lesson planning tools, schedule optimization, and campus counseling services. "
                f"How may I help you today?"
            ),
            "category": "greeting",
            "suggested_actions": [
                "What is the grading scale?",
                "How do I submit an excused absence?",
                "Show the daily bell schedule",
                "Where is the counseling office?"
            ],
            "confidence": 1.0
        }

    # 3. Intelligent Fallback
    return {
        "reply": (
            f"I have recorded your inquiry regarding: *\"{message}\"*. "
            f"While our standard school knowledge base doesn't have an exact match for this specific phrase, "
            f"you can view the relevant details in the Student Directory, Academic Gradebook, or Schedule Optimizer tabs. "
            f"Alternatively, you may reach out directly to the administrative registrar at `registrar.example@example.com`."
        ),
        "category": "general_inquiry",
        "suggested_actions": [
            "Check GPA & Grades",
            "View Daily Timetable",
            "Tuition & Fee Portal",
            "Contact Student Support"
        ],
        "confidence": 0.8
    }

