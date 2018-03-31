const Module = require('./Module');
const Definition = require('./Definition');
const { create } = Object;

const globalScope = create(Module).constructor();

globalScope.definitions.add({
    name: 'string',
    used: true,
});

globalScope.definitions.add({
    name: 'number',
    used: true,
});

globalScope.definitions.add({
    name: 'boolean',
    used: true,
});

globalScope.definitions.add({
    name: 'Object',
    used: true,
    properties: [
        { name: 'prototype', type: 'Object', __proto__: Definition, },
        { name: 'create', kind: 'function', params: [
            { name: 'prototype', type: 'Object' }
        ], return: { type: 'Object' },  __proto__: Definition, }
    ],
    __proto__: Definition,
});

module.exports = function(name, currentModule) {
    if (!currentModule) {
        currentModule = globalScope;
    }

    const def = Array.from(currentModule.definitions).find(definition => definition.name === name);

    if (!def && currentModule !== globalScope) {
        return module.exports(name);
    }

    return def;
};
