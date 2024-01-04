import { SynthView, SynthState, PresetResponse } from "./synth-view";
import { FREQ_MAP } from "./utilities";
import { ApiService } from "./api";

export class SynthController {
  view: SynthView;
  private osc: OscillatorNode | undefined;
  private gainNode: GainNode | undefined;
  private filterNode: BiquadFilterNode | undefined;
  private audioContext: AudioContext;
  
  constructor(view: SynthView) {

    this.audioContext = new AudioContext(); 
    this.view = view;
    this.osc = undefined;
    this.gainNode = undefined;
    this.filterNode = undefined;

    this.loadInitialData();
    this.view.createKeyboard(FREQ_MAP);
    this.view.setupKeyboardCallback(this.noteOn, this.noteOff);
    this.view.setupPresetCallback();

  }

  loadInitialData() {
    ApiService.get("presets")
    .then(data => {
      this.view.createPresetList(data);
    });
  }

  noteOn = (note: string) => {

    let synthState = this.view.getSynthState();
    this.osc = this.audioContext.createOscillator();
    this.gainNode = this.audioContext.createGain();
    this.filterNode = this.audioContext.createBiquadFilter();
    this.osc.type = synthState.waveform;

    this.osc.connect(this.gainNode);
    this.gainNode.connect(this.filterNode);
    this.filterNode.connect(this.audioContext.destination);

    let now = this.audioContext.currentTime;
     
    this.osc.frequency.setValueAtTime(FREQ_MAP.get(note) ?? 0, now);
    this.gainNode.gain.cancelScheduledValues(now);
    this.gainNode.gain.setValueAtTime(0, now);
    this.filterNode.type = "lowpass";
    this.filterNode.frequency.setValueAtTime(synthState.cutoff, now);

    this.gainNode.gain.linearRampToValueAtTime(synthState.volume, now + synthState.attack);
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
  }

};
