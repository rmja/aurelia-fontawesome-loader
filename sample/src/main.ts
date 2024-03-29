import { Aurelia, PLATFORM } from "aurelia-framework";

export async function configure(aurelia: Aurelia) {
    aurelia.use
        .standardConfiguration()
        .developmentLogging()
        .plugin(PLATFORM.moduleName("aurelia-fontawesome"))
        .plugin(PLATFORM.moduleName("aurelia-fontawesome-loader"));

    await aurelia.start();
    await aurelia.setRoot(PLATFORM.moduleName("app"));
}
