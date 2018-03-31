const Type = require('./Type');
const Param = require('./Param');
const Return = require('./Return');
const Definition = require('../Definition');
const Deprecated = require('./Deprecated');
const Private = require('./Private');

const { create } = Object;

const DocComment = {

    knownTags: [...Type.names, ...Param.names, ...Return.names, ...Deprecated.names,
        ...Private.names],

    tagDefinitions: [Type, Param, Return, Deprecated, Private],

    parse(comment) {
        const regExp = new RegExp(`^@(${this.knownTags.join('|')})(?: (.*))?`);
        const definition = create(Definition).constructor();

        comment.replace(/^( )*(\*|\*\*)/gm, '')
            .split('\n').forEach(item => {
                const [, type, value] = item.trim().match(regExp) || [];

                if (type === undefined) {
                    definition.description += `${item.trim()} `;

                    return;
                }

                const tagDefinition = this.tagDefinitions.find(tagDefinition => tagDefinition.names.indexOf(type) > -1);

                if (tagDefinition) {
                    tagDefinition.process(value, definition);
                }
            });

        definition.description = definition.description.trim();

        return definition;
    }
};

module.exports = DocComment;
