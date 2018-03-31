const DocComment = require('../DocComment');

exports.handleComment = function(rawDeclaration, def, module) {
    const definition = DocComment.parse(rawDeclaration.value);

    if (module.lastCommentDefinition) {
        module.definitions.push(module.lastCommentDefinition);
    }

    module.lastCommentDefinition = definition;
};
