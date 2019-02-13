# aurelia-fontawesome-loader
A webpack loader for aurelia-fontawesome

## Why?
The loader makes it super easy to use the [aurelia-fontawesome](https://github.com/jmzagorski/aurelia-fontawesome) component with webpack.
When the loader is configured properly you can simply write the following in your aurelia views:

```
<font-awesome-icon icon="coffee"></font-awesome-icon>
```
_or_
```
<font-awesome-icon icon.bind="['fab', 'microsoft']"></font-awesome-icon>
```

The `coffee` icon is automatically added as a dependency to the view and the icon is loaded when needed.
This ensures that the final produced bundle/chunk only contains the icons that are actually used.
Moreover, it also reduces the hassle of adding the icons one-by-one to the [font-awesome library](https://fontawesome.com/how-to-use/on-the-web/advanced/svg-javascript-core).


## Installation
Install the loader with npm
```
$ npm i --save-dev aurelia-fontawesome-loader
```

## How it Works
The loader transforms the html files with the following changes:
* It adds a `<require from="..."></require>` for each icon it detects in `<font-awesome-icon icon="..."></font-awesome-icon>` to ensure that the icon becomes a dependency to the view.
* It rewrites the `icon` property such that the [fontawesome binding behavior](src/binding-behavior.ts) is invoked which ensures that the icon is loaded before it is passed on to the icon property on the element.
An example is `<font-awesome-icon icon="coffee"></font-awesome-icon>` which is rewritten to `<font-awesome-icon icon.bind="'coffee' & fontawesome"></font-awesome-icon>`
See the sample app [here](/sample/src/app.html) for more examples on how the loader works. 

## Configuration
You can see the sample webpack configuration using the loader [here](sample/webpack.config.ts).
Two things needs to be configured for the loader to work propertly.
1) The loader must be used for html files. It needs to run _before_ the `html-requires-loader` which is included by default in the [aurelia-webpack-plugin](https://github.com/aurelia/webpack-plugin).
```
module: {
  rules: [
    {
      test: /\.html$/,
      use: [
        // The order of the loaders are important
        "html-loader",
        "aurelia-webpack-plugin/html-requires-loader",
        "aurelia-fontawesome-loader"
      ]
    }
  ]
}
```
The loader resolves to the free icon set by default - you can use the loader with the `pro` option if you have that license.
This is easiest done by setting the loader to `"aurelia-fontawesome-loader?pro"`.

2) Tell the aurelia-webpack-plugin that it should _not_ automatically insert the `html-requires-loader`:
```
plugins: [
  new AureliaPlugin({
    noHtmlLoader: true
  })
]
```

