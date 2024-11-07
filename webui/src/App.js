import { useState, useRef } from 'react'
import Param from './Param'
import Envelope from './Envelope'
import Filter from './Filter'
import Keyboard from './Keyboard'

const keyMap = {
  'C3':	130.81,
  'C#3/Db3':	138.59,
  'D3':	146.83,
  'D#3/Eb3':	155.56,
  'E3':	164.81,
  'F3':	174.61,
  'F#3/Gb3':	185.00,
  'G3':	196.00,
  'G#3/Ab3':	207.65,
  'A3':	220.00,
  'A#3/Bb3':	233.08,
  'B3':	246.94,
  'C4':	261.63,
  'C#4/Db4':	277.18,
  'D4':	293.66,
  'D#4/Eb4':	311.13,
  'E4':	329.63,
  'F4':	349.23,
  'F#4/Gb4':	369.99,
  'G4':	392.00,
  'G#4/Ab4':	415.30,
  'A4':	440.00,
  'A#4/Bb4':	466.16,
  'B4':	493.88,
  'C5':	523.25,
}

export default function App() {

  const audioContext = useRef(new AudioContext());
  
  const gainNodes = useRef(new Map());
  const oscNodes = useRef(new Map());
  const filterNode = useRef(null);

  const [synthType, setSynthType] = useState('sine');
  const [filterType, setFilterType] = useState('lowpass');
  const [synthState, setSynthState] = useState({
    attack: 0 ,
    decay: 0.2,
    sustain: 0.3,
    release: 0.3,
    cutoff: 1800.0,
    resonance: 0,
    volume: 0.5,
  });


  function handleInput(e, labelName) {
    const stateCopy = {...synthState};
    stateCopy[labelName] = parseFloat(e.target.value);
    console.log(synthState);
    setSynthState(stateCopy);
  }


  function handleNoteDown(e) {
    const note = e.target.name;

    // cleanup of audio nodes here
    if (oscNodes.current.has(note) && gainNodes.current.has(note)){
      delete oscNodes.current[note];
      delete gainNodes.current[note];
    }

    let oscNode = audioContext.current.createOscillator();
    let gainNode = audioContext.current.createGain();
    filterNode.current = audioContext.current.createBiquadFilter();

    oscNode.type = synthType;

    oscNode.connect(filterNode.current);
    filterNode.current.connect(gainNode);
    gainNode.connect(audioContext.current.destination);

    let now = audioContext.current.currentTime;
    oscNode.frequency.setValueAtTime(keyMap[note] ?? 0, now);
    gainNode.gain.cancelScheduledValues(now);
    gainNode.gain.setValueAtTime(0, now);

    filterNode.current.type = filterType;
    filterNode.current.frequency.setValueAtTime(synthState.cutoff, now);

    gainNode.gain.linearRampToValueAtTime(synthState.volume, now + synthState.attack);
    gainNode.gain.setTargetAtTime(synthState.sustain * synthState.volume, now + synthState.attack, synthState.decay);
    oscNode.start(now);

    oscNodes.current.set(note, oscNode);
    gainNodes.current.set(note, gainNode);
  }

  function handleNoteUp(e) {
    const note = e.target.name;

    if (oscNodes.current.has(note) && gainNodes.current.has(note)) {
      let currentOscNode = oscNodes.current.get(note);
      let currentGainNode = gainNodes.current.get(note);

      let now = audioContext.current.currentTime;
      currentGainNode.gain.cancelScheduledValues(now);
      currentGainNode.gain.setValueAtTime(currentGainNode.gain.value, now);
      currentGainNode.gain.linearRampToValueAtTime(0.0, now + synthState.release);
      currentOscNode?.stop(now + synthState.release);
      if (!filterNode.current) {
        filterNode.current.disconnect();
      }
    }
  }

  return (
    <>
      <h1>Synth App</h1>

      <Envelope synthType={synthType} attack={synthState.attack} decay={synthState.decay} sustain={synthState.sustain} release={synthState.release} handleInput={handleInput} handleSynthType={(e) => setSynthType(e.target.value)}/>

      <Filter cutoff={synthState.cutoff} resonance={synthState.resonance} filterType={filterType} handleInput={handleInput} handleFilterType={(e) => setFilterType(e.target.value)}/>

      <div className='master-control'>
        <Param labelName="volume" min="0.0" max="1.0" step="0.01" value={synthState.volume} onHandleInput={(e) => handleInput(e, "volume")}/>
        <Keyboard keyMap={keyMap} onNoteDown={(e) => handleNoteDown(e)} onNoteUp={(e) => handleNoteUp(e)}/>
      </div>
    </>
  )
}
