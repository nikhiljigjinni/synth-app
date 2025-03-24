from sqlalchemy.orm import Session, joinedload

from .models import PresetModel, SynthStateModel
from .schemas import Preset, OscType, FilterType, SynthState
    
def convert_to_pydantic(db_model: PresetModel) -> Preset:
    preset: Preset = Preset(name=db_model.name, synthStates=[])
    for db_synthState in db_model.synthStates:
        preset.synthStates.append(
            SynthState(
                enabled=db_synthState.enabled,
                osc_type=db_synthState.osc_type,
                attack=db_synthState.attack,
                decay=db_synthState.decay,
                sustain=db_synthState.sustain,
                release=db_synthState.release,
                detune=db_synthState.detune,
                volume=db_synthState.volume,
                filter_type=db_synthState.filter_type,
                filterEnabled=db_synthState.filter_enabled,
                cutoff=db_synthState.cutoff
            )
        )
    return preset

def create_preset(db_session: Session, preset: Preset):
    db_preset = PresetModel(name=preset.name, synthStates=[
        SynthStateModel(
            enabled=synthState.enabled,
            osc_type=synthState.osc_type,
            attack=synthState.attack,
            decay=synthState.decay,
            sustain=synthState.sustain,
            release=synthState.release,
            detune=synthState.detune,
            volume=synthState.volume,
            filter_enabled=synthState.filterEnabled,
            filter_type=synthState.filter_type,
            cutoff=synthState.cutoff,

        )
        for synthState in preset.synthStates
    ])
    db_session.add(db_preset)
    db_session.commit()
    db_session.refresh(db_preset)
    return db_preset

def get_presets(db_session: Session) -> list[Preset]:
    db_presets = db_session.query(PresetModel).options(joinedload(PresetModel.synthStates)).all()
    return [convert_to_pydantic(db_preset) for db_preset in db_presets]
