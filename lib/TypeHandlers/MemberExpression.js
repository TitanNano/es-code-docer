const locateDefinition = require('../locateDefinition');
const propertyLookup = require('../propertyLookup');
const Definition = require('../Definition');

const { create } = Object;

exports.handleMemberExpression = function(raw, def) {
    def = def || create(Definition).constructor();

    def.type = propertyLookup(locateDefinition(raw.object.name), raw.property.name);

    return def;
};
