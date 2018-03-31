const Definition = require('../Definition');
const DocComment = require('../DocComment');
const collectComments = require('../collectComments');
const TypeHandlers = require('./index');

const { create } = Object;

exports.handleObjectExpression = function(raw, def, module, innerComments) {
    const virtualProperties = [];

    def = def || create(Definition).constructor();

    def.kind = 'object';

    def.properties = raw.properties.map(property => {
        let { matchingComments, innerComments: propertyInnerComments } = collectComments(property, innerComments);

        matchingComments = matchingComments.map(comment => DocComment.parse(comment.value));

        const docDef = matchingComments.pop();
        const def = { name: property.key.name };

        virtualProperties.push(...matchingComments);

        if (property.kind === 'get') {
            def.kind = 'value';
        } else if (property.kind === 'set') {
            def.kind = 'setter';
        } else if (property.value.type === 'Identifier') {
            def.kind = 'value';
            def.type = property.value.name;
        } else {
            TypeHandlers.handle(property.value, def, module, propertyInnerComments);
        }

        const fullDef = Object.assign(def, docDef);

        return fullDef;
    });

    return def;
};
