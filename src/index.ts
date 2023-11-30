import { Synth } from "./synth";
const FREQ_VALUES = new Map<string, number>([
    ["C3", 130.81],
    ["C#3", 138.59],
    ["D3", 146.83],
    ["D#3", 155.56],
    ["E3", 164.81],
    ["F3", 174.61],
    ["F#3", 185.00],
    ["G3", 196.00],
    ["G#3", 207.65],
    ["A3", 220.00],
    ["A#3", 233.08],
    ["B3", 246.94],
    ["C4", 261.63]
  ]
);

function domReady(callback: () => void): void {
  if (document.readyState !== 'loading') {
    callback();
  }
  else {
    document.addEventListener('DOMContentLoaded', callback);
  }
}

function getRadioValue(radioGroup: string): OscillatorType  {
  let radioButtons = <NodeListOf<HTMLInputElement>>document.getElementsByName(radioGroup);

  for (let i = 0; i < radioButtons.length; i++) {
    if (radioButtons[i].checked) {
      return <OscillatorType>radioButtons[i].value;
    }
  }
  return 'sine';
}

function loadKeyboard() {
  let keyboard_div = <HTMLDivElement>document.getElementById("keyboard")

  for (const key of FREQ_VALUES.keys()) {
    let keybutton = <HTMLButtonElement>document.createElement('button');
    keybutton.setAttribute('id', key);
    keybutton.setAttribute('class', "keyboard_button");
    keybutton.innerText = key;

    keyboard_div.appendChild(keybutton);
  }

}

domReady(() => {
  // console.log('Flow');  

  loadKeyboard();
  
  // const playBtn = document.getElementById('play');
  const attackSlider = <HTMLInputElement>document.getElementById('attack');
  const decaySlider = <HTMLInputElement>document.getElementById('decay');
  const sustainSlider = <HTMLInputElement>document.getElementById('sustain');
  const releaseSlider = <HTMLInputElement>document.getElementById('release');
  const volumeSlider = <HTMLInputElement>document.getElementById('volume');
  const audioContext = new AudioContext();
  let keyboardButtons = [...document.querySelectorAll<HTMLButtonElement>('.keyboard_button')];


  let synth = new Synth(audioContext);


  keyboardButtons?.forEach((keyButton: HTMLButtonElement) => {
    keyButton?.addEventListener('mousedown', () => {

      if (audioContext.state === 'suspended') {
        audioContext.resume();
      }

      let freq = FREQ_VALUES.get(keyButton.id);

      // play note
      synth.updateValues(
        parseFloat(attackSlider.value),
        parseFloat(decaySlider.value),
        parseFloat(sustainSlider.value),
        parseFloat(releaseSlider.value),
        parseFloat(volumeSlider.value),
        freq,
        getRadioValue("waveform")
      );
      synth.noteOn();

    });

    keyButton?.addEventListener('mouseup', () => {
      if (audioContext.state === 'suspended') {
        audioContext.resume();
      }
      synth.noteOff();
    });

  });


});
