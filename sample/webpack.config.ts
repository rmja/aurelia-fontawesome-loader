import { AureliaPlugin } from "aurelia-webpack-plugin";
import { Configuration } from "webpack";
import { resolve } from "path";

const config = (): Configuration => {
    return {
        devtool: "inline-source-map",
        entry: {
            "app": ["aurelia-bootstrapper"]
        },
        module: {
            rules: [
                { test: /\.ts$/, include: /src/, use: { loader: "ts-loader", options: { configFile: "tsconfig.app.json" } } },
                { test: /\.html$/, use: ["html-loader", "aurelia-webpack-plugin/html-requires-loader", "aurelia-fontawesome-loader/loader"] },
            ]
        },
        resolve: {
            extensions: [".ts", ".js"],
            modules: ["src", resolve(__dirname, "node_modules")],
            symlinks: false
        },
        plugins: [
            new AureliaPlugin({
                noHtmlLoader: true
            })
        ]
    };
};

export default config;