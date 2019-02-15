"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var parse = require("html-loader/lib/attributesParser");
var utils_1 = require("./utils");
var loader_utils_1 = require("loader-utils");
function loader(content) {
    this.cacheable && this.cacheable();
    var options = loader_utils_1.getOptions(this) || {};
    var icons = findIcons(content);
    if (icons.length === 0) {
        return content;
    }
    icons.reverse();
    var parts = [content];
    for (var _i = 0, icons_1 = icons; _i < icons_1.length; _i++) {
        var icon = icons_1[_i];
        var x = parts.pop();
        // https://github.com/webpack-contrib/html-loader/blob/master/index.js#L70-L73
        parts.push(x.substr(icon.token.start + icon.token.length + 1));
        if (icon.prefix !== "fas") {
            parts.push("icon.bind=\"['" + icon.prefix + "','" + icon.iconName + "'] & fontawesome" + (options.pro ? ":true" : "") + "\"");
        }
        else {
            parts.push("icon.bind=\"'" + icon.iconName + "' & fontawesome" + (options.pro ? ":true" : "") + "\"");
        }
        parts.push(x.substr(0, icon.attributeNameStart));
    }
    parts.reverse();
    var modules = [
        "aurelia-fontawesome-loader/dist/binding-behavior"
    ].concat(icons.map(function (x) { return utils_1.getModuleId([x.prefix, x.iconName], options.pro); }));
    content = parts.join("");
    // We cannot insert right after the template tag because it may violate templates that are used with "as-element"
    // We therefore insert right before the first icon which should be fine
    var indexOfFirstIcon = content.search(/<\s*font\-awesome\-icon[^>]*>/);
    return content.substr(0, indexOfFirstIcon) +
        modules.map(function (x) { return "<require from=\"" + x + "\"></require>"; }).join("") +
        content.substr(indexOfFirstIcon);
}
exports.default = loader;
function findIcons(html) {
    var attributes = ["icon", /*icon.*/ "bind", /*icon.*/ "one-time"];
    return parse(html, function (tag, attr) { return tag === "font-awesome-icon" && attributes.includes(attr); })
        .map(function (token) {
        var attributeNameStart = html.substr(0, token.start - 1).search(/icon(|\.bind|\.one\-time)\s*=\s*$/);
        if (attributeNameStart >= 0) {
            if (html.substr(attributeNameStart).startsWith("icon.")) {
                var match = /^\[\s*'([a-z]{3})'\s*,\s*'([a-z\-]+)'\s*\]$/.exec(token.value);
                return match && {
                    attributeNameStart: attributeNameStart,
                    token: token,
                    prefix: match[1],
                    iconName: match[2],
                };
            }
            else {
                if (/^[a-z\-]+$/.test(token.value)) {
                    return {
                        attributeNameStart: attributeNameStart,
                        token: token,
                        prefix: "fas",
                        iconName: token.value,
                    };
                }
            }
        }
    })
        .filter(utils_1.notEmpty);
}
//# sourceMappingURL=loader.js.map