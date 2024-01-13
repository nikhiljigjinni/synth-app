import { FREQ_MAP, KEYS_TO_FREQ, createParam } from "../utilities";
import { OscillatorState, OscillatorView } from "./oscillator-view";
import { ApiService } from "../api";

export interface SynthState {
  oscState: OscillatorState;
  volume: number;
}

export class SynthView {
  oscillatorsElement: HTMLDivElement;
  oscillatorView: OscillatorView;
  volumeElement: HTMLInputElement | null;
  synthState: SynthState;
  keyboardElements: HTMLButtonElement[];
  private playedNotes: Set<string>;

  // activeVoices: Map<string, OscillatorNode>;
  constructor() {
    // create oscillators from default preset
    this.oscillatorsElement = <HTMLDivElement>document.getElementById('oscillators');
    this.oscillatorView = new OscillatorView(this.oscillatorsElement);
    this.synthState = this.setDefaultSynthState();
    this.keyboardElements = [];
    // this.activeVoices = new Map<string, OscillatorNode>();
    this.playedNotes = new Set<string>();

    this.createMasterDiv();
    this.createKeyboard(FREQ_MAP);
    let masterVolumeElement =  <HTMLDivElement>document.getElementById('master-control')!;
    this.volumeElement = masterVolumeElement.querySelector('input[type="range"]')!;
    this.setupParamCallbacks();

  }

  setupParamCallbacks() {
    let oscParams = this.oscillatorsElement.querySelectorAll('input[type="range"], input[type="radio"]');

    oscParams.forEach(paramElement => {
      paramElement.addEventListener('input', (e) => {
        this.oscillatorView.updateOscillatorState();
        this.updateSynthState();
      });
    });

    this.volumeElement?.addEventListener('input', (e) => {
      this.updateSynthState();
    });
  }

  setDefaultSynthState() {
    return {
      oscState: this.oscillatorView.getOscillatorState(),
      volume: 0,
    } as SynthState;
  }

  updateSynthState() {
    console.log(this);
    let oscState = this.oscillatorView.getOscillatorState();
    let volume = 0;
    if (this.volumeElement) {
      volume = parseFloat(this.volumeElement.value);
    }

    this.synthState = {
      oscState: oscState,
      volume: volume
    };

  }

  getSynthState() {
    return this.synthState;
  }

  createMasterDiv() {
    let masterVolumeElement = <HTMLDivElement>document.getElementById('master-control');
    let volumeInput = createParam('master-volume', 0.01, 1, 0.01, 0.1);

    let volumeLabel = document.createElement('label');
    volumeLabel.textContent = 'Volume';
  
    masterVolumeElement.appendChild(volumeLabel);
    masterVolumeElement.appendChild(volumeInput);

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

  setupKeyboardCallback(noteOnCallback: (note: string) => void, noteOffCallback: (note: string) => void) {

      addEventListener("keydown", (event) => {
        let note = KEYS_TO_FREQ.get(event.key)!;
        if (!this.playedNotes.has(note)) {
          noteOnCallback(note);
          this.playedNotes.add(note);
        }

      });

      addEventListener("keyup", (event) => {
        let note = KEYS_TO_FREQ.get(event.key)!;
        if (this.playedNotes.has(note)) {
          noteOffCallback(note);
          this.playedNotes.delete(note);
        }
        
      });

      this.keyboardElements
        .forEach(
          (pianoKey: HTMLButtonElement) => {
            pianoKey.addEventListener('mousedown', (event) => {
              let note = pianoKey.id;
              if (!this.playedNotes.has(note)) {
                noteOnCallback(note);
                this.playedNotes.add(note);
              }
            });

            pianoKey.addEventListener('mouseup', (event) => {
              let note = pianoKey.id;
              if (this.playedNotes.has(note)) {
                noteOffCallback(note);
                this.playedNotes.delete(note);
              }
            });
          }
        );  
    }
}