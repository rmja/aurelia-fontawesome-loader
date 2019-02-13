"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const parse = require("html-loader/lib/attributesParser");
const utils_1 = require("./utils");
const loader_utils_1 = require("loader-utils");
function loader(content) {
    this.cacheable && this.cacheable();
    const options = loader_utils_1.getOptions(this) || {};
    const icons = findIcons(content);
    icons.reverse();
    const parts = [content];
    for (const icon of icons) {
        const x = parts.pop();
        // https://github.com/webpack-contrib/html-loader/blob/master/index.js#L70-L73
        parts.push(x.substr(icon.token.start + icon.token.length + 1));
        if (icon.prefix !== "fas") {
            parts.push(`icon.bind="['${icon.prefix}','${icon.iconName}'] & fontawesome${options.pro ? ":true" : ""}"`);
        }
        else {
            parts.push(`icon.bind="'${icon.iconName}' & fontawesome${options.pro ? ":true" : ""}"`);
        }
        parts.push(x.substr(0, icon.attributeNameStart));
    }
    parts.reverse();
    const modules = [
        "aurelia-fontawesome-loader/dist/binding-behavior",
        ...icons.map(x => utils_1.getModuleId([x.prefix, x.iconName], options.pro)),
    ];
    return parts.join("").replace(/\<template([^>]*)\>/, `<template$1>${modules.map(x => `<require from="${x}"></require>`).join("")}`);
}
exports.default = loader;
function findIcons(html) {
    const attributes = ["icon", /*icon.*/ "bind", /*icon.*/ "one-time"];
    return parse(html, (tag, attr) => tag === "font-awesome-icon" && attributes.includes(attr))
        .map(token => {
        const attributeNameStart = html.substr(0, token.start - 1).search(/icon(|\.bind|\.one\-time)\s*=\s*$/);
        if (attributeNameStart >= 0) {
            if (html.substr(attributeNameStart).startsWith("icon.")) {
                const match = /^\[\s*'([a-z]{3})'\s*,\s*'([a-z\-]+)'\s*\]$/.exec(token.value);
                return match && {
                    attributeNameStart,
                    token,
                    prefix: match[1],
                    iconName: match[2],
                };
            }
            else {
                if (/^[a-z\-]+$/.test(token.value)) {
                    return {
                        attributeNameStart,
                        token,
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