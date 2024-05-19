import { FREQ_MAP, KEYS_TO_FREQ, createParam } from "../utilities";
import { OscillatorState, OscillatorView } from "./oscillator-view";
import { FilterState, FilterView } from "./filter-view";
import { MasterState, MasterView } from "./master-control-view";
import { ApiService } from "../api";

export interface SynthState {
  oscState: OscillatorState;
  masterState: MasterState;
  filterState: FilterState;
}

export interface PresetResponse {
  id: number;
  name: string;
  synthState: SynthState;
}

export class SynthView {
  oscillatorsDiv: HTMLDivElement;
  filterDiv: HTMLDivElement;
  masterDiv: HTMLDivElement;
  keyboardDiv: HTMLDivElement;
  presetElement: HTMLSelectElement;
  keyboardElements: HTMLButtonElement[];

  synthState: SynthState;
  oscillatorView: OscillatorView;
  filterView: FilterView;
  masterView: MasterView;
  private playedNotes: Set<string>;
  presets: Map<string, PresetResponse>;

  constructor() {
    // initialize Div containers
    this.oscillatorsDiv = document.getElementById('oscillators') as HTMLDivElement;
    this.filterDiv = document.getElementById('master-filter') as HTMLDivElement;
    this.masterDiv = document.getElementById('master-control') as HTMLDivElement;
    this.keyboardDiv = document.getElementById('keyboard') as HTMLDivElement;
    this.presetElement = document.getElementById('presets') as HTMLSelectElement;

    // initialize keyboard elements
    this.keyboardElements = [];
    this.playedNotes = new Set<string>();
    this.presets = new Map<string, PresetResponse>();

    // defining views
    this.oscillatorView = new OscillatorView(this.oscillatorsDiv);
    this.filterView = new FilterView(this.filterDiv);
    this.masterView = new MasterView(this.masterDiv);

    this.synthState = this.setDefaultSynthState();

    this.createKeyboard(FREQ_MAP);
    this.setupParamCallbacks();

  }

  loadInitialPreset() {
    if (this.presets.has("default")) {
      let default_preset = this.presets.get("default");
      console.log(default_preset?.synthState.oscState.osc_type);
      if (default_preset != null) {
        this.oscillatorView.setState(default_preset.synthState.oscState);
        this.filterView.setState(default_preset.synthState.filterState);
        this.masterView.setState(default_preset.synthState.masterState);
        this.updateSynthState();
      }
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
        this.oscillatorView.setState(selectedPreset.synthState.oscState);
        this.filterView.setState(selectedPreset.synthState.filterState);
        this.masterView.setState(selectedPreset.synthState.masterState);
      }
    });
  }

  setupParamCallbacks() {
    let oscParams = [...this.oscillatorsDiv.querySelectorAll('input[type="range"], input[type="radio"]')];
    let filterParams = [...this.filterDiv.querySelectorAll('input[type="range"], input[type="radio"]')];
    let masterParams = [...this.masterDiv.querySelectorAll('input[type="range"], input[type="radio"]')];

    let synthParams = [
      ...oscParams,
      ...filterParams,
      ...masterParams
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
      masterState: this.masterView.getState(),
    } as SynthState;
  }

  updateSynthState() {
    let oscState = this.oscillatorView.getState();
    let filterState = this.filterView.getState();
    let masterState = this.masterView.getState();

    this.synthState = {
      oscState: oscState,
      filterState: filterState,
      masterState: masterState
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