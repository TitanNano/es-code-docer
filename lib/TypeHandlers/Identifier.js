const Definition = require('../Definition');
const { create } = Object;

exports.handleIdentifier = function(raw, def) {
    def = def || create(Definition).constructor();

    def.kind = 'value';
    def.type = raw.name;

    return def;
};
