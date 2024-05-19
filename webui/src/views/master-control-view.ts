import { createParam } from "../utilities";

export interface MasterState {
    volume: number;
}

export class MasterView {
    volumeRangeElement: HTMLInputElement;
    constructor(parentDiv: HTMLDivElement) {
        this.createMaster(parentDiv);
        this.volumeRangeElement = document.getElementById('master-volume') as HTMLInputElement;
    }

    createMaster(parentDiv: HTMLDivElement) {
        let volumeParam = createParam("master-volume", 0, 1, 0.1, 0.5, "Volume");

        parentDiv.appendChild(volumeParam.labelElement);
        parentDiv.appendChild(volumeParam.rangeElement);
    }

    setState(state: MasterState) {
        this.volumeRangeElement.value = state.volume.toString();
    }

    getState() {
        return {
            volume: parseFloat(this.volumeRangeElement.value),
        } as MasterState;
    }
}