const Definition = require('../Definition');
const { create } = Object;

exports.handleLiteral = function(raw, def) {
    def = def || create(Definition).constructor();

    def.kind = 'value';

    if (raw.raw === 'null') {
        def.type = '?';
    } else if (['true', 'false'].indexOf(raw.raw) > -1) {
        def.type = 'boolean';
    } else if (raw.raw.search(/^'.*'$/) > -1) {
        def.type = 'string';
    } else if (!Number.isNaN(raw.value)) {
        def.type = 'number';
    } else {
        console.log('unknown literal type', raw);
    }

    return def;
};
