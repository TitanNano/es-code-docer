const locateDefinition = require('./locateDefinition');

const linkDefinition = function(definition) {
    if (definition.kind === 'import') {
        return;
    }

    if (definition.type) {
        const typeDef = locateDefinition(definition.type, definition.module);

        if (!typeDef) {
            return;
        }

        typeDef.used = true;
    }

    if (definition.params) {
        definition.params.forEach(linkDefinition);
    }

    if (definition.properties) {
        definition.properties.forEach(linkDefinition);
    }

    if (definition.return) {
        linkDefinition(definition.return);
    }
};

module.exports = function(modules) {
    modules.forEach(module => {
        Array.from(module.definitions).forEach(linkDefinition);
    });
};
