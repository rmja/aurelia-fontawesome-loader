import * as parse from "html-loader/lib/attributesParser";

import { IconName, IconPrefix } from "@fortawesome/fontawesome-common-types";
import { getModuleId, notEmpty } from "./utils";

import { getOptions } from "loader-utils";
import { loader } from "webpack";

export default function loader(this: loader.LoaderContext, content: string) {
    debugger;
    this.cacheable && this.cacheable();
    const options = getOptions(this) || {};
    const icons = findIcons(content);

    icons.reverse();
    const parts = [content];

    for (const icon of icons) {
        const x = parts.pop() as string;

        // https://github.com/webpack-contrib/html-loader/blob/master/index.js#L70-L73
        parts.push(x.substr(icon.token.start + icon.token.length + 1));
        if (icon.prefix !== "fas") {
            parts.push(`icon.bind="['${icon.prefix}','${icon.iconName}'] & fontawesome${options.pro ? ":true" : ""}"`);
        } else {
            parts.push(`icon.bind="'${icon.iconName}' & fontawesome${options.pro ? ":true" : ""}"`);
        }
        parts.push(x.substr(0, icon.attributeNameStart));
    }
    parts.reverse();

    const modules = [
        "aurelia-fontawesome-loader/dist/binding-behavior",
        ...icons.map(x => getModuleId([x.prefix, x.iconName], options.pro)),
    ];

    return parts.join("").replace(
        /\<template([^>]*)\>/,
        `<template$1>${modules.map(x => `<require from="${x}"></require>`).join("")}`);
}

function findIcons(html: string) {
    const attributes = ["icon", /*icon.*/"bind", /*icon.*/"one-time"];
    return parse(html, (tag, attr) => tag === "font-awesome-icon" && attributes.includes(attr))
        .map(token => {
            const attributeNameStart = html.substr(0, token.start - 1).search(/icon(|\.bind|\.one\-time)\s*=\s*$/);

            if (attributeNameStart >= 0) {
                if (html.substr(attributeNameStart).startsWith("icon.")) {
                    const match = /^\[\s*'([a-z]{3})'\s*,\s*'([a-z\-]+)'\s*\]$/.exec(token.value);
                    return match && {
                        attributeNameStart,
                        token,
                        prefix: match[1] as IconPrefix,
                        iconName: match[2] as IconName,
                    };
                } else {
                    if (/^[a-z\-]+$/.test(token.value)) {
                        return {
                            attributeNameStart,
                            token,
                            prefix: "fas" as IconPrefix,
                            iconName: token.value as IconName,
                        };
                    }
                }
            }
        })
        .filter(notEmpty);
}
