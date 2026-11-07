"""
Application configuration.
Strictly zero credentials or real PII.
"""
import os

class Settings:
    PROJECT_NAME: str = "Nexora Academy AI School Management"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api"
    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite:///./school.db")
    # Clean example secret for local session signing only (non-credential mock)
    MOCK_SECRET_KEY: str = "example-local-dev-mock-secret-key-12345"

settings = Settings()

