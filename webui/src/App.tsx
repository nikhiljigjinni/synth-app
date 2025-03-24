import React, { useCallback, useEffect, useRef, useState } from 'react';
import Oscillator from './Oscillator';
import Preset from './PresetSelector'
import { KEYS_TO_NOTES, NOTES_TO_FREQ, NUM_OSCS } from './constants';
import { SynthState} from './types';
import PresetSelector from './PresetSelector';

type GainNodeMap = Map<string, Array<GainNode>>;
type OscNodeMap = Map<string, Array<OscillatorNode>>;

export default function App() {
  const audioContext = useRef<AudioContext>(new AudioContext());
  const oscNodes = useRef<OscNodeMap>(new Map<string, Array<OscillatorNode>>());
  const gainNodes = useRef<GainNodeMap>(new Map<string, Array<GainNode>>());
  const filterNodes = useRef<Array<BiquadFilterNode>>([]);

  const [synthStates, setSynthStates] = useState<Array<SynthState>>(() => {
    const initialData: Array<SynthState> = [];
    for (let i = 0; i < NUM_OSCS; i++) {
        initialData.push(
          {
            enabled: true,
            type: 'sine',
            attack: 0,
            decay: 0,
            sustain: 0,
            release: 0,
            detune: 0,
            volume: 0.2,
            filterEnabled: true,
            cutoff: 500,
            filterType: 'lowpass'
          }
        );
    }
    return initialData;
  });

  // state handling functions
  const handleSynthStates = (
    oscId: number, e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    let value: number | BiquadFilterType | OscillatorType | boolean | null = null;
    if (e.target.name === 'type') {
        value = e.target.value as OscillatorType;
    }
    else if (e.target.name === 'filterType') {
        value = e.target.value as BiquadFilterType;
    }
    else if (e.target.name === 'enabled' || e.target.name === 'filterEnabled') {
        value = (e.target as HTMLInputElement).checked;
    }
    else {
        value = parseFloat(e.target.value);
    }

    setSynthStates(() => {
        return synthStates.map((synthState, index) => index === oscId ? {...synthState, [e.target.name]: value} : synthState);
    })
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
  
        let tempOscNodes = new Array<OscillatorNode>(NUM_OSCS);
        let tempGainNodes = new Array<GainNode>(NUM_OSCS);

        for (let i = 0; i < NUM_OSCS; i++) {
            if (!synthStates[i].enabled) {
                continue;
            }
            let tempOscNode = audioContext.current.createOscillator();
            let tempGainNode = audioContext.current.createGain();
            const now = audioContext.current.currentTime;

            if (synthStates[i].filterEnabled) {
                tempOscNode.connect(filterNodes.current[i]);
                filterNodes.current[i].connect(tempGainNode)
                tempGainNode.connect(audioContext.current.destination);
                filterNodes.current[i].frequency.cancelScheduledValues(now);
                filterNodes.current[i].type = synthStates[i].filterType;
                filterNodes.current[i].frequency.setValueAtTime(synthStates[i].cutoff, now);
            }
            else {
                tempOscNode.connect(tempGainNode);
                tempGainNode.connect(audioContext.current.destination);
            }

            tempOscNode.type = synthStates[i].type;
            tempOscNode.frequency.setValueAtTime(noteFrequency, now);
            tempOscNode.detune.setValueAtTime(synthStates[i].detune, now);

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

            tempOscNodes[i] = tempOscNode;
            tempGainNodes[i] = tempGainNode;

            tempOscNode.start();
        }

        oscNodes.current.set(e.key, tempOscNodes);
        gainNodes.current.set(e.key, tempGainNodes);
      }
    },
    [synthStates]
  );

  const handleNoteUp = useCallback(
    (e: KeyboardEvent) => {
      e.preventDefault();
      if (KEYS_TO_NOTES.has(e.key)) {
        if (oscNodes.current.has(e.key) && gainNodes.current.has(e.key)) {
          let tempOscNodes = oscNodes.current.get(e.key)!;
          let tempGainNodes = gainNodes.current.get(e.key)!;

          const now = audioContext.current.currentTime;
          
          for (let i = 0; i < NUM_OSCS; i++) {
            if (tempGainNodes[i] != null && tempOscNodes[i] != null) {
                tempGainNodes[i].gain.cancelScheduledValues(now)
                tempGainNodes[i].gain.setValueAtTime(tempGainNodes[i].gain.value, now);
                tempGainNodes[i].gain.linearRampToValueAtTime(0, now + synthStates[i].release);

                tempOscNodes[i].stop(now + synthStates[i].release);
            }
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
    let currentFilterNodes: Array<BiquadFilterNode> | null = null;
    if (filterNodes.current.length === 0) {
      for (let i = 0; i < NUM_OSCS; i++) {
          let filterNode = audioContext.current.createBiquadFilter();
          filterNodes.current.push(filterNode);
      }
      currentFilterNodes = filterNodes.current;
    }

    // cleanup
    return () => {
      if (currentFilterNodes && currentFilterNodes.length > 0) {
        for (let i = 0; i < NUM_OSCS; i++) {
            currentFilterNodes[i].disconnect();
        }
      }
    };
  }, []);

  return (
    <>
      <PresetSelector />
      {Array.from({length: NUM_OSCS}, (_, index) => index).map((num) => (
          <Oscillator key={num} oscId={num} synthState={synthStates[num]} handleSynthState={handleSynthStates} />
      ))}
    </>
  );
}
