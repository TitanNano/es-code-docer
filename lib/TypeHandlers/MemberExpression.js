const locateDefinition = require('../locateDefinition');
const propertyLookup = require('../propertyLookup');
const Definition = require('../Definition');

const { create } = Object;

exports.handleMemberExpression = function(raw, def, currentModule) {
    def = def || create(Definition).constructor();

    let objectDef = null;

    if (raw.object.type === 'MemberExpression') {
        objectDef = exports.handleMemberExpression(raw.object, null, currentModule);
    } else {
        objectDef = locateDefinition(raw.object.name, currentModule);
    }

    if (!objectDef) {
        def.type = '?';

        return def;
    }

    def.type = propertyLookup(objectDef, raw.property.name);

    return def;
};
