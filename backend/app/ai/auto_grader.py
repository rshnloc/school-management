"""
AI Automated Grading & Rubric Feedback Engine.
Analyzes student essays and written responses across structure, semantic depth,
evidence usage, and linguistic mechanics without requiring external cloud tokens.
"""
import re
from typing import Dict, Any, List

TRANSITION_MARKERS = [
    "furthermore", "moreover", "in addition", "consequently", "as a result",
    "however", "on the other hand", "conversely", "specifically", "for instance",
    "in particular", "ultimately", "in conclusion", "therefore", "subsequently",
    "to illustrate", "notably", "significantly"
]

EVIDENCE_MARKERS = [
    "for example", "according to", "studies demonstrate", "research indicates",
    "data suggests", "historically", "for instance", "evidence shows", "observed that",
    "demonstrates that", "as noted by"
]

def analyze_and_grade_submission(
    title: str,
    prompt: str,
    text: str,
    rubric_guidelines: str = ""
) -> Dict[str, Any]:
    text_clean = text.strip()
    words = re.findall(r'\b[A-Za-z0-9\'-]+\b', text_clean)
    word_count = len(words)
    
    # Sentences split
    sentences = [s.strip() for s in re.split(r'[.!?]+', text_clean) if len(s.strip()) > 3]
    sentence_count = len(sentences) or 1
    
    # Paragraphs
    paragraphs = [p.strip() for p in text_clean.split("\n\n") if len(p.strip()) > 0]
    paragraph_count = len(paragraphs) or 1

    # Lexical Diversity (Type-Token Ratio)
    unique_words = set(w.lower() for w in words)
    ttr = (len(unique_words) / word_count) if word_count > 0 else 0

    # 1. Dimension: Thesis & Concept Clarity (0 - 25)
    # Checks introduction clarity, length adequacy, prompt keywords
    prompt_words = set(re.findall(r'\b[A-Za-z]{4,}\b', prompt.lower()))
    text_words_set = set(w.lower() for w in words)
    keyword_overlap = len(prompt_words.intersection(text_words_set))
    prompt_coverage_ratio = (keyword_overlap / max(1, len(prompt_words)))

    thesis_score = 15.0
    if word_count >= 150:
        thesis_score += 4.0
    elif word_count >= 80:
        thesis_score += 2.0
    else:
        thesis_score -= 5.0

    if prompt_coverage_ratio > 0.4:
        thesis_score += 6.0
    elif prompt_coverage_ratio > 0.2:
        thesis_score += 3.0
    thesis_score = max(5.0, min(25.0, thesis_score))

    # 2. Dimension: Evidence, Analysis & Rigor (0 - 25)
    evidence_hits = sum(1 for m in EVIDENCE_MARKERS if m in text_clean.lower())
    evidence_score = 14.0 + min(9.0, evidence_hits * 3.0)
    if word_count < 100:
        evidence_score = min(evidence_score, 14.0)
    evidence_score = max(5.0, min(25.0, evidence_score))

    # 3. Dimension: Structure & Logical Flow (0 - 25)
    transition_hits = sum(1 for t in TRANSITION_MARKERS if t in text_clean.lower())
    structure_score = 14.0
    if paragraph_count >= 3:
        structure_score += 4.0
    elif paragraph_count == 2:
        structure_score += 2.0

    if transition_hits >= 3:
        structure_score += 6.0
    elif transition_hits >= 1:
        structure_score += 3.0
    structure_score = max(5.0, min(25.0, structure_score))

    # 4. Dimension: Language Mechanics & Vocabulary (0 - 25)
    avg_sentence_len = word_count / sentence_count
    mechanics_score = 16.0
    if 10 <= avg_sentence_len <= 25:
        mechanics_score += 4.0 # Good sentence rhythm
    elif avg_sentence_len > 35:
        mechanics_score -= 3.0 # Run-on sentences
    
    if ttr > 0.6:
        mechanics_score += 4.0
    elif ttr > 0.45:
        mechanics_score += 2.0
    mechanics_score = max(5.0, min(25.0, mechanics_score))

    total_score = round(thesis_score + evidence_score + structure_score + mechanics_score, 1)

    # Determine Letter Grade
    if total_score >= 93:
        letter = "A+"
    elif total_score >= 87:
        letter = "A"
    elif total_score >= 82:
        letter = "B+"
    elif total_score >= 75:
        letter = "B"
    elif total_score >= 70:
        letter = "C+"
    elif total_score >= 60:
        letter = "C"
    elif total_score >= 50:
        letter = "D"
    else:
        letter = "F"

    # Generate Structured Feedback
    strengths = []
    improvements = []

    if prompt_coverage_ratio > 0.3:
        strengths.append(f"Strong topic alignment: Directly addresses prompt objectives with core contextual vocabulary.")
    if paragraph_count >= 3:
        strengths.append(f"Clear structural organization with distinct paragraph boundaries ({paragraph_count} sections).")
    if transition_hits >= 2:
        strengths.append(f"Effective use of connective logical discourse markers ({transition_hits} transition phrases detected).")
    if ttr >= 0.5:
        strengths.append(f"Rich lexical diversity (Type-Token Ratio: {ttr:.2f}), showcasing articulate terminology.")
    if not strengths:
        strengths.append("Demonstrates foundational understanding of the core topic.")

    if word_count < 150:
        improvements.append(f"Elaborate further on key arguments: Current submission ({word_count} words) would benefit from more detailed sub-points.")
    if evidence_hits == 0:
        improvements.append("Integrate more empirical evidence, quantitative data, or specific scholarly citations to substantiate claims.")
    if transition_hits < 2:
        improvements.append("Strengthen logical transitions between paragraphs to smooth the narrative arc.")
    if avg_sentence_len > 30:
        improvements.append("Check sentence length variation; break down compound-complex sentences for crisp readability.")
    if not improvements:
        improvements.append("Consider exploring counter-arguments to push analytical depth to an honors level.")

    rubric_breakdown = {
        "thesis_and_clarity": {
            "score": thesis_score,
            "max": 25,
            "feedback": "Clear articulation of main argument and alignment with topic."
        },
        "evidence_and_rigor": {
            "score": evidence_score,
            "max": 25,
            "feedback": f"Factual citations and supporting details ({evidence_hits} evidence markers detected)."
        },
        "structure_and_flow": {
            "score": structure_score,
            "max": 25,
            "feedback": f"Cohesion across {paragraph_count} paragraphs with logical transitions."
        },
        "mechanics_and_style": {
            "score": mechanics_score,
            "max": 25,
            "feedback": f"Grammatical flow, vocabulary breadth (diversity: {ttr:.2f})."
        }
    }

    feedback_summary = (
        f"**Grade:** {letter} ({total_score}/100)\n\n"
        f"**Strengths:**\n" + "\n".join([f"• {s}" for s in strengths]) + "\n\n"
        f"**Targeted Revisions:**\n" + "\n".join([f"• {i}" for i in improvements])
    )

    return {
        "score": total_score,
        "letter_grade": letter,
        "word_count": word_count,
        "sentence_count": sentence_count,
        "paragraph_count": paragraph_count,
        "lexical_diversity": round(ttr, 2),
        "rubric_breakdown": rubric_breakdown,
        "strengths": strengths,
        "improvements": improvements,
        "feedback_summary": feedback_summary
    }

