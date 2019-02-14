"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const aurelia_loader_1 = require("aurelia-loader");
const utils_1 = require("./utils");
const placeholderIconDefintion = {
    prefix: "none",
    iconName: "placeholder",
    icon: [1, 1, [], "", ""],
};
class FontawesomeBindingBehavior {
    constructor(loader) {
        this.loader = loader;
    }
    static inject() { return [aurelia_loader_1.Loader]; }
    bind(binding, scope, pro) {
        binding.originalUpdateTarget = binding.updateTarget;
        binding.updateTarget = async (value) => {
            // Serialize value before handling equality check to handle the case when the value is an array
            const serializedValue = JSON.stringify(value);
            if (serializedValue === binding.currentSerializedValue) {
                // Back out, the value has not changed
                return;
            }
            binding.currentSerializedValue = serializedValue;
            // Set a placeholder until the icon defintion has loaded
            binding.originalUpdateTarget(placeholderIconDefintion);
            const moduleId = utils_1.getModuleId(value, !!pro);
            const icon = await this.loader.loadModule(moduleId);
            // Only set the value if the behavior is still bound
            if (binding.originalUpdateTarget) {
                binding.originalUpdateTarget(icon.definition);
            }
        };
    }
    unbind(binding) {
        binding.updateTarget = binding.originalUpdateTarget;
        delete binding.originalUpdateTarget;
        delete binding.currentSerializedValue;
    }
}
exports.FontawesomeBindingBehavior = FontawesomeBindingBehavior;
//# sourceMappingURL=binding-behavior.js.map