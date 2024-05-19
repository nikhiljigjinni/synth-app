from enum import Enum
from pydantic import BaseModel

class OscType(str, Enum):
    sine = "sine"
    square = "square"
    sawtooth = "sawtooth"
    triangle = "triangle"

class FilterType(str, Enum):
    lowpass = "lowpass"
    highpass = "highpass"
    bandpass = "bandpass"

class OscState(BaseModel):
    osc_type: OscType
    attack: float
    decay: float
    sustain: float
    release: float

class MasterState(BaseModel):
    volume: float


class FilterState(BaseModel):
    filter_type: FilterType
    cutoff: float
    resonance: float

class SynthState(BaseModel):
    oscState: OscState
    masterState: MasterState
    filterState: FilterState

class Preset(BaseModel):
    # id: int
    name: str
    synthState: SynthState
    