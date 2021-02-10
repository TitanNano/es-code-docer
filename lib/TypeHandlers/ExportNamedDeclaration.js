const VariableDeclaration = require('./VariableDeclaration');
const locateDefinition = require('../locateDefinition');
const TypeHandlers = require('./index');
const Definition = require('../Definition');
const { create } = Object;

exports.handleExportNamedDeclaration = function(raw, def, module, innerComments) {
    let defs = null;

    if (raw.declaration) {
        if (raw.declaration.type === 'VariableDeclaration') {
            defs = VariableDeclaration.handleVariableDeclaration(raw.declaration, null, module, innerComments);

            defs.forEach(def => def.export = def.name);
        } else {
            console.error('unknown export declaration', raw.declaration && raw.declaration.type, raw);

            return;
        }
    }

    if (raw.specifiers) {

        if (raw.source) {
            const defs = TypeHandlers.handleImportDeclaration(raw, null, module);

            defs.forEach(def => {
                module.definitions.add(def);
            });
        }


        raw.specifiers.forEach(item => {
            if (item.type === 'ExportSpecifier') {
                const defName = (raw.source) ? `${raw.source.value}+${item.local.name}` : item.local.name;
                const definition = locateDefinition(defName, module);

                if (!definition) {
                    console.error(`unable to locate definition of ${defName}!`, module.name);

                    return;
                }

                if (definition.kind === 'import') {
                    const exportDef = create(Definition).constructor();

                    exportDef.name = item.exported.name;
                    exportDef.export = item.exported.name;
                    exportDef.type = definition.name;
                    exportDef.kind = 'value';

                    defs = defs || [];
                    defs.push(exportDef);

                    return;
                }

                definition.export = item.exported.name;
            } else {
                console.error('unknown export specifier', item.type, item);
            }
        });
    }

    return defs;
};
