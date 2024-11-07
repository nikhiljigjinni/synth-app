import Param from './Param';
export default function Envelope({synthType, attack, decay, sustain, release, handleInput, handleSynthType}) {
    return (
      <div className='envelope'>
        <select name="synth-type" value={synthType} onChange={handleSynthType}>
          <option value="sine">Sine</option>
          <option value="sawtooth">Sawtooth</option>
          <option value="square">Square</option>
          <option value="triangle">Triangle</option>
        </select>

        <Param labelName="attack" min="0" max="5" step="0.01" value={attack} onHandleInput={(e) => handleInput(e, "attack")}/>
        <Param labelName="decay" min="0.005" max="5" step="0.01" value={decay} onHandleInput={(e) => handleInput(e, "decay")}/>
        <Param labelName="sustain" min="0" max="1" step="0.01" value={sustain} onHandleInput={(e) => handleInput(e, "sustain")}/>
        <Param labelName="release" min="0" max="5" step="0.01" value={release} onHandleInput={(e) => handleInput(e, "release")}/>
      </div>
    )
};
