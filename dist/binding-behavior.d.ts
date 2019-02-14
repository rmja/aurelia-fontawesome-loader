import { Loader } from "aurelia-loader";
export declare class FontawesomeBindingBehavior {
    private loader;
    static inject(): (typeof Loader)[];
    constructor(loader: Loader);
    bind(binding: any, scope: any, pro?: boolean): void;
    unbind(binding: any): void;
}
