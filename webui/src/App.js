import { useCallback, useEffect, useRef, useState } from "react";

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

const keysToNotes = {
  'a': 'C3',
  'w': 'C#3/Db3',
  's': 'D3',
  'e': 'D#3/Eb3',
  'd': 'E3',
  'f': 'F3',
  't': 'F#3/Gb3',
  'g': 'G3',
  'y': 'G#3/Ab3',
  'h': 'A3',
  'u': 'A#3/Bb3',
  'j': 'B3',
}

export default function App() {

    const audioContext = useRef(new AudioContext());
    const oscNodes = useRef(new Map());
    const gainNodes = useRef(new Map());
    const filterNode = useRef(null);

    const [synthType, setSynthType] = useState('sine');
    const [synthState, setSynthState] = useState({
        attack: 0,
        decay: 0,
        sustain: 0,
        release: 0,
        volume: 0.5
    });

    const [filterType, setFilterType] = useState('lowpass');
    const [filterState, setFilterState] = useState({
        cutoff: 500
    });

    const handleInput = (e, paramName, type = "envelope") => {
        if (type === 'filter') {
            setFilterState({
                ...filterState,
                [paramName]: parseFloat(e.target.value)
            });
        }
        else if (type === 'envelope') {
            setSynthState({
                ...synthState,
                [paramName]: parseFloat(e.target.value)
            });
        }
    };

    const handleSynthType = (e) => {
        setSynthType(e.target.value);
    };

    const handleFilterType = (e) => {
        setFilterType(e.target.value);
    };

    const handleNoteDown = useCallback((e) => {
        // prevent repeat if key is long pressed

        if (e.key in keysToNotes) {
            if (e.repeat) {
                return
            }

            // cleanup existing gain and osc nodes
            if (oscNodes.current.has(e.key)) {
                let oscNode = oscNodes.current.get(e.key);
                oscNode.stop(audioContext.current.currentTime);
                oscNodes.current.delete(e.key);
            }
            
            if (gainNodes.current.has(e.key)) {
                let gainNode = gainNodes.current.get(e.key);
                gainNode.gain.cancelScheduledValues(audioContext.current.currentTime);
                gainNodes.current.delete(e.key);
            }

            // play note
            const noteFrequency = keyMap[keysToNotes[e.key]]

            let oscNode = audioContext.current.createOscillator();
            let gainNode = audioContext.current.createGain();
            filterNode.current = audioContext.current.createBiquadFilter();

            const now = audioContext.current.currentTime;
            oscNode.connect(filterNode.current);
            filterNode.current.connect(gainNode);
            gainNode.connect(audioContext.current.destination);

            oscNode.type = synthType;
            oscNode.frequency.setValueAtTime(noteFrequency, now);

            filterNode.current.type = filterType;
            filterNode.current.frequency.setValueAtTime(filterState.cutoff, now);

            gainNode.gain.cancelScheduledValues(now);
            gainNode.gain.setValueAtTime(0, now);
            gainNode.gain.linearRampToValueAtTime(synthState.volume, now + synthState.attack);
            gainNode.gain.setTargetAtTime(synthState.volume*synthState.sustain, now + synthState.attack, synthState.decay);

            oscNodes.current.set(e.key, oscNode);
            gainNodes.current.set(e.key, gainNode);

            oscNode.start();

        }
    }, [synthType, synthState, filterType, filterState]);

    const handleNoteUp = useCallback((e) => {

        if (e.key in keysToNotes) {
            if (oscNodes.current.has(e.key) && gainNodes.current.has(e.key)) {
                let oscNode = oscNodes.current.get(e.key);
                let gainNode = gainNodes.current.get(e.key);

                const now = audioContext.current.currentTime;
                gainNode.gain.cancelScheduledValues(now);
                gainNode.gain.setValueAtTime(gainNode.gain.value, now);
                gainNode.gain.linearRampToValueAtTime(0, now + synthState.release);

                oscNode.stop(now + synthState.release);

                oscNodes.current.delete(e.key, oscNode);
                gainNodes.current.delete(e.key, gainNode);

            } 
        }
    }, [synthState]);

    useEffect(() => {
        // setup event listeners
        window.addEventListener("keydown", handleNoteDown);
        window.addEventListener("keyup", handleNoteUp);

        if (filterNode.current === null) {
            filterNode.current = audioContext.current.createBiquadFilter();
        }

        // remove event listeners
        return () => {
            window.removeEventListener("keydown", handleNoteDown);
            window.removeEventListener("keyup", handleNoteUp);

            if (filterNode.current !== null) {
                filterNode.current.disconnect();
            }

        };
    }, [handleNoteDown, handleNoteUp])

    return (
        <>
            <label htmlFor="attack">Attack</label> 
            <input type="range" name="attack" min="0.01" max="4" step="0.01" value={synthState.attack} onChange={(e) => handleInput(e, "attack")}/>
            <label htmlFor="decay">Decay</label> 
            <input type="range" name="decay" min="0.05" max="4" step="0.01" value={synthState.decay} onChange={(e) => handleInput(e, "decay")}/>
            <label htmlFor="sustain">Sustain</label> 
            <input type="range" name="sustain" min="0" max="1" step="0.01" value={synthState.sustain} onChange={(e) => handleInput(e, "sustain")}/>
            <label htmlFor="release">Release</label> 
            <input type="range" name="release" min="0.01" max="4" step="0.01" value={synthState.release} onChange={(e) => handleInput(e, "release")}/>
            <label htmlFor="volume">Volume</label> 
            <input type="range" name="volume" min="0" max="1" step="0.01" value={synthState.volume} onChange={(e) => handleInput(e, "volume")}/>

            <select value={synthType} onChange={handleSynthType}>
                <option value="sine">Sine</option>
                <option value="square">Square</option>
                <option value="triangle">Triangle</option>
                <option value="sawtooth">Sawtooth</option>
            </select>


            <label htmlFor="cutoff">Cutoff</label> 
            <input type="range" name="cutoff" min="20" max="3000" step="20" value={filterState.cutoff} onChange={(e) => handleInput(e, "cutoff", "filter")}/>

            <select value={filterType} onChange={handleFilterType}>
                <option value="lowpass">Lowpass</option>
                <option value="highpass">Highpass</option>
                <option value="bandpass">Bandpass</option>
            </select>
        </>
    );
}
