import React from 'react'
import { SynthState } from './types';

type HandleSynthState = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;

export default function Oscillator({synthState, handleSynthState}: {synthState: SynthState, handleSynthState: HandleSynthState}) {
    return (
        <>
            <h1>Oscillator</h1>
            
            <select name="type" value={synthState.type} onChange={handleSynthState}>
                <option value="sine">Sine</option>
                <option value="square">Square</option>
                <option value="triangle">Triangle</option>
                <option value="sawtooth">Sawtooth</option>
            </select>
            <label htmlFor="attack">Attack</label>
            <input type="range" name="attack" min="0.05" max="2" step="0.01" value={synthState.attack} onChange={handleSynthState}/>
            <label htmlFor="decay">Decay</label>
            <input type="range" name="decay" min="0.05" max="2" step="0.01" value={synthState.decay} onChange={handleSynthState}/>
            <label htmlFor="sustain">Sustain</label>
            <input type="range" name="sustain" min="0.05" max="1" step="0.01" value={synthState.sustain} onChange={handleSynthState}/>
            <label htmlFor="release">Release</label>
            <input type="range" name="release" min="0.05" max="2" step="0.01" value={synthState.release} onChange={handleSynthState}/>
            <label htmlFor="volume">Volume</label>
            <input type="range" name="volume" min="0.0" max="1" step="0.01" value={synthState.volume} onChange={handleSynthState}/>

        </>
    );
}
