# from sqlalchemy import Column, Integer, Float, String
import sqlalchemy as sa
from enum import Enum
from sqlalchemy.orm import Mapped, mapped_column
from .database import Base


class OscType(Enum):
    sine = "sine"
    square = "square"
    sawtooth = "sawtooth"
    triangle = "triangle"

class FilterType(Enum):
    lowpass = "lowpass"
    highpass = "highpass"
    bandpass = "bandpass"

class PresetModel(Base):
    __tablename__ = "presets"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    name: Mapped[str]

    # Osc adsr envelope
    osc_type: Mapped[OscType]
    attack: Mapped[float]
    decay: Mapped[float]
    sustain: Mapped[float]
    release: Mapped[float]

    # Osc filter params
    filter_type: Mapped[FilterType]
    cutoff: Mapped[float]
    resonance: Mapped[float]

    # Master control params
    volume: Mapped[float]
