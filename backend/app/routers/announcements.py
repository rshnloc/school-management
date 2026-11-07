from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List
from ..database import get_db
from ..models import Announcement
from ..schemas import AnnouncementResponse, AnnouncementCreate

router = APIRouter(prefix="/announcements", tags=["announcements"])

@router.get("", response_model=List[AnnouncementResponse])
def get_announcements(db: Session = Depends(get_db)):
    return db.query(Announcement).order_by(Announcement.pinned.desc(), Announcement.id.desc()).all()

@router.post("", response_model=AnnouncementResponse)
def create_announcement(data: AnnouncementCreate, db: Session = Depends(get_db)):
    ann = Announcement(
        title=data.title,
        content=data.content,
        category=data.category,
        target_audience=data.target_audience,
        author="Academic Affairs Office",
        pinned=data.pinned
    )
    db.add(ann)
    db.commit()
    db.refresh(ann)
    return ann

