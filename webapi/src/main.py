from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from . import crud, models, schemas
from .database import SessionLocal, engine
from sqlalchemy.orm import Session

models.Base.metadata.create_all(bind=engine)

app = FastAPI()

origins = [
    "http://localhost:8080"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
 
@app.get("/presets/", response_model=list[schemas.Preset])
def get_presets(db: Session = Depends(get_db)):
    presets: list[schemas.Preset] = crud.get_presets(db)
    return presets

@app.post("/presets/")
def create_preset(preset: schemas.Preset, db: Session = Depends(get_db)):
    saved_preset = crud.create_preset(db, preset)
    return saved_preset
