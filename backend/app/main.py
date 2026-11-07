from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .database import engine, Base, SessionLocal
from .config import settings
from .seed_data import seed_database
from .routers import students, teachers, courses, attendance, grades, timetable, fees, announcements, ai_routes

# Create database tables
Base.metadata.create_all(bind=engine)

# Seed database with example records
with SessionLocal() as db:
    seed_database(db)

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="Full-featured School Management System with Advanced AI Capabilities."
)

# Enable CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include Routers
app.include_router(students.router, prefix=settings.API_V1_STR)
app.include_router(teachers.router, prefix=settings.API_V1_STR)
app.include_router(courses.router, prefix=settings.API_V1_STR)
app.include_router(attendance.router, prefix=settings.API_V1_STR)
app.include_router(grades.router, prefix=settings.API_V1_STR)
app.include_router(timetable.router, prefix=settings.API_V1_STR)
app.include_router(fees.router, prefix=settings.API_V1_STR)
app.include_router(announcements.router, prefix=settings.API_V1_STR)
app.include_router(ai_routes.router, prefix=settings.API_V1_STR)

@app.get("/")
def root():
    return {
        "status": "online",
        "service": settings.PROJECT_NAME,
        "version": settings.VERSION,
        "docs_url": "/docs"
    }

@app.get("/api/health")
def health_check():
    return {"status": "healthy"}

