import { Tokenizer } from "htmlparser2";

import { IconName, IconPrefix } from "@fortawesome/fontawesome-common-types";
import { getModuleId } from "./utils";

import { LoaderContext } from "webpack";

interface LoaderOptions {
    pro?: boolean;
}

export default function loader(this: LoaderContext<LoaderOptions>, content: string) {
    this.cacheable && this.cacheable();
    const options = this.getOptions() || {};
    const icons = findIcons(content);

    if (icons.length === 0) {
        return content;
    }

    icons.reverse();
    const parts = [content];

    for (const icon of icons) {
        const x = parts.pop() as string;

        // https://github.com/webpack-contrib/html-loader/blob/v0.5.5/index.js#L70-L73
        parts.push(x.substr(icon.attributeValueStart + icon.attributeValue.length + 1));
        if (icon.prefix !== "fas") {
            parts.push(`icon.bind="['${icon.prefix}','${icon.iconName}'] & fontawesome${options.pro ? ":true" : ""}"`);
        } else {
            parts.push(`icon.bind="'${icon.iconName}' & fontawesome${options.pro ? ":true" : ""}"`);
        }
        parts.push(x.substr(0, icon.attributeNameStart));
    }
    parts.reverse();

    const modules = [
        ...icons.map(x => getModuleId([x.prefix, x.iconName], options.pro === true)),
    ];

    content = parts.join("");

    // We cannot insert right after the template tag because it may violate templates that are used with "as-element"
    // We therefore insert right before the first icon which should be fine
    const indexOfFirstIcon = content.search(/<\s*font-awesome-icon[^>]*>/);

    return content.substr(0, indexOfFirstIcon) +
        modules.map(x => `<require from="${x}"></require>`).join("") +
        content.substr(indexOfFirstIcon);
}

function findIcons(html: string) {
    const icons: Icon[] = [];
    let current: Partial<Icon> | null = null;
    let currentAttributeName = "";
    const isIconAttributeName = (name: string) => name === "icon" || name === "icon.bind" || name === "icon.one-time";

    const tokenizer = new Tokenizer({}, {
        onopentagname: (name: string) => {
            if (name === "font-awesome-icon") {
                current = {};
            }
        },
        onattribname: (name: string) => {
            if (current) {
                if (isIconAttributeName(name)) {
                    current.attributeNameStart = tokenizer.getAbsoluteIndex() - name.length;
                    current.attributeName = name;
                }
            }
            currentAttributeName = name;
        },
        onattribdata: (value: string) => {
            if (current && isIconAttributeName(currentAttributeName)) {
                current.attributeValueStart = tokenizer.getAbsoluteIndex() - value.length;
                current.attributeValue = value;
            }
        },
        onopentagend: () => {
            if (current?.attributeNameStart && current.attributeName && current?.attributeValueStart && current?.attributeValue) {
                if (current.attributeName === "icon") {
                    icons.push({
                        attributeNameStart: current.attributeNameStart,
                        attributeName: current.attributeName,
                        attributeValueStart: current.attributeValueStart,
                        attributeValue: current.attributeValue,
                        prefix: "fas",
                        iconName: current.attributeValue as IconName
                    });
                }
                else {
                    const match = /^\[\s*'([a-z]{3})'\s*,\s*'([a-z-]+)'\s*\]$/.exec(current.attributeValue);
                    if (match) {
                        icons.push({
                            attributeNameStart: current.attributeNameStart,
                            attributeName: current.attributeName,
                            attributeValueStart: current.attributeValueStart,
                            attributeValue: current.attributeValue,
                            prefix: match[1] as IconPrefix,
                            iconName: match[2] as IconName,
                        });
                    }
                }
            }
            current = null;
        },

        onattribend: () => {},
        oncdata: (data: string) => {},
        onclosetag: (name: string) => {},
        oncomment: (data: string) => {},
        ondeclaration: (content: string) => {},
        onend: () => {},
        onerror: (error: Error) => {},
        onprocessinginstruction: (instruction: string) => {},
        onselfclosingtag: () => {},
        ontext: (value: string) => {}
    });

    tokenizer.write(html);
    tokenizer.end();

    return icons;
}

interface Icon {
    attributeNameStart: number;
    attributeName: string;
    attributeValueStart: number;
    attributeValue: string;
    prefix: IconPrefix;
    iconName: IconName;
}