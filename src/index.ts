import { Synth } from "./synth";

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

domReady(() => {
  // console.log('Flow');  
  
  const playBtn = document.getElementById('play');
  const attackSlider = <HTMLInputElement>document.getElementById('attack');
  const decaySlider = <HTMLInputElement>document.getElementById('decay');
  const sustainSlider = <HTMLInputElement>document.getElementById('sustain');
  const releaseSlider = <HTMLInputElement>document.getElementById('release');
  const volumeSlider = <HTMLInputElement>document.getElementById('volume');

  let synth = new Synth();

  playBtn?.addEventListener('mousedown', () => {
    // play note
    synth.updateValues(
      parseFloat(attackSlider.value),
      parseFloat(decaySlider.value),
      parseFloat(sustainSlider.value),
      parseFloat(releaseSlider.value),
      parseFloat(volumeSlider.value),
      getRadioValue("waveform")
    );
    synth.noteOn();

  });

  playBtn?.addEventListener('mouseup', () => {
    synth.noteOff();

  });
  


});
