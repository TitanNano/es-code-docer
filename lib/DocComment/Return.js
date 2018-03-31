
exports.names = ['return', 'returns'];

exports.process = function(value, currentDefinition) {
    const regExp = /\{([^{}]*)\}(?: (.*))?$/;
    const [, type, description] = value.match(regExp) || [];

    currentDefinition.return = { type, description };
};
