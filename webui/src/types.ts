export type SynthState = {
  type: OscillatorType;
  attack: number;
  decay: number;
  sustain: number;
  release: number;
  volume: number;
};

export type FilterState = {
  type: BiquadFilterType;
  cutoff: number;
};
