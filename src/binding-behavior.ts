import { IconName, IconPrefix } from "@fortawesome/fontawesome-common-types";

import { Loader } from "aurelia-loader";
import { getModuleId } from "./utils";

const placeholderIconDefintion = {
    prefix: "none",
    iconName: "placeholder",
    icon: [1, 1, [], "", ""],
};

export class FontawesomeBindingBehavior {
    public static inject() {
        return [Loader];
    }
    constructor(private loader: Loader) {}

    public bind(binding: any, scope: any, pro?: boolean) {
        binding.originalUpdateTarget = binding.updateTarget;
        binding.updateTarget = (value: IconName | [IconPrefix, IconName]) => {
            // Serialize value before handling equality check to handle the case when the value is an array
            const serializedValue = JSON.stringify(value);

            if (serializedValue === binding.currentSerializedValue) {
                // Back out, the value has not changed
                return;
            }
            binding.currentSerializedValue = serializedValue;

            // Set a placeholder until the icon defintion has loaded
            binding.originalUpdateTarget(placeholderIconDefintion);

            const moduleId = getModuleId(value, !!pro);
            this.loader.loadModule(moduleId).then((icon) => {
                // Only set the value if the behavior is still bound
                if (binding.originalUpdateTarget) {
                    binding.originalUpdateTarget(icon.definition);
                }
            });
        };
    }

    public unbind(binding: any) {
        binding.updateTarget = binding.originalUpdateTarget;
        delete binding.originalUpdateTarget;
        delete binding.currentSerializedValue;
    }
}
