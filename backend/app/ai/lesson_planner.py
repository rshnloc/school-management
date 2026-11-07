"""
AI Lesson Planner & Curriculum Generator.
Generates structured pedagogical lesson plans, differentiated learning strategies,
and assessment quizzes aligned with educational standards.
"""
from typing import Dict, Any, List

def generate_lesson_plan(
    subject: str,
    topic: str,
    grade_level: str,
    duration_minutes: int = 45,
    objectives: str = "",
    include_quiz: bool = True
) -> Dict[str, Any]:
    subj_clean = subject.strip().title()
    topic_clean = topic.strip().title()
    
    # Timing calculation based on duration
    warmup_min = max(5, int(duration_minutes * 0.15))
    direct_min = max(10, int(duration_minutes * 0.35))
    guided_min = max(10, int(duration_minutes * 0.25))
    independent_min = max(10, int(duration_minutes * 0.15))
    closing_min = duration_minutes - (warmup_min + direct_min + guided_min + independent_min)

    # Contextualized objectives
    default_objectives = [
        f"Define and explain core conceptual principles of {topic_clean}.",
        f"Analyze practical real-world applications within {subj_clean}.",
        f"Synthesize problem-solving techniques and validate solutions through peer discussion."
    ]
    if objectives and objectives.strip():
        user_objs = [o.strip() for o in objectives.split("\n") if o.strip()]
        learning_objectives = user_objs if user_objs else default_objectives
    else:
        learning_objectives = default_objectives

    plan = {
        "title": f"Mastery Unit: {topic_clean}",
        "subject": subj_clean,
        "grade_level": grade_level,
        "duration": f"{duration_minutes} Minutes",
        "essential_question": f"How do the fundamental principles of {topic_clean} shape our understanding of modern {subj_clean}?",
        "learning_objectives": learning_objectives,
        "materials_needed": [
            "Interactive digital board / projector",
            f"Handout: Guided Inquiry Worksheet on {topic_clean}",
            "Student laptops or tablets for interactive simulation",
            "Index cards for Exit Ticket formative assessment"
        ],
        "timeline": [
            {
                "phase": "Phase 1: Hook & Prior Knowledge Activation",
                "duration": f"{warmup_min} min",
                "activity": f"Present an intriguing 60-second real-world phenomenon illustrating {topic_clean}. Ask students to write down two observations and one question on their warm-up sheet."
            },
            {
                "phase": "Phase 2: Direct Instruction & Concept Modeling",
                "duration": f"{direct_min} min",
                "activity": f"Teacher models foundational mechanics of {topic_clean} using visual diagrams and step-by-step problem deconstruction. Check for understanding via quick thumb polls."
            },
            {
                "phase": "Phase 3: Collaborative Guided Investigation",
                "duration": f"{guided_min} min",
                "activity": f"Students work in dyads to tackle tiered challenge prompts regarding {topic_clean}. Teacher circulates with targeted scaffolding prompts."
            },
            {
                "phase": "Phase 4: Independent Mastery Application",
                "duration": f"{independent_min} min",
                "activity": f"Individual practice: Students complete 3 analytical questions demonstrating independent application of {topic_clean} principles."
            },
            {
                "phase": "Phase 5: Exit Ticket & Formative Synthesis",
                "duration": f"{closing_min} min",
                "activity": "3-2-1 Exit Strategy: Students note 3 key takeaways, 2 connections to prior topics, and 1 remaining question."
            }
        ],
        "differentiation": {
            "scaffolding_for_support": f"Provide vocabulary bank with illustrated glossaries for {topic_clean}, graphic organizers, and paired partner guidance.",
            "extension_for_advanced": f"Task students with designing an original case study or mathematical model exploring edge scenarios in {topic_clean}."
        },
        "homework_assignment": f"Complete the 5-part reflective review problem set on {topic_clean} and prepare one inquiry question for tomorrow's lab."
    }

    if include_quiz:
        plan["quiz"] = [
            {
                "question": f"Which of the following best defines the primary mechanism in {topic_clean}?",
                "options": [
                    f"A systematic process driving changes in {subj_clean} systems",
                    "A static phenomenon with negligible dynamic effect",
                    "A purely theoretical model with no physical application",
                    "An isolated event with random outcomes"
                ],
                "correct_option_index": 0,
                "explanation": f"The core definition of {topic_clean} focuses on active systematic operations within {subj_clean}."
            },
            {
                "question": f"When analyzing {topic_clean}, what is the critical initial condition required?",
                "options": [
                    "Equilibrium across all boundary variables",
                    "A clear input stimulus or measurable baseline",
                    "Total absence of external environmental factors",
                    "Constant velocity without acceleration"
                ],
                "correct_option_index": 1,
                "explanation": f"Establishing an empirical baseline or stimulus is standard practice when evaluating {topic_clean}."
            },
            {
                "question": f"What common misconception exists regarding {topic_clean}?",
                "options": [
                    "It only operates under vacuum conditions",
                    "It is universally instantaneous across all contexts",
                    "It cannot be measured with contemporary instruments",
                    "It requires infinite energy input"
                ],
                "correct_option_index": 1,
                "explanation": f"Students often mistakenly believe {topic_clean} manifests instantaneously rather than progressively."
            },
            {
                "question": f"How can practitioners optimize the outcomes when implementing {topic_clean}?",
                "options": [
                    "By ignoring outlier anomalies",
                    "By applying iterative validation and calibration",
                    "By standardizing only after complete termination",
                    "By restricting observations to single trials"
                ],
                "correct_option_index": 1,
                "explanation": "Iterative calibration ensures repeatable precision and minimizes experimental deviation."
            },
            {
                "question": f"In real-world applications, how does {topic_clean} interconnect with societal or technological progress?",
                "options": [
                    "It enables scalable, predictive innovations across fields",
                    "It replaces all conventional methods entirely overnight",
                    "It creates unresolvable systemic redundancies",
                    "It has no verifiable practical relevance"
                ],
                "correct_option_index": 0,
                "explanation": f"Modern applications of {topic_clean} unlock enhanced predictability and scalable infrastructure."
            }
        ]

    return plan

