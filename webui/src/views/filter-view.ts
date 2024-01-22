import { createParam } from "../utilities";

export interface FilterState {
    cutoff: number;
    resonance: number;
}

export class FilterView {
    cutoffRangeElement: HTMLInputElement;
    resonanceRangeElement: HTMLInputElement;
    constructor(parentDiv: HTMLDivElement) {
        this.createFilter(parentDiv);
        this.cutoffRangeElement = document.getElementById('filter-cutoff') as HTMLInputElement;
        this.resonanceRangeElement = document.getElementById('filter-resonance') as HTMLInputElement;
    }

    createFilter(parentDiv: HTMLDivElement) {
        let cutoffParam = createParam("filter-cutoff", 100, 18500, 10, 200, "Cutoff");
        let resonanceParam = createParam("filter-resonance", 0.1, 5, 0.01, 0.5, "Resonance");

        parentDiv.appendChild(cutoffParam.labelElement);
        parentDiv.appendChild(cutoffParam.rangeElement);
        parentDiv.appendChild(resonanceParam.labelElement);
        parentDiv.appendChild(resonanceParam.rangeElement);
    }

    getState() {
        return {
            cutoff: parseFloat(this.cutoffRangeElement.value),
            resonance: parseFloat(this.resonanceRangeElement.value)
        } as FilterState;
    }
}