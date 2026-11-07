"""
AI Behavioral & Sentiment Anomaly Detector.
Analyzes student reflection logs, counselor observations, and teacher notes
to flag early signs of burnout, disengagement, social isolation, or test anxiety.
Strictly zero cloud credentials needed.
"""
import re
from typing import Dict, Any, List

BURNOUT_KEYWORDS = [
    "overwhelmed", "exhausted", "burnout", "burnt out", "sleep", "tired",
    "stress", "pressure", "too much", "cannot keep up", "giving up", "headache"
]

ANXIETY_KEYWORDS = [
    "nervous", "anxious", "panic", "terrified", "fear", "freeze", "blanked out",
    "shaking", "worried", "scared", "dread"
]

DISENGAGEMENT_KEYWORDS = [
    "withdrawn", "disengaged", "skipped", "absent-minded", "silent", "staring",
    "unresponsive", "isolated", "head down", "refused", "no effort", "slacking"
]

POSITIVE_ENGAGEMENT_KEYWORDS = [
    "enthusiastic", "curious", "engaged", "participated", "active", "excited",
    "confident", "collaborative", "inquisitive", "helped peers", "energized"
]

def analyze_student_behavior(
    student_name: str,
    context_type: str, # "Teacher Observation", "Student Reflection", "Counselor Note"
    notes_text: str
) -> Dict[str, Any]:
    text_clean = notes_text.lower().strip()
    words = re.findall(r'\b[a-z\'-]+\b', text_clean)
    
    # Keyword hits
    burnout_hits = [w for w in BURNOUT_KEYWORDS if w in text_clean]
    anxiety_hits = [w for w in ANXIETY_KEYWORDS if w in text_clean]
    disengage_hits = [w for w in DISENGAGEMENT_KEYWORDS if w in text_clean]
    positive_hits = [w for w in POSITIVE_ENGAGEMENT_KEYWORDS if w in text_clean]

    # Calculate sentiment polarity (-1.0 to +1.0)
    negative_count = len(burnout_hits) + len(anxiety_hits) + len(disengage_hits)
    positive_count = len(positive_hits)
    total_sentiment_words = negative_count + positive_count

    if total_sentiment_words == 0:
        polarity = 0.05
        sentiment_label = "Neutral / Stable"
    else:
        polarity = round((positive_count - negative_count) / max(1, total_sentiment_words), 2)
        if polarity >= 0.3:
            sentiment_label = "Positive & Resilient"
        elif polarity >= -0.1:
            sentiment_label = "Neutral / Balanced"
        elif polarity >= -0.5:
            sentiment_label = "Mild Distress / Subdued"
        else:
            sentiment_label = "Elevated Distress / Anxious"

    # Primary behavioral flag
    flags = []
    if burnout_hits:
        flags.append(f"Cognitive Burnout / Fatigue ({', '.join(burnout_hits[:3])})")
    if anxiety_hits:
        flags.append(f"Performance / Test Anxiety ({', '.join(anxiety_hits[:3])})")
    if disengage_hits:
        flags.append(f"Social / Classroom Disengagement ({', '.join(disengage_hits[:3])})")
    if not flags:
        flags.append("Normal baseline behavior without acute distress markers.")

    # Risk Urgency
    if len(burnout_hits) >= 2 or len(anxiety_hits) >= 2 or negative_count >= 4:
        urgency = "High (Intervene within 24h)"
        urgency_level = "High"
        action_advice = (
            f"Schedule an empathetic wellness consultation for {student_name} with the School Counselor (Room 104). "
            f"Review recent test scheduling to evaluate homework load pacing, and notify homeroom advisor."
        )
    elif negative_count >= 1:
        urgency = "Moderate (Monitor over 3-5 days)"
        urgency_level = "Medium"
        action_advice = (
            f"Conduct an informal 5-minute teacher check-in after class. Pair {student_name} with a supportive "
            f"peer study partner for upcoming collaborative exercises."
        )
    else:
        urgency = "Low (Standard Observation)"
        urgency_level = "Low"
        action_advice = (
            f"Acknowledge {student_name}'s positive engagement and provide opportunities for honors enrichment leadership."
        )

    # Conversational empathy prompt for teacher/counselor
    empathy_prompt = (
        f"\"Hey {student_name.split()[0]}, I noticed you've been working hard recently, but things can get overwhelming. "
        f"I wanted to check in and see how your pacing feels this week. We have lots of support here, and my door is always open.\""
    )

    return {
        "student_name": student_name,
        "context_type": context_type,
        "sentiment_polarity": polarity,
        "sentiment_label": sentiment_label,
        "urgency_level": urgency_level,
        "urgency": urgency,
        "behavioral_flags": flags,
        "action_advice": action_advice,
        "recommended_checkin_script": empathy_prompt
    }
