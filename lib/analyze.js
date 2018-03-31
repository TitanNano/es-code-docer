const fs = require('fs');
const path = require('path');
const acorn = require('acorn');
const TypeHandlers = require('./TypeHandlers');
const Module = require('./Module');
const collectComments = require('./collectComments');
const exists = require('./exists');

const { create } = Object;

const allModules = {
    _list: [],

    add(module) {
        module.parent = this;

        this._list.push(module);
    },

    getModule(name) {
        return this._list.find(module => module.name === name || module.name === `${name}.js` || module.name === `${name}/index.js`);
    },
};

const analyze = function(filename) {
    const fileContent = fs.readFileSync(filename, 'utf8');
    const comments = [];
    const currentModule = create(Module).constructor();
    let base = path.dirname(filename);

    while (!exists(`${base}/package.json`)) {
        base = path.dirname(base);

        if (base === '/') {
            break;
        }
    }

    currentModule.name = path.relative(base, filename);

    allModules.add(currentModule);

    const rawDeclarations = acorn.parse(fileContent, {
        ecmaVersion: 6,
        sourceType: 'module',
        onComment: comments,
    }).body;

    rawDeclarations.forEach(raw => {
        const { matchingComments, innerComments } = collectComments(raw, comments);

        matchingComments.forEach(comment => TypeHandlers.handleComment(comment, null, currentModule));

        const result = TypeHandlers.handle(raw, null, currentModule, innerComments);

        if (result) {
            if (Array.isArray(result)) {
                result.forEach(item => {
                    item.module = currentModule;
                    currentModule.definitions.add(item);
                });
            } else {
                result.module = currentModule;
                currentModule.definitions.add(result);
            }
        }
    });

    if (currentModule.lastCommentDefinition) {
        currentModule.definitions.add(currentModule.lastCommentDefinition);
        delete currentModule.lastCommentDefinition;
    }

    return currentModule;
};

module.exports = analyze;
