export type FilterState = {
  type: BiquadFilterType;
  cutoff: number;
};

export type DelayState = {
  delayEnabled: boolean;
  delayTime: number;
  delayFeedback: number;
};

export type SynthState = {
  enabled: boolean;
  type: OscillatorType;
  attack: number;
  decay: number;
  sustain: number;
  release: number;
  detune: number;
  volume: number;
  filterEnabled: boolean;
  cutoff: number;
  filterType: BiquadFilterType;
};

