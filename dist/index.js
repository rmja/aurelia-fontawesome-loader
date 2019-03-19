"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var aurelia_pal_1 = require("aurelia-pal");
var loader_1 = require("./loader");
function configure(aurelia) {
    aurelia.globalResources(aurelia_pal_1.PLATFORM.moduleName("./binding-behavior"));
}
exports.configure = configure;
exports.default = loader_1.default;
//# sourceMappingURL=index.js.map