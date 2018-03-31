const locateDefinition = require('../locateDefinition');
const TypeHandlers = require('../TypeHandlers');

exports.handleExportDefaultDeclaration = function(raw, def, module, innerComments) {
    const definition = raw.declaration.type === 'Identifier' ?
        locateDefinition(raw.declaration.name, module) :
        TypeHandlers.handle(raw.declaration, def, module, innerComments);


    const newDefinition = !!raw.declaration;

    definition.export = 'default';

    if (!definition.name) {
        definition.name = 'default export';
    }

    return newDefinition ? definition : null;
};
