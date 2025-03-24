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

class SynthState(BaseModel):
    enabled: bool
    osc_type: OscType
    attack: float
    decay: float
    sustain: float
    release: float
    detune: float
    volume: float
    filterEnabled: bool
    filter_type: FilterType
    cutoff: float

class Preset(BaseModel):
    # id: int
    name: str
    synthStates: list[SynthState]
