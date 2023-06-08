import { LoaderContext } from "webpack";
import { Tokenizer } from "htmlparser2";
import { getModuleId } from "./utils";

interface LoaderOptions {
    pro?: "";
}

export default function loader(
    this: LoaderContext<LoaderOptions>,
    content: string
) {
    this.cacheable && this.cacheable();
    const options = this.getOptions() || {};
    const pro = options.pro !== undefined;
    const icons = findIcons(content);

    if (icons.length === 0) {
        return content;
    }

    icons.reverse();
    const parts = [content];

    for (const icon of icons) {
        const x = parts.pop() as string;

        // https://github.com/webpack-contrib/html-loader/blob/v0.5.5/index.js#L70-L73
        parts.push(
            x.substring(icon.attributeValueStart + icon.attributeValue.length + 1)
        );
        if (icon.prefix !== "fas") {
            parts.push(
                `icon.bind="['${icon.prefix}','${
                    icon.iconName
                }'] & fontawesome${pro ? ":true" : ""}"`
            );
        } else {
            parts.push(
                `icon.bind="'${icon.iconName}' & fontawesome${
                    pro ? ":true" : ""
                }"`
            );
        }
        parts.push(x.substring(0, icon.attributeNameStart));
    }
    parts.reverse();

    const modules = [
        ...icons.map((x) =>
            getModuleId([x.prefix, x.iconName], pro)
        ),
    ];

    content = parts.join("");

    // We cannot insert right after the template tag because it may violate templates that are used with "as-element"
    // We therefore insert right before the first icon which should be fine
    const indexOfFirstIcon = content.search(/<\s*font-awesome-icon[^>]*>/);

    return (
        content.substring(0, indexOfFirstIcon) +
        modules.map((x) => `<require from="${x}"></require>`).join("") +
        content.substring(indexOfFirstIcon)
    );
}

function findIcons(html: string) {
    const icons: Icon[] = [];
    let current: Partial<Icon> | null = null;
    let currentAttributeName = "";
    const isIconAttributeName = (name: string) =>
        name === "icon" || name === "icon.bind" || name === "icon.one-time";

    const tokenizer = new Tokenizer(
        {},
        {
            onopentagname: (start: number, endIndex: number) => {
                const name = html.substring(start, endIndex);
                if (name === "font-awesome-icon") {
                    current = {};
                }
            },
            onattribname: (start: number, endIndex: number) => {
                const name = html.substring(start, endIndex);
                if (current) {
                    if (isIconAttributeName(name)) {
                        current.attributeNameStart = start;
                        current.attributeName = name;
                    }
                }
                currentAttributeName = name;
            },
            onattribdata: (start: number, endIndex: number) => {
                if (current && isIconAttributeName(currentAttributeName)) {
                    current.attributeValueStart = start;
                    current.attributeValue = html.substring(start, endIndex);
                }
            },
            onopentagend: () => {
                if (
                    current?.attributeNameStart &&
                    current.attributeName &&
                    current?.attributeValueStart &&
                    current?.attributeValue
                ) {
                    if (current.attributeName === "icon") {
                        icons.push({
                            attributeNameStart: current.attributeNameStart,
                            attributeName: current.attributeName,
                            attributeValueStart: current.attributeValueStart,
                            attributeValue: current.attributeValue,
                            prefix: "fas",
                            iconName: current.attributeValue as IconName,
                        });
                    } else {
                        const match =
                            /^\[\s*'([a-z]{3})'\s*,\s*'([a-z-]+)'\s*\]$/.exec(
                                current.attributeValue
                            );
                        if (match) {
                            icons.push({
                                attributeNameStart: current.attributeNameStart,
                                attributeName: current.attributeName,
                                attributeValueStart:
                                    current.attributeValueStart,
                                attributeValue: current.attributeValue,
                                prefix: match[1] as IconPrefix,
                                iconName: match[2] as IconName,
                            });
                        }
                    }
                }
                current = null;
            },

            onattribentity: (_codepoint: number) => undefined,
            onattribend: () => undefined,
            oncdata: (_start: number, _endIndex: number, _endOffset: number) => undefined,
            onclosetag: (_start: number, _endIndex: number) => undefined,
            oncomment: (_start: number, _endIndex: number, _endOffset: number) => undefined,
            ondeclaration: (_start: number, _endIndex: number) => undefined,
            onend: () => undefined,
            onprocessinginstruction: (_start: number, _endIndex: number) => undefined,
            onselfclosingtag: () => undefined,
            ontext: (_start: number, _endIndex: number) => undefined,
            ontextentity: (_codepoint: number, _endIndex: number) => undefined
        }
    );

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
