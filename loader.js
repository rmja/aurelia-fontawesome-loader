"use strict";
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var htmlparser2_1 = require("htmlparser2");
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
        // https://github.com/webpack-contrib/html-loader/blob/v0.5.5/index.js#L70-L73
        parts.push(x.substr(icon.attributeValueStart + icon.attributeValue.length + 1));
        if (icon.prefix !== "fas") {
            parts.push("icon.bind=\"['" + icon.prefix + "','" + icon.iconName + "'] & fontawesome" + (options.pro ? ":true" : "") + "\"");
        }
        else {
            parts.push("icon.bind=\"'" + icon.iconName + "' & fontawesome" + (options.pro ? ":true" : "") + "\"");
        }
        parts.push(x.substr(0, icon.attributeNameStart));
    }
    parts.reverse();
    var modules = __spreadArrays(icons.map(function (x) { return utils_1.getModuleId([x.prefix, x.iconName], options.pro === true); }));
    content = parts.join("");
    // We cannot insert right after the template tag because it may violate templates that are used with "as-element"
    // We therefore insert right before the first icon which should be fine
    var indexOfFirstIcon = content.search(/<\s*font-awesome-icon[^>]*>/);
    return content.substr(0, indexOfFirstIcon) +
        modules.map(function (x) { return "<require from=\"" + x + "\"></require>"; }).join("") +
        content.substr(indexOfFirstIcon);
}
exports.default = loader;
function findIcons(html) {
    var icons = [];
    var current = null;
    var currentAttributeName = "";
    var isIconAttributeName = function (name) { return name === "icon" || name === "icon.bind" || name === "icon.one-time"; };
    var tokenizer = new htmlparser2_1.Tokenizer({}, {
        onopentagname: function (name) {
            if (name === "font-awesome-icon") {
                current = {};
            }
        },
        onattribname: function (name) {
            if (current) {
                if (isIconAttributeName(name)) {
                    current.attributeNameStart = tokenizer.getAbsoluteIndex() - name.length;
                    current.attributeName = name;
                }
            }
            currentAttributeName = name;
        },
        onattribdata: function (value) {
            if (current && isIconAttributeName(currentAttributeName)) {
                current.attributeValueStart = tokenizer.getAbsoluteIndex() - value.length;
                current.attributeValue = value;
            }
        },
        onopentagend: function () {
            if ((current === null || current === void 0 ? void 0 : current.attributeNameStart) && current.attributeName && (current === null || current === void 0 ? void 0 : current.attributeValueStart) && (current === null || current === void 0 ? void 0 : current.attributeValue)) {
                if (current.attributeName === "icon") {
                    icons.push({
                        attributeNameStart: current.attributeNameStart,
                        attributeName: current.attributeName,
                        attributeValueStart: current.attributeValueStart,
                        attributeValue: current.attributeValue,
                        prefix: "fas",
                        iconName: current.attributeValue
                    });
                }
                else {
                    var match = /^\[\s*'([a-z]{3})'\s*,\s*'([a-z-]+)'\s*\]$/.exec(current.attributeValue);
                    if (match) {
                        icons.push({
                            attributeNameStart: current.attributeNameStart,
                            attributeName: current.attributeName,
                            attributeValueStart: current.attributeValueStart,
                            attributeValue: current.attributeValue,
                            prefix: match[1],
                            iconName: match[2],
                        });
                    }
                }
            }
            current = null;
        },
        onattribend: function () { },
        oncdata: function (data) { },
        onclosetag: function (name) { },
        oncomment: function (data) { },
        ondeclaration: function (content) { },
        onend: function () { },
        onerror: function (error) { },
        onprocessinginstruction: function (instruction) { },
        onselfclosingtag: function () { },
        ontext: function (value) { }
    });
    tokenizer.write(html);
    tokenizer.end();
    return icons;
}
//# sourceMappingURL=loader.js.map