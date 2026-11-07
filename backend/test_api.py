import sys
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_endpoints():
    print("Testing API health...")
    res = client.get("/api/health")
    assert res.status_code == 200, f"Health check failed: {res.text}"

    print("Testing /api/students...")
    res = client.get("/api/students")
    assert res.status_code == 200
    students = res.json()
    assert len(students) >= 6
    print(f"-> Found {len(students)} students.")

    print("Testing /api/ai/analytics-overview...")
    res = client.get("/api/ai/analytics-overview")
    assert res.status_code == 200
    overview = res.json()
    print("-> Risk overview:", overview["risk_breakdown"])

    print("Testing /api/ai/auto-grade...")
    grade_req = {
        "student_id": students[0]["id"],
        "course_id": 1,
        "assignment_title": "Newtonian Motion in Orbital Mechanics",
        "rubric_guidelines": "Evaluate thesis, mathematical models, and coherence.",
        "submission_text": (
            "Classical Newtonian mechanics fundamentally explains planetary trajectories and satellite dynamics. "
            "Specifically, Newton's universal law of gravitation demonstrates that gravitational attraction is proportional "
            "to the product of their masses and inversely proportional to the square of their radial distance. "
            "Furthermore, orbital eccentricity dictates whether a celestial path is circular, elliptical, or hyperbolic. "
            "Consequently, modern aerospace engineers calculate delta-v budgets using Tsiolkovsky rocket equations "
            "grounded in these exact principles. In conclusion, Newtonian physics remains the bedrock of mission navigation."
        )
    }
    res = client.post("/api/ai/auto-grade", json=grade_req)
    assert res.status_code == 200, res.text
    grade_res = res.json()
    print(f"-> Auto-graded: {grade_res['letter_grade']} ({grade_res['score']}/100)")
    assert "rubric_breakdown" in grade_res

    print("Testing /api/ai/generate-lesson-plan...")
    plan_req = {
        "subject": "Physics",
        "topic": "Thermodynamics & Heat Engines",
        "grade_level": "Grade 11",
        "duration_minutes": 50,
        "include_quiz": True
    }
    res = client.post("/api/ai/generate-lesson-plan", json=plan_req)
    assert res.status_code == 200, res.text
    plan_res = res.json()
    print(f"-> Generated lesson plan: '{plan_res['title']}' with {len(plan_res.get('quiz', []))} quiz questions.")

    print("Testing /api/ai/chat (EduBot)...")
    chat_req = {
        "message": "What is the grading scale and honor roll requirement?",
        "user_role": "student"
    }
    res = client.post("/api/ai/chat", json=chat_req)
    assert res.status_code == 200
    chat_res = res.json()
    print(f"-> EduBot responded: {chat_res['reply'][:60]}...")

    print("All backend AI endpoints verified successfully!")

if __name__ == "__main__":
    test_endpoints()

