"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var freePackages = {
    fas: "free-solid-svg-icons",
    far: "free-regular-svg-icons",
    fab: "free-brands-svg-icons",
};
var proPackages = {
    fas: "pro-solid-svg-icons",
    far: "pro-regular-svg-icons",
    fal: "pro-light-svg-icons",
    fab: "pro-brands-svg-icons",
    fad: "pro-duotone-svg-icons",
};
function getModuleId(value, pro) {
    var prefix;
    var iconName;
    if (typeof (value) === "string") {
        prefix = "fas";
        iconName = value;
    }
    else {
        prefix = value[0] || "fas";
        iconName = value[1];
    }
    var packageName = pro ? proPackages[prefix] : freePackages[prefix];
    if (!packageName) {
        throw new Error("Unable to determine fontawesome package for prefix '" + prefix + "'");
    }
    return "@fortawesome/" + packageName + "/fa" + toPascalCase(iconName);
}
exports.getModuleId = getModuleId;
function toPascalCase(input) {
    // https://stackoverflow.com/a/4068586/963753
    return input.replace(/(\w)(\w*)/g, function (g0, g1, g2) { return g1.toUpperCase() + g2.toLowerCase(); }).replace(/[ -]/g, "");
}
exports.toPascalCase = toPascalCase;
function notEmpty(value) {
    return !!value;
}
exports.notEmpty = notEmpty;
//# sourceMappingURL=utils.js.map