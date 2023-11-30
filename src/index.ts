import { domReady } from "./utilities";
import { SynthController } from "./synth-controller";
import { SynthView } from "./synth-view";
import './styles.css'

let synthView = undefined;
let synthController = undefined;

domReady(() => {

  synthView = new SynthView();
  synthController = new SynthController(synthView);

}); 
