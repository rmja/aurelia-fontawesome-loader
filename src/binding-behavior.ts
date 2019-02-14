import { IconName, IconPrefix } from "@fortawesome/fontawesome-common-types";

import { Loader } from "aurelia-loader";
import { getModuleId } from "./utils";

const placeholderIconDefintion = {
    prefix: "none",
    iconName: "placeholder",
    icon: [1, 1, [], "", ""],
};

export class FontawesomeBindingBehavior {
    public static inject() { return [Loader]; }
    constructor(private loader: Loader) {
    }

    public bind(binding: any, scope: any, pro?: boolean) {
        binding.originalUpdateTarget = binding.updateTarget;
        binding.updateTarget = async (value: IconName | [IconPrefix, IconName]) => {
            binding.originalUpdateTarget(placeholderIconDefintion);
            const moduleId = getModuleId(value, !!pro);
            const icon = await this.loader.loadModule(moduleId);
            if (binding.originalUpdateTarget) {
                binding.originalUpdateTarget(icon.definition);
            }
        };
    }

    public unbind(binding: any) {
        binding.updateTarget = binding.originalUpdateTarget;
        delete binding.originalUpdateTarget;
    }
}
