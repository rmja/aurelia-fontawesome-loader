"use strict";
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
var htmlparser2_1 = require("htmlparser2");
var utils_1 = require("./utils");
function loader(content) {
    this.cacheable && this.cacheable();
    var options = this.getOptions() || {};
    var pro = options.pro !== undefined;
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
        parts.push(x.substring(icon.attributeValueStart + icon.attributeValue.length + 1));
        if (icon.prefix !== "fas") {
            parts.push("icon.bind=\"['".concat(icon.prefix, "','").concat(icon.iconName, "'] & fontawesome").concat(pro ? ":true" : "", "\""));
        }
        else {
            parts.push("icon.bind=\"'".concat(icon.iconName, "' & fontawesome").concat(pro ? ":true" : "", "\""));
        }
        parts.push(x.substring(0, icon.attributeNameStart));
    }
    parts.reverse();
    var modules = __spreadArray([], icons.map(function (x) {
        return (0, utils_1.getModuleId)([x.prefix, x.iconName], pro);
    }), true);
    content = parts.join("");
    // We cannot insert right after the template tag because it may violate templates that are used with "as-element"
    // We therefore insert right before the first icon which should be fine
    var indexOfFirstIcon = content.search(/<\s*font-awesome-icon[^>]*>/);
    return (content.substring(0, indexOfFirstIcon) +
        modules.map(function (x) { return "<require from=\"".concat(x, "\"></require>"); }).join("") +
        content.substring(indexOfFirstIcon));
}
exports.default = loader;
function findIcons(html) {
    var icons = [];
    var current = null;
    var currentAttributeName = "";
    var isIconAttributeName = function (name) {
        return name === "icon" || name === "icon.bind" || name === "icon.one-time";
    };
    var tokenizer = new htmlparser2_1.Tokenizer({}, {
        onopentagname: function (start, endIndex) {
            var name = html.substring(start, endIndex);
            if (name === "font-awesome-icon") {
                current = {};
            }
        },
        onattribname: function (start, endIndex) {
            var name = html.substring(start, endIndex);
            if (current) {
                if (isIconAttributeName(name)) {
                    current.attributeNameStart = start;
                    current.attributeName = name;
                }
            }
            currentAttributeName = name;
        },
        onattribdata: function (start, endIndex) {
            if (current && isIconAttributeName(currentAttributeName)) {
                current.attributeValueStart = start;
                current.attributeValue = html.substring(start, endIndex);
            }
        },
        onopentagend: function () {
            if ((current === null || current === void 0 ? void 0 : current.attributeNameStart) &&
                current.attributeName &&
                (current === null || current === void 0 ? void 0 : current.attributeValueStart) &&
                (current === null || current === void 0 ? void 0 : current.attributeValue)) {
                if (current.attributeName === "icon") {
                    icons.push({
                        attributeNameStart: current.attributeNameStart,
                        attributeName: current.attributeName,
                        attributeValueStart: current.attributeValueStart,
                        attributeValue: current.attributeValue,
                        prefix: "fas",
                        iconName: current.attributeValue,
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
        onattribentity: function (_codepoint) { return undefined; },
        onattribend: function () { return undefined; },
        oncdata: function (_start, _endIndex, _endOffset) { return undefined; },
        onclosetag: function (_start, _endIndex) { return undefined; },
        oncomment: function (_start, _endIndex, _endOffset) { return undefined; },
        ondeclaration: function (_start, _endIndex) { return undefined; },
        onend: function () { return undefined; },
        onprocessinginstruction: function (_start, _endIndex) { return undefined; },
        onselfclosingtag: function () { return undefined; },
        ontext: function (_start, _endIndex) { return undefined; },
        ontextentity: function (_codepoint, _endIndex) { return undefined; }
    });
    tokenizer.write(html);
    tokenizer.end();
    return icons;
}
//# sourceMappingURL=loader.js.map