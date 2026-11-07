# Nexora Academy | AI-Powered School Management System

A full-stack, enterprise-grade School Management System (SMS / SIS) built with **Python (FastAPI)** and **TypeScript (React + Vite)**.

Designed with **strict zero-credential, zero-PII privacy standards** and **zero Docker requirement**: everything runs locally with zero external paid tokens or containers.

---

## 🌟 Key Highlights

- **Zero Docker Needed**: Runs directly with standard Python 3 and Node.js on macOS, Linux, or Windows.
- **Strict Zero-Credential & Zero-PII Compliance**:
  - No live, expired, or rotated API keys, secrets, private keys, or passwords.
  - All seed records use synthetic example domains (`@example.com`), North American 555 telephony (`+1-555-XXXX`), and fictional personas.
- **Autonomous Built-in AI Engines**: Runs advanced heuristic, statistical, NLP, and constraint-satisfaction AI models offline without requiring third-party cloud credits.

---

## 🤖 Advanced AI Capabilities

### 1. AI Early-Warning & Dropout/At-Risk Predictor
- Analyzes multi-dimensional metrics: attendance degradation velocity, cumulative GPA, and submission latencies.
- Computes composite risk scores (0–100%) and categorizes scholars into **Low**, **Medium**, and **High Risk**.
- Generates proactive root-cause factor breakdowns and personalized intervention action plans (1-on-1 tutoring, counselor bookings, automated guardian notices).

### 2. AI Rubric Auto-Grader & Assessment Studio
- Evaluates student written essays and technical assignments across **4 educational dimensions** (25 points each):
  1. *Thesis & Concept Clarity*
  2. *Evidence, Analysis & Rigor*
  3. *Structure & Logical Flow*
  4. *Language Mechanics & Vocabulary Breadth*
- Computes lexical diversity (Type-Token Ratio), sentence rhythm, and connective transition frequency.
- Produces letter grades (A+ to F), targeted revisions, identified strengths, and 1-click recording to the student gradebook.

### 3. AI Curriculum & Lesson Plan Generator
- Produces complete pedagogical outlines aligned with educational standards (Bloom's Taxonomy).
- Formulates 5 distinct instructional phases:
  - *Phase 1: Hook & Prior Knowledge Activation*
  - *Phase 2: Direct Instruction & Concept Modeling*
  - *Phase 3: Collaborative Guided Investigation*
  - *Phase 4: Independent Mastery Application*
  - *Phase 5: Exit Ticket & Formative Synthesis*
- Features differentiated scaffolding for struggling learners and extension exercises for honors students.
- Generates an interactive 5-question formative assessment quiz with immediate rationale feedback.

### 4. AI Timetable & Classroom Allocation Optimizer
- Heuristic constraint satisfaction solver that eliminates faculty double-bookings, resolves room capacity collisions, and balances cohort daily workloads across Monday–Friday.
- Detects existing schedule clashes in real time and features a **1-Click AI Auto-Resolve** mechanism.

### 5. EduBot AI — Campus Advisor & Knowledge Chatbot
- Conversational assistant for students, teachers, and parents.
- Instant contextual Q&A on grading scales, honor roll cutoffs, minimum attendance policies (85% rule), tuition fee payment deadlines, campus counseling (Room 104), and extracurricular clubs.

---

## 🏫 Core Management Modules

1. **Student Information System (SIS)**: Demographics, enrollments, cohort filters, guardian records, and printable official academic report cards.
2. **Faculty & Department Directory**: Departmental chairs, subject specialties, office locations, and teaching appointments.
3. **Courses & Curriculum**: Credit weights, syllabi, room assignments, and instructor linkages.
4. **Daily Attendance Tracker**: Interactive roll call (Present / Late / Absent / Excused) with batch synchronization and auto-recalculation of AI risk scores.
5. **Academic Gradebook**: Continuous assessment tracking, exam weightings, GPA calculations, and student transcripts.
6. **Tuition & Billing (Bursar)**: Invoicing, fee statuses (Pending, Paid, Overdue), and simulated electronic fee clearing.
7. **Campus Notice Board**: Institutional announcements categorized by urgency and targeted audience (Students, Teachers, Parents).
8. **Role Persona Switcher**: Instant switching between Admin, Teacher, Student, and Parent views in the top navigation bar.

---

## 🚀 Quick Start Guide

### Prerequisites
- **Python**: 3.10+
- **Node.js**: 18+ (tested on Node v20 / npm v10)

### 1-Click Launch Script
In the root directory, simply execute:
```bash
./start.sh
```
This automatically initializes the Python virtualenv, installs backend and frontend dependencies, seeds the database with example data, and spins up both servers.

---

### Manual Launch (Alternative)

#### 1. Backend (FastAPI + SQLite)
```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt httpx
python run.py
```
*Backend runs on `http://127.0.0.1:8000` (Interactive Swagger docs available at `http://127.0.0.1:8000/docs`).*

#### 2. Frontend (React + TypeScript + Vite)
In a separate terminal:
```bash
cd frontend
npm install
npm run dev
```
*Frontend runs on `http://localhost:3000` (auto-proxies `/api` calls to port 8000).*

---

## 📁 Project Structure

```
school-management/
├── backend/
│   ├── app/
│   │   ├── ai/
│   │   │   ├── risk_predictor.py     # AI Retention & At-Risk Predictor
│   │   │   ├── auto_grader.py        # AI Rubric & Essay Auto-Grader
│   │   │   ├── lesson_planner.py     # AI Curriculum & Quiz Generator
│   │   │   ├── timetable_solver.py   # AI Constraint Satisfaction Solver
│   │   │   └── edubot.py             # EduBot Campus Advisor RAG Bot
│   │   ├── routers/                  # REST API endpoints (SIS, AI, Grades, etc.)
│   │   ├── models.py                 # SQLAlchemy ORM models
│   │   ├── schemas.py                # Pydantic v2 schemas
│   │   ├── database.py               # SQLite connection engine
│   │   ├── seed_data.py              # Zero-PII example data seed
│   │   └── main.py                   # FastAPI Application Root
│   ├── requirements.txt
│   ├── run.py
│   └── test_api.py
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── layout/               # Navbar & Categorized Sidebar
│   │   │   ├── views/                # Dashboard, AI Tools, SIS, Attendance, etc.
│   │   │   └── modals/               # EduBot Chatbot & Modals
│   │   ├── services/
│   │   │   └── api.ts                # Typed API client
│   │   ├── types/
│   │   │   └── index.ts              # TypeScript domain types
│   │   ├── App.tsx
│   │   ├── main.tsx
│   │   └── index.css
│   ├── package.json
│   ├── tsconfig.json
│   ├── tailwind.config.js
│   └── vite.config.ts
├── start.sh                          # Unified zero-docker start script
└── README.md
```

---

## 🔒 Privacy & Security Standards

- **Zero API Keys**: No proprietary keys or external cloud dependencies.
- **Zero Real Personal Data**: Compliant with synthetic naming conventions:
  - Generic test identities (`Student Test 1`, `Student Test 2`, `Student Test 3`)
  - Generic email addresses (`student.test1@example.com`, `teacher.test1@example.com`)
  - Standard telephone test ranges (`+1-555-0101`, `+1-555-0102`)
  - Example addresses (`100 Example Way, Example City, EX 10001`)

