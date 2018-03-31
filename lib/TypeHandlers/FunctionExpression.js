const Definition = require('../Definition');
const TypesHander = require('./index');

const { create } = Object;

exports.handleFunctionExpression = function(raw, def, module, innerComments) {
    def = def || create(Definition).constructor();

    def.params = raw.params.map(param => {
        if (param.type === 'RestElement') {
            return { name: `...${param.argument.name}` };
        }

        if (param.type === 'AssignmentPattern') {
            return { name: param.left.name, type: TypesHander.handle(param.right, null, module, innerComments)};
        }

        return { name: param.name };
    });

    def.kind = 'function';

    return def;
};
