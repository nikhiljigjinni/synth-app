import { createParam } from "../utilities";

enum OscType {
    sine = "sine",
    square = "square",
    sawtooth = "sawtooth",
    triangle = "triangle",
}

export interface OscillatorState {
    oscType: OscType;
    adsrEnv: ADSREnvelope;
}

export interface ADSREnvelope {
    attack: number;
    decay: number;
    sustain: number;
    release: number;
}

export class OscillatorView {
    attackRangeElement: HTMLInputElement;
    decayRangeElement: HTMLInputElement;
    sustainRangeElement: HTMLInputElement;
    releaseRangeElement: HTMLInputElement;
    waveformElement: HTMLInputElement;
    oscDiv: HTMLDivElement;
    constructor(parentDiv: HTMLDivElement) {
        this.oscDiv = document.createElement('div');
        this.oscDiv.setAttribute('class', 'oscillator');
        this.createWaveformSelector();
        this.createADSREnvelope();

        this.attackRangeElement = this.oscDiv.querySelector('input[name="attack"]') as HTMLInputElement;
        this.decayRangeElement = this.oscDiv.querySelector('input[name="decay"]') as HTMLInputElement;
        this.sustainRangeElement = this.oscDiv.querySelector('input[name="sustain"]') as HTMLInputElement;
        this.releaseRangeElement = this.oscDiv.querySelector('input[name="release"]') as HTMLInputElement;
        this.waveformElement = this.oscDiv.querySelector('input[type="radio"][name="osc-type"]:checked') as HTMLInputElement;
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
            if (key == OscType.sine) {
                radioInput.checked = true;
            }

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
        let attackParam = createParam("attack", 0.01, 5, 0.01, 0.5, "Attack");
        let decayParam = createParam("decay", 0.01, 5, 0.01, 0.5, "Decay");
        let sustainParam = createParam("sustain", 0, 1, 0.01, 0.5, "Sustain");
        let releaseParam = createParam("release", 0.01, 5, 0.01, 0.5, "Release");

        adsrEnvDiv.appendChild(attackParam.labelElement);
        adsrEnvDiv.appendChild(attackParam.rangeElement);
        adsrEnvDiv.appendChild(decayParam.labelElement);
        adsrEnvDiv.appendChild(decayParam.rangeElement);
        adsrEnvDiv.appendChild(sustainParam.labelElement);
        adsrEnvDiv.appendChild(sustainParam.rangeElement);
        adsrEnvDiv.appendChild(releaseParam.labelElement);
        adsrEnvDiv.appendChild(releaseParam.rangeElement);

        let adsrCanvasElement = document.createElement('canvas');
        adsrCanvasElement.setAttribute('class', 'osc-adsr-canvas');
        adsrDiv.appendChild(adsrEnvDiv);
        adsrDiv.appendChild(adsrCanvasElement);

        this.oscDiv?.appendChild(adsrDiv);
    }

    getState() {
        const adsrState: ADSREnvelope = {
            attack: parseFloat(this.attackRangeElement.value),
            decay: parseFloat(this.decayRangeElement.value),
            sustain: parseFloat(this.sustainRangeElement.value),
            release: parseFloat(this.releaseRangeElement.value),
        } as ADSREnvelope;

        let oscType = document.querySelector('input[type="radio"][name="osc-type"]:checked') as HTMLInputElement;

        return {
            oscType: oscType.value,
            adsrEnv: adsrState
        } as OscillatorState;
    }

}
