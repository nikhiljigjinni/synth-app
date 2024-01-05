from pydantic import BaseModel

class Preset(BaseModel):
    # id: int
    name: str
    attack: float
    decay: float
    sustain: float
    release: float