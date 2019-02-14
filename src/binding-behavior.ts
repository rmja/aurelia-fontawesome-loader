import { IconName, IconPrefix } from "@fortawesome/fontawesome-common-types";

import { Loader } from "aurelia-loader";
import { getModuleId } from "./utils";

export class FontawesomeBindingBehavior {
    public static inject() { return [Loader]; }
    constructor(private loader: Loader) {
    }

    public bind(binding: any, scope: any, pro?: boolean) {
        binding.originalUpdateTarget = binding.updateTarget;
        binding.updateTarget = async (value: IconName | [IconPrefix, IconName]) => {
            const moduleId = getModuleId(value, !!pro);
            const icon = await this.loader.loadModule(moduleId);
            binding.originalUpdateTarget(icon.definition);
        };
    }

    public unbind(binding: any) {
        binding.updateTarget = binding.originalUpdateTarget;
        delete binding.originalUpdateTarget;
    }
}
