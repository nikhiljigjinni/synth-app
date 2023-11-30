import { SynthView, SynthState } from "./synth-view";
import { FREQ_MAP } from "./utilities";

export class SynthController {
  view: SynthView;
  private osc: OscillatorNode | undefined;
  private gainNode: GainNode | undefined;
  private audioContext: AudioContext;
  
  constructor(view: SynthView) {

    this.audioContext = new AudioContext(); 
    this.view = view;
    // console.log(this.view);
    this.osc = undefined;
    this.gainNode = undefined;

    this.view.createKeyboard(FREQ_MAP);
    this.view.setupKeyboardCallback(this.noteOn, this.noteOff);


  }

  noteOn = (note: string) => {
    console.log(note);

    let synthState = this.view.getSynthState();
    this.osc = this.audioContext.createOscillator();
    this.gainNode = this.audioContext.createGain();
    this.osc.type = synthState.waveform;

    this.osc.connect(this.gainNode);
    this.gainNode.connect(this.audioContext.destination);


    let now = this.audioContext.currentTime;
     
    this.osc.frequency.setValueAtTime(FREQ_MAP.get(note) ?? 0, now);
    this.gainNode.gain.cancelScheduledValues(now);
    this.gainNode.gain.setValueAtTime(0, now);

    this.gainNode.gain.linearRampToValueAtTime(synthState.volume, now + synthState.attack);
    // this._gainNode.gain.linearRampToValueAtTime(this.sustain, now + this.attack + this.decay);
    this.gainNode.gain.setTargetAtTime(synthState.sustain*synthState.volume, now + synthState.attack, synthState.decay);
    this.osc.start(now);
        
  }
  
  noteOff = () => {
    let synthState = this.view.getSynthState();
    let now = this.audioContext.currentTime;
    this.gainNode?.gain.cancelScheduledValues(now);
    this.gainNode?.gain.setValueAtTime(this.gainNode?.gain.value, now);
    this.gainNode?.gain.linearRampToValueAtTime(0, now + synthState.release);
    this.osc?.stop(now + synthState.release);
    console.log("Note Up");
  }

  // noteOn = () => {
  //
  // }

};
