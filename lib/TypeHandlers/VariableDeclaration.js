const TypeHandlers = require('./index');
const propertyLookup = require('../propertyLookup');
const locateDefinition = require('../locateDefinition');
const Definition = require('../Definition');


exports.handleVariableDeclaration = function(raw, def, module, innerComments) {
    const result = [];

    raw.declarations.forEach(declaration => {
        const def = ({ declaration: raw.kind, name: declaration.id.name, __proto__: Definition }).constructor();

        TypeHandlers.handle(declaration.init, def, module, innerComments);

        if (declaration.id.type === 'ObjectPattern') {
            declaration.id.properties.forEach(extract => {
                const type = propertyLookup(locateDefinition(def.type), extract.key.name);

                result.push({ name: extract.value.name, type, kind: 'value' });
            });

            return;
        }

        if (module.lastCommentDefinition) {
            Object.keys(module.lastCommentDefinition).forEach(key => {
                if (Array.isArray(module.lastCommentDefinition[key])) {
                    module.lastCommentDefinition[key].forEach((item, i) => {
                        Object.keys(item).forEach((itemKey) => {
                            if (!def[key]) {
                                def[key] = [];
                            }

                            if (!def[key][i]) {
                                def[key][i] = {};
                            }

                            def[key][i][itemKey] = item[itemKey];
                        });
                    });

                    return;
                }

                def[key] = module.lastCommentDefinition[key];
            });

            module.lastCommentDefinition = null;
        }

        result.push(def);
    });

    return result;
};
