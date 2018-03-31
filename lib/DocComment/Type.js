exports.names = ['type'];

/**
 * parses the type annotiation from a doc comment.
 *
 * @param  {string} value             the unparsed type value
 * @param  {Definition} currentDefinition the definition the parsed information should be attached to
 * @return {void}
 */
exports.process = function(value, currentDefinition) {
    const regExp = /\{([^{}]*)\}/;
    const [, type] = value.match(regExp) || [];

    currentDefinition.type = type;
};
