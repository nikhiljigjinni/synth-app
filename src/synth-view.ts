// import { FREQ_MAP } from "./utilities";

export interface SynthState {
  attack: number;
  decay: number;
  sustain: number;
  release: number;
  volume: number;
  waveform: OscillatorType;
  delay: number;
  cutoff: number;
}

export class SynthView {
  attackElement: HTMLInputElement;
  decayElement: HTMLInputElement;
  sustainElement: HTMLInputElement;
  releaseElement: HTMLInputElement;
  volumeElement: HTMLInputElement;
  keyboardElements: HTMLButtonElement[];
  waveformElements: NodeListOf<HTMLInputElement>;
  delayElement: HTMLInputElement;
  cutoffElement: HTMLInputElement;


  constructor() {
    this.attackElement = <HTMLInputElement>document.getElementById('attack');
    this.decayElement = <HTMLInputElement>document.getElementById('decay');
    this.sustainElement = <HTMLInputElement>document.getElementById('sustain');
    this.releaseElement = <HTMLInputElement>document.getElementById('release');
    this.volumeElement = <HTMLInputElement>document.getElementById('volume');
    this.delayElement = <HTMLInputElement>document.getElementById('delay');
    this.cutoffElement = <HTMLInputElement>document.getElementById('cutoff');
    this.waveformElements = document.querySelectorAll<HTMLInputElement>('input[type="waveform"]');
    this.keyboardElements = [];
  }

  createKeyboard(freqMap: Map<string, number>) {
    let keyboardParentElement = <HTMLDivElement>document.getElementById("keyboard")

    for (const pianoNote of freqMap.keys()) {
      let pianoKeyButton = <HTMLButtonElement>document.createElement('button');
      pianoKeyButton.setAttribute('id', pianoNote);
      pianoKeyButton.setAttribute('class', "keyboard-button");
      pianoKeyButton.innerText = pianoNote;

      keyboardParentElement.appendChild(pianoKeyButton);
      this.keyboardElements.push(pianoKeyButton);
    }

  }

  setupKeyboardCallback(noteOnCallback: (note: string) => void, noteOffCallback: () => void) {
    this.keyboardElements
     .forEach(
        (pianoKey: HTMLButtonElement) => {
          pianoKey.addEventListener('mousedown', () => {
            noteOnCallback(pianoKey.id);
          });
          pianoKey.addEventListener('mouseup', noteOffCallback);
        }
     );  
  }
  
  getSynthState(): SynthState {
    
    let waveform: OscillatorType = 'square';

    for (let i = 0; i < this.waveformElements.length; i++) {
      if (this.waveformElements[i].checked) {
        waveform = <OscillatorType>this.waveformElements[i].value;
        break;
      }
    }

    let _state = {
      "attack": parseFloat(this.attackElement.value),
      "decay": parseFloat(this.decayElement.value),
      "sustain": parseFloat(this.sustainElement.value),
      "release": parseFloat(this.releaseElement.value),
      "volume": parseFloat(this.volumeElement.value),
      "waveform": waveform,
      "delay": parseFloat(this.delayElement.value),
      "cutoff": parseFloat(this.cutoffElement.value),
      
    }

    return _state;

  }

};


// export class Synth {
//   attack: number;
//   decay: number;
//   sustain: number;
//   release: number;
//   volume: number;
//   waveform: OscillatorType;
//   private _osc: OscillatorNode | undefined;
//   private _gainNode: GainNode | undefined;
//   private _audioContext: AudioContext;
//   private _freq: number | undefined;
//
//   constructor(audioContext: AudioContext) {
//     this.attack = 0 ;
//     this.decay = 0;
//     this.sustain = 0;
//     this.release = 0;
//     this.waveform = "sine";
//     this.volume = 0;
//     this._osc = undefined;
//     this._gainNode = undefined;
//     this._freq = 0;
//     this._audioContext = audioContext;
//   }
//
//   public updateValues(
//     attack: number,
//     decay: number,
//     sustain: number,
//     release: number,
//     volume: number,
//     freq: number | undefined,
//     waveform: OscillatorType,
//   ): void {
//
//     this.attack = attack;
//     this.decay = decay;
//     this.sustain = sustain;
//     this.release = release;
//     this._freq = freq
//     this.waveform = waveform;
//     this.volume = volume;
//
//   }
//
//
//   public noteOn() {
//     this._osc = this._audioContext.createOscillator();
//     this._gainNode = this._audioContext.createGain();
//     this._osc.type = this.waveform;
//    
//     this._osc.connect(this._gainNode);
//     this._gainNode.connect(this._audioContext.destination);
//
//     let now = this._audioContext.currentTime;
//
//     if (this._freq != undefined) {
//       this._osc.frequency.setValueAtTime(this._freq, now);
//     }
//
//     this._gainNode.gain.cancelScheduledValues(now);
//     this._gainNode.gain.setValueAtTime(0, now);
//
//     this._gainNode.gain.linearRampToValueAtTime(this.volume, now + this.attack);
//     // this._gainNode.gain.linearRampToValueAtTime(this.sustain, now + this.attack + this.decay);
//     this._gainNode.gain.setTargetAtTime(this.sustain*this.volume, now + this.attack, this.decay);
//     this._osc.start(now);
//
//   }
//
//   public noteOff() {
//     let now = this._audioContext.currentTime;
//     this._gainNode?.gain.cancelScheduledValues(now);
//     this._gainNode?.gain.setValueAtTime(this._gainNode?.gain.value, now);
//     this._gainNode?.gain.linearRampToValueAtTime(0, now + this.release);
//     this._osc?.stop(now + this.release);
//
//   }
//
// }
//
