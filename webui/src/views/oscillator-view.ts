enum OscType {
    sine = "sine",
    square = "square",
    sawtooth = "sawtooth",
    triangle = "triangle",
}

export interface ADSREnvelope {
    attack: number;
    decay: number;
    sustain: number;
    release: number;
}

export interface OscillatorState {
    oscType: OscType;
    adsrEnv: ADSREnvelope
}

export class OscillatorView {
    oscDiv: HTMLDivElement | null;
    oscState: OscillatorState;
    constructor(parentDiv: HTMLDivElement) {
        /*
            1) Create waveform
            2) Create ADSR envelopes
        */

        this.oscState = this.setDefaultOscState();
        this.oscDiv = document.createElement('div')
        this.oscDiv.setAttribute('class', 'oscillator');
        this.createWaveformSelector();
        this.createADSREnvelope();
        parentDiv.appendChild(this.oscDiv);
    }

    createWaveformSelector() {
        const waveforms = Object.keys(OscType);

        let waveformDiv = document.createElement('div');
        waveformDiv.setAttribute('class', 'osc-waveform');

        waveforms.forEach((key, index) => {

        let radioInput = document.createElement('input');
        radioInput.type = 'radio';
        radioInput.name = 'osc-type';
        radioInput.value = key as string;

        const label = document.createElement('label');
        label.setAttribute('for', key);
        label.textContent = key;

        waveformDiv.appendChild(label);
        waveformDiv.appendChild(radioInput);

        });

        this.oscDiv?.appendChild(waveformDiv);
    }
    
    createADSREnvelope() {
        let adsrDiv = document.createElement('div');
        adsrDiv.setAttribute('class', 'osc-adsr');
    
        let adsrEnvDiv = document.createElement('div');
        adsrEnvDiv.setAttribute('class', 'osc-adsr-env');
    
        // this would ideally be data from the default db preset
        const oscParams: ADSREnvelope = {
          attack: 0.2,
          decay: 0.2,
          sustain: 0.2,
          release: 0.2,
        };
    
        let min = 0.05;
        let max = 1;
    
        Object.keys(oscParams).forEach(key => {
    
          let paramElement = document.createElement('input');
          paramElement.type = 'range';
          paramElement.min = min.toString();
          paramElement.max = max.toString();
          paramElement.name = key;
          paramElement.id = key;
          paramElement.value = '0.4';
          paramElement.step = '0.01';

          let label = document.createElement('label');
          label.setAttribute('for', key);
          label.textContent = key;

    
          adsrEnvDiv.appendChild(label);
          adsrEnvDiv.appendChild(paramElement);
    
        });
    
        let adsrCanvasElement = document.createElement('canvas');
        adsrCanvasElement.setAttribute('class', 'osc-adsr-canvas');
    
        adsrDiv.appendChild(adsrEnvDiv);
        adsrDiv.appendChild(adsrCanvasElement);
    
        this.oscDiv?.appendChild(adsrDiv);

    }
    
    setDefaultOscState() {
        return {
            oscType: OscType.sine,
            adsrEnv: {
                attack: 0.1,
                decay: 0.1,
                sustain: 0.1,
                release: 0.1,
            }
        } as OscillatorState;
    }

    updateOscillatorState() {
        // console.log("hello");
        let attackElement = <HTMLInputElement>document.getElementById('attack')!
        let decayElement = <HTMLInputElement>document.getElementById('decay')!
        let sustainElement = <HTMLInputElement>document.getElementById('sustain')!
        let releaseElement = <HTMLInputElement>document.getElementById('release')!
        let waveformElements = document.querySelectorAll<HTMLInputElement>('input[name="osc-type"]');
        // console.log(waveformElements);

        let oscType = OscType.sine;

        for (let i = 0; i < waveformElements.length; i++) {
            if (waveformElements[i].checked) {
                oscType = waveformElements[i].value as OscType;
                break;
            }
        }

        let adsrState: ADSREnvelope = {
            attack: parseFloat(attackElement.value),
            decay: parseFloat(decayElement.value),
            sustain: parseFloat(sustainElement.value),
            release: parseFloat(releaseElement.value),
        }

        this.oscState = {
            oscType: oscType,
            adsrEnv: adsrState,
        }

        console.log(this.oscState);
    }

    getOscillatorState() {
        return this.oscState;
    }
}