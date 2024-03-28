import { FREQ_MAP, KEYS_TO_FREQ, createParam } from "../utilities";
import { OscillatorState, OscillatorView } from "./oscillator-view";
import { FilterState, FilterView } from "./filter-view";
import { MasterControlState, MasterControlView } from "./master-control-view";
import { ApiService } from "../api";

export interface SynthState {
  oscState: OscillatorState;
  masterControlState: MasterControlState;
  filterState: FilterState;
}

export class SynthView {
  oscillatorsDiv: HTMLDivElement;
  filterDiv: HTMLDivElement;
  masterControlDiv: HTMLDivElement;
  keyboardDiv: HTMLDivElement;
  keyboardElements: HTMLButtonElement[];

  synthState: SynthState;
  oscillatorView: OscillatorView;
  filterView: FilterView;
  masterControlView: MasterControlView;
  private playedNotes: Set<string>;

  constructor() {
    // initialize Div containers
    this.oscillatorsDiv = document.getElementById('oscillators') as HTMLDivElement;
    this.filterDiv = document.getElementById('master-filter') as HTMLDivElement;
    this.masterControlDiv = document.getElementById('master-control') as HTMLDivElement;
    this.keyboardDiv = document.getElementById('keyboard') as HTMLDivElement;

    // initialize keyboard elements
    this.keyboardElements = [];
    this.playedNotes = new Set<string>();

    // defining views
    this.oscillatorView = new OscillatorView(this.oscillatorsDiv);
    this.filterView = new FilterView(this.filterDiv);
    this.masterControlView = new MasterControlView(this.masterControlDiv);

    this.synthState = this.setDefaultSynthState();

    this.createKeyboard(FREQ_MAP);
    this.setupParamCallbacks();

  }

  setupParamCallbacks() {
    let oscParams = [...this.oscillatorsDiv.querySelectorAll('input[type="range"], input[type="radio"]')];
    let filterParams = [...this.filterDiv.querySelectorAll('input[type="range"], input[type="radio"]')];
    let masterControlParams = [...this.masterControlDiv.querySelectorAll('input[type="range"], input[type="radio"]')];

    let synthParams = [
      ...oscParams,
      ...filterParams,
      ...masterControlParams
    ];

    synthParams.forEach(paramElement => {
      paramElement.addEventListener('input', (e) => {
        this.updateSynthState();
      });
    });

  }

  getState() {
    return this.synthState;
  }

  setDefaultSynthState() {
    return {
      oscState: this.oscillatorView.getState(),
      filterState: this.filterView.getState(),
      masterControlState: this.masterControlView.getState(),
    } as SynthState;
  }

  updateSynthState() {
    let oscState = this.oscillatorView.getState();
    let filterState = this.filterView.getState();
    let masterControlState = this.masterControlView.getState();

    this.synthState = {
      oscState: oscState,
      filterState: filterState,
      masterControlState: masterControlState
    };

  }

  createKeyboard(freqMap: Map<string, number>) {

    for (const pianoNote of freqMap.keys()) {
      let pianoKeyButton = document.createElement('button');
      pianoKeyButton.setAttribute('id', pianoNote);
      pianoKeyButton.setAttribute('class', "keyboard-button");
      pianoKeyButton.innerText = pianoNote;

      this.keyboardDiv.appendChild(pianoKeyButton);
      this.keyboardElements.push(pianoKeyButton);
      console.log("Creating keys");
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