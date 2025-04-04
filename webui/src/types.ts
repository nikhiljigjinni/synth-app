export type FilterState = {
  type: BiquadFilterType;
  cutoff: number;
};

export type Preset = {
  name: string;
  synthStates: SynthState[];
}

export type SynthState = {
  enabled: boolean;
  oscType: OscillatorType;
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

