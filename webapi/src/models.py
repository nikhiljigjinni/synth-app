# from sqlalchemy import Column, Integer, Float, String
import sqlalchemy as sa
from sqlalchemy.orm import relationship
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

class SynthStateModel(Base):
    __tablename__ = "synth_states"

    synth_state_id: Mapped[int] = mapped_column(primary_key=True, index=True, autoincrement=True)
    preset_id: Mapped[int] = mapped_column(sa.ForeignKey("presets.id"))

    # Osc adsr envelope
    enabled: Mapped[bool]
    osc_type: Mapped[OscType]
    attack: Mapped[float]
    decay: Mapped[float]
    sustain: Mapped[float]
    release: Mapped[float]
    detune: Mapped[float]
    volume: Mapped[float]

    # Osc filter params
    filter_enabled: Mapped[bool]
    filter_type: Mapped[FilterType]
    cutoff: Mapped[float]

class PresetModel(Base):
    __tablename__ = "presets"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    name: Mapped[str]

    synthStates: Mapped[list[SynthStateModel]] = relationship()