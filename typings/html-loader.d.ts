declare module 'html-loader/lib/attributesParser' {
    interface Token {
        start: number;
        length: number;
        value: string;
    }

    function parse(html: string, isRelevantTagAttr: (currentTag: string, attribute: string) => boolean): Token[]
    namespace parse {}
    export = parse
}