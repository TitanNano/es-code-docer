module.exports = function(node, commentList) {
    const matchingComments = [];
    const innerComments = [];

    while (commentList.length) {
        const comment = commentList[0];

        if (comment.type === 'Line') {
            commentList.shift();

            continue;
        }

        if (comment.start > node.end) {
            break;
        }

        if (comment.start > node.start && comment.end < node.end) {
            innerComments.push(comment);
            commentList.shift();

            continue;
        }

        matchingComments.push(comment);
        commentList.shift();
    }

    return { matchingComments, innerComments };
};
