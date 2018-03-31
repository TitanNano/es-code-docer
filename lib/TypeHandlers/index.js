const { handleComment } = require('./Comment');
const { handleVariableDeclaration } = require('./VariableDeclaration');
const { handleExportDefaultDeclaration } = require('./ExportDefaultDeclaration');
const { handleExportNamedDeclaration } = require('./ExportNamedDeclaration');
const { handleImportDeclaration } = require('./ImportDeclaration');
const { handleObjectExpression } = require('./ObjectExpression');
const { handleFunctionExpression } = require('./FunctionExpression');
const { handleArrayExpression } = require('./ArrayExpression');
const { handleLiteral } = require('./Literal');
const { handleExpressionStatement } = require('./ExpressionStatement');
const { handleBinaryExpression } = require('./BinaryExpression');
const { handleIdentifier } = require('./Identifier');
const { handleConditionalExpression } = require('./ConditionalExpression');
const { handleMemberExpression } = require('./MemberExpression');

exports.handle = function(raw, def, currentModule, innerComments) {
    if (!this[`handle${raw.type}`]) {
        console.error(`unknown declaration type ${raw.type}`, raw, currentModule.name);

        return;
    }

    return this[`handle${raw.type}`](raw, def, currentModule, innerComments);
};

exports.handleComment = handleComment;
exports.handleVariableDeclaration = handleVariableDeclaration;
exports.handleExportDefaultDeclaration = handleExportDefaultDeclaration;
exports.handleExportNamedDeclaration = handleExportNamedDeclaration;
exports.handleImportDeclaration = handleImportDeclaration;
exports.handleObjectExpression = handleObjectExpression;
exports.handleFunctionExpression = handleFunctionExpression;
exports.handleArrayExpression = handleArrayExpression;
exports.handleLiteral = handleLiteral;
exports.handleExpressionStatement = handleExpressionStatement;
exports.handleBinaryExpression = handleBinaryExpression;
exports.handleIdentifier = handleIdentifier;
exports.handleConditionalExpression = handleConditionalExpression;
exports.handleMemberExpression = handleMemberExpression;
