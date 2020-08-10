"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.configure = void 0;
var aurelia_pal_1 = require("aurelia-pal");
function configure(aurelia) {
    aurelia.globalResources(aurelia_pal_1.PLATFORM.moduleName("./binding-behavior"));
}
exports.configure = configure;
//# sourceMappingURL=index.js.map