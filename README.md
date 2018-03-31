# ES Code Docer

[![Greenkeeper badge](https://badges.greenkeeper.io/TitanNano/es-code-docer.svg)](https://greenkeeper.io/)
[![Build Status](https://travis-ci.org/TitanNano/es-code-docer.svg?branch=master)](https://travis-ci.org/TitanNano/es-code-docer)

ES Code Docer is a modern code documentation tool for ECMAScript. 
The CLI application is designed for ECMA script modules and supports the JSDoc comment syntax.
Source Code files are parsed with the acorn ECMAScript parser and analyzed for type informations.
The identified type information will be combined with the JSDoc type annotations and then rendered
into the documentation.

## Installation
```bash
npm -g i es-code-docer 
```

## Usage
Multiple source files can be specified. For every file code docer will search for a package.json in order to deduce the project root.
Currently there are three options for rendering the documentation which are hard coded at them moment. 
The options will be exposed soon and can be changed inside the `index.js` file for the time being.

## Supported Render Outputs
ES Code Docer currently only implements a Markdown renderer, to implement additional renderers should be straight forward though.

## Supported JSDoc Tags
At the moment only the most important JSDoc tags are supported in the code docer. 

- @type
- @return(s)
- @private
- @param
- @deprecated

If not specified aliases are not supported. ES Code Docer tries to implement the JSDoc tags the way they are specified by JSDoc,
but this is not always possible. JSDoc namepaths are not supported and most likely will never be supported. This is due to the fact,
that ES Code Docer is based on the ECMAScript modules and does not implement the JSDoc module system.
