const path = require('path');
const Definition = require('../Definition');

const { create } = Object;

exports.handleImportDeclaration = function(raw, def, module) {
    const list = raw.specifiers.map(item => {
        const onTheFlyImport = item.type === 'ExportSpecifier';

        def = def || create(Definition).constructor();

        if (raw.source) {
            def.origin = path.join(path.dirname(module.name), raw.source.value);
        }

        def.kind = 'import';
        def.type = onTheFlyImport ? (item.local.name) : (item.imported ? item.imported.name : 'default');
        def.name = onTheFlyImport ? `${raw.source.value}+${item.local.name}` : item.local.name;

        return def;
    });

    return list;
};
