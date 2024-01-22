import { SynthView } from "./views/synth-view";
import { FREQ_MAP } from "./utilities";

export class SynthController {
    view: SynthView;
    private oscNodes: Map<string, OscillatorNode>;
    private gainNodes: Map<string, GainNode>;
    private audioContext: AudioContext;

    constructor(view: SynthView) {
        this.view = view;
        this.oscNodes = new Map<string, OscillatorNode>();
        this.gainNodes = new Map<string, GainNode>();
        this.audioContext = new AudioContext();
        this.view.setupKeyboardCallback(this.noteOn, this.noteOff);
    }

  noteOn = (note: string) => {
    let synthState = this.view.getState();
    let oscNode = this.audioContext.createOscillator();
    let gainNode = this.audioContext.createGain();
    let filterNode = this.audioContext.createBiquadFilter();

    oscNode.type = synthState.oscState.oscType as OscillatorType;
    const env = synthState.oscState.adsrEnv;

    oscNode.connect(gainNode);
    gainNode.connect(filterNode);
    filterNode.connect(this.audioContext.destination);

    let now = this.audioContext.currentTime;
    oscNode.frequency.setValueAtTime(FREQ_MAP.get(note) ?? 0, now);
    gainNode.gain.cancelScheduledValues(now);
    gainNode.gain.setValueAtTime(0, now);

    filterNode.frequency.setValueAtTime(synthState.filterState.cutoff, now);
    filterNode.Q.setValueAtTime(synthState.filterState.resonance, now);
    filterNode.type = "lowpass";

    gainNode.gain.linearRampToValueAtTime(synthState.masterControlState.volume, now + env.attack);
    gainNode.gain.setTargetAtTime(env.sustain*synthState.masterControlState.volume, now + env.attack, env.decay);
    oscNode.start(now);

    this.oscNodes.set(note, oscNode);
    this.gainNodes.set(note, gainNode);

  }

  noteOff = (note: string) => {

    if (this.oscNodes.has(note)) {
      let synthState = this.view.getState();
      const env = synthState.oscState.adsrEnv;

      let oscNode = this.oscNodes.get(note);
      let gainNode = this.gainNodes.get(note)!;

      let now = this.audioContext.currentTime;
      gainNode.gain.cancelScheduledValues(now);
      gainNode.gain.setValueAtTime(gainNode.gain.value, now);
      gainNode.gain.linearRampToValueAtTime(0.0, now + env.release);
      oscNode?.stop(now + env.release);

      this.oscNodes.delete(note);
      this.gainNodes.delete(note);

    }

  }

}