import { PLATFORM } from "aurelia-pal";
import loader from "./loader";

export function configure(aurelia: any) {
    aurelia.globalResources(PLATFORM.moduleName("./binding-behavior"));
}

export default loader;
