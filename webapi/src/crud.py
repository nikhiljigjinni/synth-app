from sqlalchemy.orm import Session

from . import models

def get_presets(db: Session):
    return db.query(models.Preset).all()