import { PLATFORM } from "aurelia-pal";

export function configure(aurelia: any) {
    aurelia.globalResources(PLATFORM.moduleName("./binding-behavior"));
}
