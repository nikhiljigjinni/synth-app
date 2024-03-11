import { createParam } from "../utilities";

enum FilterTypes {
    lowpass = "lowpass",
    highpass = "highpass",
    bandpass = "bandpass",
}

export interface FilterState {
    cutoff: number;
    resonance: number;
    filterType: FilterTypes;
}

export class FilterView {
    cutoffRangeElement: HTMLInputElement;
    resonanceRangeElement: HTMLInputElement;
    constructor(parentDiv: HTMLDivElement) {
        this.createFilter(parentDiv);
        this.createFilterTypeSelector(parentDiv);
        this.cutoffRangeElement = document.getElementById('filter-cutoff') as HTMLInputElement;
        this.resonanceRangeElement = document.getElementById('filter-resonance') as HTMLInputElement;
    }

    createFilterTypeSelector(parentDiv: HTMLDivElement) {
        const filterTypes = Object.keys(FilterTypes);

        let filterTypeSelectorDiv = document.createElement('div');
        filterTypeSelectorDiv.setAttribute('class', 'filter-type');

        filterTypes.forEach((key, index) => {
            let radioInput = document.createElement('input');
            radioInput.type = 'radio';
            radioInput.name = 'filter-type';
            radioInput.value = key as string;
            if (key == FilterTypes.lowpass) {
                radioInput.checked = true;
            }

            const label = document.createElement('label');
            label.setAttribute('for', key);
            label.textContent = key;

            filterTypeSelectorDiv.appendChild(label);
            filterTypeSelectorDiv.appendChild(radioInput);

        });

        parentDiv?.appendChild(filterTypeSelectorDiv);
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
        let filterType = document.querySelector('input[type="radio"][name="filter-type"]:checked') as HTMLInputElement;

        return {
            filterType: filterType.value,
            cutoff: parseFloat(this.cutoffRangeElement.value),
            resonance: parseFloat(this.resonanceRangeElement.value)
        } as FilterState;
    }
}