from sqlalchemy import Column, Integer, Float, String
from .database import Base

class Preset(Base):
    __tablename__ = "presets"
    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    name = Column(String(255))
    attack = Column(Float)
    decay = Column(Float)
    sustain = Column(Float)
    release = Column(Float)

