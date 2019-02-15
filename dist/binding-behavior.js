"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var aurelia_loader_1 = require("aurelia-loader");
var utils_1 = require("./utils");
var placeholderIconDefintion = {
    prefix: "none",
    iconName: "placeholder",
    icon: [1, 1, [], "", ""],
};
var FontawesomeBindingBehavior = /** @class */ (function () {
    function FontawesomeBindingBehavior(loader) {
        this.loader = loader;
    }
    FontawesomeBindingBehavior.inject = function () { return [aurelia_loader_1.Loader]; };
    FontawesomeBindingBehavior.prototype.bind = function (binding, scope, pro) {
        var _this = this;
        binding.originalUpdateTarget = binding.updateTarget;
        binding.updateTarget = function (value) {
            // Serialize value before handling equality check to handle the case when the value is an array
            var serializedValue = JSON.stringify(value);
            if (serializedValue === binding.currentSerializedValue) {
                // Back out, the value has not changed
                return;
            }
            binding.currentSerializedValue = serializedValue;
            // Set a placeholder until the icon defintion has loaded
            binding.originalUpdateTarget(placeholderIconDefintion);
            var moduleId = utils_1.getModuleId(value, !!pro);
            _this.loader.loadModule(moduleId).then(function (icon) {
                // Only set the value if the behavior is still bound
                if (binding.originalUpdateTarget) {
                    binding.originalUpdateTarget(icon.definition);
                }
            });
        };
    };
    FontawesomeBindingBehavior.prototype.unbind = function (binding) {
        binding.updateTarget = binding.originalUpdateTarget;
        delete binding.originalUpdateTarget;
        delete binding.currentSerializedValue;
    };
    return FontawesomeBindingBehavior;
}());
exports.FontawesomeBindingBehavior = FontawesomeBindingBehavior;
//# sourceMappingURL=binding-behavior.js.map