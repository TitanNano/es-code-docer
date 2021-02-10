/**
 * performs a type lookup for object properties.
 *
 * @param  {Definition} def      an object definition
 * @param  {string} property     the property name
 * @return {Definition}
 */
module.exports = function(def, property) {
    const definition = def.properties && def.properties.find(prop => prop.name === property);

    if (!definition) {
        return '?';
    }

    if (definition.type) {
        return definition.type;
    }

    return definition.toString();
};
