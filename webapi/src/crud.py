from sqlalchemy.orm import Session

from . import models, schemas

def get_presets(db: Session):
    return db.query(models.Preset).all()

def create_preset(db: Session, preset: schemas.Preset):
    db_preset = models.Preset(**preset.dict())
    db.add(db_preset)
    db.commit()
    db.refresh(db_preset)
    return db_preset