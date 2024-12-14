export type FilterState = {
  type: BiquadFilterType;
  cutoff: number;
};

export type SynthState = {
  type: OscillatorType;
  attack: number;
  decay: number;
  sustain: number;
  release: number;
  detune: number;
  volume: number;
  cutoff: number;
  filterType: BiquadFilterType;
};

