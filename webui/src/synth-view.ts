// import { FREQ_MAP } from "./utilities";
import { ApiService } from "./api";

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

export interface PresetResponse {
  name: string;
  attack: number;
  decay: number;
  sustain: number;
  release: number;
}  

export class SynthView {
  attackElement: HTMLInputElement;
  decayElement: HTMLInputElement;
  sustainElement: HTMLInputElement;
  releaseElement: HTMLInputElement;
  volumeElement: HTMLInputElement;
  keyboardElements: HTMLButtonElement[];
  presets: Map<string, PresetResponse>;
  waveformElements: NodeListOf<HTMLInputElement>;
  delayElement: HTMLInputElement;
  cutoffElement: HTMLInputElement;
  presetElement: HTMLSelectElement;

  constructor() {
    this.attackElement = <HTMLInputElement>document.getElementById('attack');
    this.decayElement = <HTMLInputElement>document.getElementById('decay');
    this.sustainElement = <HTMLInputElement>document.getElementById('sustain');
    this.releaseElement = <HTMLInputElement>document.getElementById('release');
    this.volumeElement = <HTMLInputElement>document.getElementById('volume');
    this.delayElement = <HTMLInputElement>document.getElementById('delay');
    this.cutoffElement = <HTMLInputElement>document.getElementById('cutoff');
    this.presetElement = <HTMLSelectElement>document.getElementById('presets');
    this.waveformElements = document.querySelectorAll<HTMLInputElement>('input[type="waveform"]');
    this.keyboardElements = [];
    this.presets = new Map<string, PresetResponse>();
  }

  createKeyboard(freqMap: Map<string, number>) {
    let keyboardParentElement = <HTMLDivElement>document.getElementById("keyboard");

    for (const pianoNote of freqMap.keys()) {
      let pianoKeyButton = <HTMLButtonElement>document.createElement('button');
      pianoKeyButton.setAttribute('id', pianoNote);
      pianoKeyButton.setAttribute('class', "keyboard-button");
      pianoKeyButton.innerText = pianoNote;

      keyboardParentElement.appendChild(pianoKeyButton);
      this.keyboardElements.push(pianoKeyButton);
    }

  }

  createPresetList(data: Array<PresetResponse>) { 
    for (let i = 0; i < data.length; i++) {
      let presetOptionElement = <HTMLOptionElement>document.createElement('option');
      presetOptionElement.setAttribute('value', data[i].name);
      presetOptionElement.innerText = data[i].name;

      this.presetElement.appendChild(presetOptionElement);
      this.presets.set(data[i].name, data[i]);
    }
  }

  setupPresetCallback() {
    this.presetElement.addEventListener('change', () => {
      let selectedOption = this.presetElement.options[this.presetElement.selectedIndex];
      if (this.presets.has(selectedOption.value)) {
        let selectedPreset = this.presets.get(selectedOption.value)!;
        this.attackElement.value = selectedPreset?.attack.toString();
        this.decayElement.value = selectedPreset?.decay.toString();
        this.sustainElement.value = selectedPreset?.sustain.toString();
        this.releaseElement.value = selectedPreset?.release.toString();
      }
      // console.log("Selected Value:", this.presets.get(selectedOption.value));
    });
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