"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const freePackages = {
    fas: "free-solid-svg-icons",
    fab: "free-brands-svg-icons",
};
const proPackages = {
    fas: "pro-solid-svg-icons",
    far: "pro-regular-svg-icons",
    fal: "pro-light-svg-icons",
    fab: "pro-brands-svg-icons",
};
function getModuleId(value, pro) {
    let prefix;
    let iconName;
    if (typeof (value) === "string") {
        prefix = "fas";
        iconName = value;
    }
    else {
        prefix = value[0] || "fas";
        iconName = value[1];
    }
    const packageName = pro ? proPackages[prefix] : freePackages[prefix];
    if (!packageName) {
        throw new Error(`Unable to determine fontawesome package for prefix '${prefix}'`);
    }
    return `@fortawesome/${packageName}/fa${toPascalCase(iconName)}`;
}
exports.getModuleId = getModuleId;
function toPascalCase(input) {
    // https://stackoverflow.com/a/4068586/963753
    return input.replace(/(\w)(\w*)/g, (g0, g1, g2) => g1.toUpperCase() + g2.toLowerCase());
}
exports.toPascalCase = toPascalCase;
function notEmpty(value) {
    return !!value;
}
exports.notEmpty = notEmpty;
//# sourceMappingURL=utils.js.map