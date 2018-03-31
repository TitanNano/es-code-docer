const Definition = require('../Definition');
const { create } = Object;

exports.handleArrayExpression = function(raw, def) {
    def = def || create(Definition).constructor();

    def.kind = 'value';

    if (raw.elements.length === 0) {
        def.type = 'Array';
    } else {
        console.log('unknown array type', raw);
    }

    return def;
};
