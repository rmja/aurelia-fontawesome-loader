"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const aurelia_loader_1 = require("aurelia-loader");
const utils_1 = require("./utils");
class FontawesomeBindingBehavior {
    constructor(loader) {
        this.loader = loader;
    }
    static inject() { return [aurelia_loader_1.Loader]; }
    bind(binding, scope, pro) {
        binding.originalUpdateTarget = binding.updateTarget;
        binding.updateTarget = async (value) => {
            const moduleId = utils_1.getModuleId(value, !!pro);
            const icon = await this.loader.loadModule(moduleId);
            binding.originalUpdateTarget(icon.definition);
        };
    }
    unbind(binding) {
        binding.updateTarget = binding.originalUpdateTarget;
        delete binding.originalUpdateTarget;
    }
}
exports.FontawesomeBindingBehavior = FontawesomeBindingBehavior;
//# sourceMappingURL=binding-behavior.js.map