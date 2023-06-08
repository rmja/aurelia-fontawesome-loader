"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toPascalCase = exports.getModuleId = void 0;
// List of packages is available here: https://fontawesome.com/how-to-use/with-the-api/setup/importing-icons#packages
var freePackages = {
    fas: "free-solid-svg-icons",
    far: "free-regular-svg-icons",
    fab: "free-brands-svg-icons",
};
var proPackages = {
    fas: "pro-solid-svg-icons",
    far: "pro-regular-svg-icons",
    fab: "free-brands-svg-icons",
    fal: "pro-light-svg-icons",
    fad: "pro-duotone-svg-icons",
};
function getModuleId(value, pro) {
    var prefix;
    var iconName;
    if (typeof value === "string") {
        prefix = "fas";
        iconName = value;
    }
    else {
        prefix = value[0] || "fas";
        iconName = value[1];
    }
    var packageName = pro ? proPackages[prefix] : freePackages[prefix];
    if (!packageName) {
        throw new Error("Unable to determine fontawesome package for prefix '".concat(prefix, "'"));
    }
    return "@fortawesome/".concat(packageName, "/fa").concat(toPascalCase(iconName));
}
exports.getModuleId = getModuleId;
function toPascalCase(input) {
    // https://stackoverflow.com/a/4068586/963753
    return input
        .replace(/(\w)(\w*)/g, function (g0, g1, g2) { return g1.toUpperCase() + g2.toLowerCase(); })
        .replace(/[ -]/g, "");
}
exports.toPascalCase = toPascalCase;
//# sourceMappingURL=utils.js.map