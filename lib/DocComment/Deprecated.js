const names = ['deprecated'];

exports.names = names;

const process = function(value, currentDefinition) {
    currentDefinition.deprecated = true;
    currentDefinition.description = (value && value.length > 0 ? (`${value}\n`) : '') + currentDefinition.description;
};

exports.process = process;
