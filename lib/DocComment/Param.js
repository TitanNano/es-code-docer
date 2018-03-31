const names = ['param'];

exports.names = names;

/**
 * processes a param doc comment tag
 *
 * @param  {string} value             the unparsed string value
 * @param  {Definition} currentDefinition the current type definition
 * @return {void}
 */
const process = function(value, currentDefinition) {
    const regExp = /\{(.*)\} ([^\s]*)(?: (.*))?$/;
    let [, type, name, description] = value.match(regExp) || [];

    const paramDefinition = {};

    if (type) {
        paramDefinition.type = type;
    }

    if (name) {
        paramDefinition.name = name;
    }

    if (description) {
        if (description.indexOf('- ') === 0) {
            description = description.substr(2);
        }

        paramDefinition.description = description;
    }

    currentDefinition.params.push(paramDefinition);
    currentDefinition.kind = 'function';
};

exports.process = process;
