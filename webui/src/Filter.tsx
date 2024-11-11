import React from "react";
import { FilterState } from "./types";

type HandleFilterState = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;

export default function Filter({filterState, handleFilterState}: {filterState: FilterState, handleFilterState: HandleFilterState}) {

    return (
        <>
            <label htmlFor="cutoff">Cutoff</label> 
            <input type="range" name="cutoff" min="20" max="3000" step="20" value={filterState.cutoff} onChange={handleFilterState}/>

            <select value={filterState.type} onChange={handleFilterState}>
                <option value="lowpass">Lowpass</option>
                <option value="highpass">Highpass</option>
                <option value="bandpass">Bandpass</option>
            </select>
        </>
    );
}
