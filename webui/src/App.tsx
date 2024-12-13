import React, { useCallback, useEffect, useRef, useState } from 'react';
import Oscillator from './Oscillator';
import Filter from './Filter';
import { KEYS_TO_NOTES, NOTES_TO_FREQ, NUM_OSCS } from './constants';
import { SynthState, FilterState } from './types';

type GainNodeMap = Map<string, Array<GainNode>>;
type OscNodeMap = Map<string, Array<OscillatorNode>>;

export default function App() {
  const audioContext = useRef<AudioContext>(new AudioContext());
  const oscNodes = useRef<OscNodeMap>(new Map<string, Array<OscillatorNode>>());
  const gainNodes = useRef<GainNodeMap>(new Map<string, Array<GainNode>>());
  const filterNode = useRef<BiquadFilterNode | null>(null);

  const [synthStates, setSynthStates] = useState<Array<SynthState>>(() => {
    const initialData: Array<SynthState> = [];
    for (let i = 0; i < NUM_OSCS; i++) {
        initialData.push(
          {
            type: 'sine',
            attack: 0,
            decay: 0,
            sustain: 0,
            release: 0,
            volume: 0.2,
          }
        );
    }
    return initialData;
  });
  const [filterState, setFilterState] = useState<FilterState>({
    type: 'lowpass' as BiquadFilterType,
    cutoff: 500,
  });

  // state handling functions
  const handleSynthStates = (
    oscId: number, e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const value =
      e.target.name === 'type' ? e.target.value as OscillatorType: parseFloat(e.target.value);

    setSynthStates(() => {
        return synthStates.map((synthState, index) => index === oscId ? {...synthState, [e.target.name]: value} : synthState);
    })
  };

  const handleFilterState = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    console.log(e.target.name);
    const value =
      e.target.name === 'type' ? e.target.value as BiquadFilterType: parseFloat(e.target.value);
    setFilterState({
      ...filterState,
      [e.target.name]: value,
    });
  };
  // function to handle key down
  // need to wrap this in a useCallback so function isn't
  // recreated every time
  const handleNoteDown = useCallback(
    (e: KeyboardEvent) => {
      e.preventDefault();
      if (KEYS_TO_NOTES.has(e.key)) {
        if (e.repeat) {
          return;
        }

        // cleanup existing gain and osc nodes
        if (oscNodes.current.has(e.key)) {
            let nodes = oscNodes.current.get(e.key)!;
            nodes.forEach((node) => {
                node.stop(audioContext.current.currentTime);
            }); 
            oscNodes.current.delete(e.key);
        }

        if (gainNodes.current.has(e.key)) {
            let nodes = gainNodes.current.get(e.key)!;
            nodes.forEach((node) => {
                node.gain.cancelScheduledValues(audioContext.current.currentTime);
            });
            gainNodes.current.delete(e.key);
        }

        // play note
        const noteFrequency = NOTES_TO_FREQ.get(KEYS_TO_NOTES.get(e.key)!)!;
  
        let tempOscNodes = [];
        let tempGainNodes = [];
        filterNode.current = audioContext.current.createBiquadFilter();

        for (let i = 0; i < NUM_OSCS; i++) {
            let tempOscNode = audioContext.current.createOscillator();
            let tempGainNode = audioContext.current.createGain();
            const now = audioContext.current.currentTime;

            tempOscNode.connect(filterNode.current);
            filterNode.current.connect(tempGainNode)
            tempGainNode.connect(audioContext.current.destination);

            filterNode.current.type = filterState.type;
            filterNode.current.frequency.setValueAtTime(filterState.cutoff, now);

            tempOscNode.type = synthStates[i].type;
            tempOscNode.frequency.setValueAtTime(noteFrequency, now);

            tempGainNode.gain.cancelScheduledValues(now);
            tempGainNode.gain.setValueAtTime(0, now);
            tempGainNode.gain.setValueAtTime(0, now);
            tempGainNode.gain.linearRampToValueAtTime(
              synthStates[i].volume,
              now + synthStates[i].attack
            );
            tempGainNode.gain.setTargetAtTime(
              synthStates[i].volume * synthStates[i].sustain,
              now + synthStates[i].attack,
              synthStates[i].decay
            );

            tempOscNodes.push(tempOscNode);
            tempGainNodes.push(tempGainNode);

            tempOscNode.start();
        }

        oscNodes.current.set(e.key, tempOscNodes);
        gainNodes.current.set(e.key, tempGainNodes);
      }
    },
    [synthStates, filterState]
  );
  //
  const handleNoteUp = useCallback(
    (e: KeyboardEvent) => {
      e.preventDefault();
      if (KEYS_TO_NOTES.has(e.key)) {
        if (oscNodes.current.has(e.key) && gainNodes.current.has(e.key)) {
          let tempOscNodes = oscNodes.current.get(e.key)!;
          let tempGainNodes = gainNodes.current.get(e.key)!;
  //
          const now = audioContext.current.currentTime;
          for (let i = 0; i < NUM_OSCS; i++) {
            tempGainNodes[i].gain.cancelScheduledValues(now)
            tempGainNodes[i].gain.setValueAtTime(tempGainNodes[i].gain.value, now);
            tempGainNodes[i].gain.linearRampToValueAtTime(0, now + synthStates[i].release);

            tempOscNodes[i].stop(now + synthStates[i].release);
          }

          oscNodes.current.delete(e.key);
          gainNodes.current.delete(e.key);
        }
      }
    },
    [synthStates]
  );
  //
  // set up event listeners
  useEffect(() => {
    window.addEventListener('keydown', handleNoteDown);
    window.addEventListener('keyup', handleNoteUp);

    // cleanup
    return () => {
      window.removeEventListener('keydown', handleNoteDown);
      window.removeEventListener('keyup', handleNoteUp);
    };
  }, [handleNoteDown, handleNoteUp]);

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
    };
  }, []);

  return (
    <>
      
      {Array.from({length: NUM_OSCS}, (_, index) => index).map((num) => (
          <Oscillator key={num} oscId={num} synthState={synthStates[num]} handleSynthState={handleSynthStates} />
      ))}
      <Filter filterState={filterState} handleFilterState={handleFilterState} />
    </>
  );
}
