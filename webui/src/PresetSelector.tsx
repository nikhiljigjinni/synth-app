import React from "react"
import { Preset, SynthState} from './types';

type HandlePreset = (e: React.ChangeEvent<HTMLSelectElement>) => void;

export default function PresetSelector({presets, handlePreset}: {presets: Map<string, Preset>, handlePreset: HandlePreset}) {
    return (
        <>
            <select onChange={handlePreset}>
                {Array.from(presets.keys()).map((name: string) => {
                    return <option>{name}</option>
                })}
            </select>
        </>
    )
}