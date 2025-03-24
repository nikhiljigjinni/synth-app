import React, { useEffect, useState } from 'react'
import { Preset } from './types';

export default function PresetSelector() {
    const [presets, setPresets] = useState<Preset[]>([]);

    useEffect(() => {
        const fetchPresets = async () => {
            const response = await fetch(`http://localhost:8000/presets/`);
            const response_presets = await response.json();
            setPresets(response_presets);
        }

        fetchPresets();
    }, [])

    return (
        <select>
            <option>Select an option</option>
            {presets.map((preset) => (
                <option>{preset.name}</option>
            ))}
        </select>
    );
}