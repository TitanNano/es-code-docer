const names = ['private'];

exports.names = names;

/**
 * processes a private doc comment tag
 *
 * @param  {string} value             the unparsed string value
 * @param  {Definition} currentDefinition the current type definition
 * @return {void}
 */
const process = function(value, currentDefinition) {
    currentDefinition.private = true;
};

exports.process = process;
