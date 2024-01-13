import { SynthView } from "./views/synth-view";
import { FREQ_MAP } from "./utilities";

export class SynthController {
    view: SynthView;
    private osc: OscillatorNode | undefined;
    private gainNode: GainNode | undefined;
    private audioContext: AudioContext;
    private playedOsc: any;

    constructor(view: SynthView) {
        this.view = view;
        this.audioContext = new AudioContext();
        this.view.setupKeyboardCallback(this.noteOn, this.noteOff);
        this.playedOsc = {};
    }

  noteOn = (note: string) => {
    let synthState = this.view.getSynthState();
    this.osc = this.audioContext.createOscillator();
    this.gainNode = this.audioContext.createGain();
    this.osc.type = synthState.oscState.oscType as OscillatorType;
    const env = synthState.oscState.adsrEnv;

    this.osc.connect(this.gainNode);
    this.gainNode.connect(this.audioContext.destination);

    let now = this.audioContext.currentTime;
    this.osc.frequency.setValueAtTime(FREQ_MAP.get(note) ?? 0, now);
    this.gainNode.gain.cancelScheduledValues(now);
    this.gainNode.gain.setValueAtTime(0, now);

    this.gainNode.gain.linearRampToValueAtTime(synthState.volume, now + env.attack);
    this.gainNode.gain.setTargetAtTime(env.sustain*synthState.volume, now + env.attack, env.decay);
    this.osc.start(now);

    this.playedOsc[note] = {osc: this.osc, gain: this.gainNode};

  }

  noteOff = (note: string) => {

    if (this.playedOsc[note]) {
      let synthState = this.view.getSynthState();
      const env = synthState.oscState.adsrEnv;
      let now = this.audioContext.currentTime;

      const {osc, gainNode} = this.playedOsc[note]!;
      gainNode?.gain.cancelScheduledValues(now);
      gainNode?.gain.setValueAtTime(gainNode?.gain.value, now);
      gainNode?.gain.linearRampToValueAtTime(0, now + env.release);
      osc?.stop(now + env.release);

      delete this.playedOsc[note];

    }

  }

}