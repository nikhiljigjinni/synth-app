import { createParam } from "../utilities";

export interface MasterControlState {
    volume: number;
}

export class MasterControlView {
    volumeRangeElement: HTMLInputElement;
    constructor(parentDiv: HTMLDivElement) {
        this.createMasterControl(parentDiv);
        this.volumeRangeElement = document.getElementById('master-volume') as HTMLInputElement;
    }

    createMasterControl(parentDiv: HTMLDivElement) {
        let volumeParam = createParam("master-volume", 0, 1, 0.1, 0.5, "Volume");

        parentDiv.appendChild(volumeParam.labelElement);
        parentDiv.appendChild(volumeParam.rangeElement);
    }

    getState() {
        return {
            volume: parseFloat(this.volumeRangeElement.value),
        } as MasterControlState;
    }
}