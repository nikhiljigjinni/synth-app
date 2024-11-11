import { useCallback, useEffect, useRef, useState } from "react";
import Oscillator from "./Oscillator";
import Filter from "./Filter";
import { KEYS_TO_NOTES, NOTES_TO_FREQ } from "./constants";

export default function App() {

    const audioContext = useRef(new AudioContext());
    const oscNodes = useRef([new Map(), new Map()]);
    const gainNodes = useRef(new Map());
    const filterNode = useRef(null);

    const [synthState, setSynthState] = useState({
        type: 'sine',
        attack: 0,
        decay: 0,
        sustain: 0,
        release: 0,
        volume: 0.5
    });

    const [filterState, setFilterState] = useState({
        type: 'lowpass',
        cutoff: 500
    });

    // state handling functions
    const handleSynthState = (e) => {
        const value = (e.target.name === 'type') ? e.target.value : parseFloat(e.target.value);
        setSynthState({
            ...synthState,
            [e.target.name]: value
        });
    };

    const handleFilterState = (e) => {
        const value = (e.target.name === 'type') ? e.target.value : parseFloat(e.target.value);
        setFilterState({
            ...filterState,
            [e.target.name]: value
        });
    };


    // function to handle key down
    // need to wrap this in a useCallback so function isn't
    // recreated every time
    const handleNoteDown = useCallback((e) => {

        if (e.key in KEYS_TO_NOTES) {
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
            const noteFrequency = NOTES_TO_FREQ[KEYS_TO_NOTES[e.key]]

            let oscNode = audioContext.current.createOscillator();
            let gainNode = audioContext.current.createGain();
            filterNode.current = audioContext.current.createBiquadFilter();

            const now = audioContext.current.currentTime;
            oscNode.connect(filterNode.current);
            filterNode.current.connect(gainNode);
            gainNode.connect(audioContext.current.destination);

            oscNode.type = synthState.type;
            oscNode.frequency.setValueAtTime(noteFrequency, now);

            filterNode.current.type = filterState.type;
            filterNode.current.frequency.setValueAtTime(filterState.cutoff, now);

            gainNode.gain.cancelScheduledValues(now);
            gainNode.gain.setValueAtTime(0, now);
            gainNode.gain.linearRampToValueAtTime(synthState.volume, now + synthState.attack);
            gainNode.gain.setTargetAtTime(synthState.volume*synthState.sustain, now + synthState.attack, synthState.decay);

            oscNodes.current.set(e.key, oscNode);
            gainNodes.current.set(e.key, gainNode);

            oscNode.start();

        }
    }, [synthState, filterState]);

    const handleNoteUp = useCallback((e) => {

        if (e.key in KEYS_TO_NOTES) {
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

    // set up event listeners 
    useEffect(() => {
        window.addEventListener("keydown", handleNoteDown);
        window.addEventListener("keyup", handleNoteUp);

        // cleanup
        return () => {
            window.removeEventListener("keydown", handleNoteDown);
            window.removeEventListener("keyup", handleNoteUp);

        };
    }, [handleNoteDown, handleNoteUp])

    // setup global filter
    useEffect(() => {
        if (filterNode.current === null) {
            filterNode.current = audioContext.current.createBiquadFilter();
        }

        // cleanup
        return () => {
            if (filterNode.current !== null) {
                filterNode.current.disconnect();
            }
        }
    }, []);

    return (
        <>
            <Oscillator synthState={synthState} handleSynthState={handleSynthState}/>
            <Filter filterState={filterState} handleFilterState={handleFilterState}/>
        </>
    );
}
