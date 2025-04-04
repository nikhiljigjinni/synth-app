import React from 'react';
import { SynthState } from './types';

type HandleSynthState = (
  oscId: number, e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
) => void;

export default function Oscillator({
  oscId,
  synthState,
  handleSynthState,
}: {
  oscId: number; 
  synthState: SynthState;
  handleSynthState: HandleSynthState;
}) {
  return (
    <>
      <h3>Oscillator {oscId+1}</h3>
      <input type="checkbox" name="enabled" checked={synthState.enabled} onChange={(e) => handleSynthState(oscId, e)}/>
      <select name="oscType" value={synthState.oscType} onChange={(e) => handleSynthState(oscId, e)}>
        <option value="sine">Sine</option>
        <option value="square">Square</option>
        <option value="triangle">Triangle</option>
        <option value="sawtooth">Sawtooth</option>
      </select>
      <label htmlFor="attack">Attack</label>
      <input
        type="range"
        name="attack"
        min="0.05"
        max="2"
        step="0.01"
        value={synthState.attack}
        onChange={(e) => handleSynthState(oscId, e)}
      />
      <label htmlFor="decay">Decay</label>
      <input
        type="range"
        name="decay"
        min="0.05"
        max="2"
        step="0.01"
        value={synthState.decay}
        onChange={(e) => handleSynthState(oscId, e)}
      />
      <label htmlFor="sustain">Sustain</label>
      <input
        type="range"
        name="sustain"
        min="0.0"
        max="1"
        step="0.01"
        value={synthState.sustain}
        onChange={(e) => handleSynthState(oscId, e)}
      />
      <label htmlFor="release">Release</label>
      <input
        type="range"
        name="release"
        min="0.05"
        max="2"
        step="0.01"
        value={synthState.release}
        onChange={(e) => handleSynthState(oscId, e)}
      />
      <label htmlFor="detune">Detune</label>
      <input
        type="range"
        name="detune"
        min="-50"
        max="50"
        step="1"
        value={synthState.detune}
        onChange={(e) => handleSynthState(oscId, e)}
      />
      <input name="filterEnabled" type="checkbox" checked={synthState.filterEnabled} onChange={(e) => handleSynthState(oscId, e)}/>
      <label htmlFor="cutoff">Cutoff</label>
      <input
        type="range"
        name="cutoff"
        min="20"
        max="3000"
        step="20"
        value={synthState.cutoff}
        onChange={(e) => handleSynthState(oscId, e)}
      />
      <select name="filterType" value={synthState.filterType} onChange={(e) => handleSynthState(oscId, e)}>
        <option value="lowpass">Lowpass</option>
        <option value="highpass">Highpass</option>
        <option value="bandpass">Bandpass</option>
      </select>
      <label htmlFor="volume">Volume</label>
      <input
        type="range"
        name="volume"
        min="0.0"
        max="1"
        step="0.01"
        value={synthState.volume}
        onChange={(e) => handleSynthState(oscId, e)}
      />
    </>
  );
}
