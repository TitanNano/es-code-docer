const TypeHandlers = require('./index');
const Definition = require('../Definition');
const { create } = Object;

exports.handleConditionalExpression = function(raw, def, module) {
    def = def || create(Definition).constructor();

    const typeA = TypeHandlers.handle(raw.consequent, null, module);
    const typeB = TypeHandlers.handle(raw.alternate, null, module);

    def.type = `${typeA}|${typeB}`;

    return def;
};
