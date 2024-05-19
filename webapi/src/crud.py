from sqlalchemy.orm import Session

from .models import PresetModel
from .schemas import Preset, SynthState, OscState, MasterState, FilterState, OscType, FilterType

def convert_to_pydantic(db_model: PresetModel) -> Preset:
    return Preset(
        name=db_model.name,
        synthState=SynthState(
            oscState=OscState(
                osc_type=db_model.osc_type,
                attack=db_model.attack,
                decay=db_model.sustain,
                sustain=db_model.sustain,
                release=db_model.release
            ),
            filterState=FilterState(
                filter_type=db_model.filter_type,
                cutoff=db_model.cutoff,
                resonance=db_model.resonance
            ),
            masterState=MasterState(
                volume=db_model.volume
            )
        )
    )

def convert_to_db_model(preset: Preset) -> PresetModel:
    return PresetModel(
        name=preset.name,
        osc_type=preset.synthState.oscState.osc_type,
        attack=preset.synthState.oscState.attack,
        decay=preset.synthState.oscState.decay,
        sustain=preset.synthState.oscState.sustain,
        release=preset.synthState.oscState.release,
        filter_type=preset.synthState.filterState.filter_type,
        cutoff=preset.synthState.filterState.cutoff,
        resonance=preset.synthState.filterState.resonance,
        volume=preset.synthState.masterState.volume
    )

def get_presets(db_session: Session) -> list[Preset]:
    db_presets = db_session.query(PresetModel).all()
    return [convert_to_pydantic(db_preset) for db_preset in db_presets]

def create_preset(db_session: Session, preset: Preset):
    db_preset = convert_to_db_model(preset)
    db_session.add(db_preset)
    db_session.commit()
    db_session.refresh(db_preset)
    return db_preset