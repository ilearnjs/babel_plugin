module.exports = function ({ types: t }) {
    return {
        visitor: {
            VariableDeclarator(path) {
                const init = path.node.init;
                
                if (!t.isMemberExpression(init)) {
                    return;
                }
                
                if (
                    !t.isIdentifier(init.object) ||
                    init.object.name !== 'console'
                ) {
                    return;
                }

                if (
                    !t.isIdentifier(init.property) ||
                    init.property.name !== 'log'
                ) {
                    return;
                }

                const func = getEmptyFunction(t);
                path.node.init = func;
            },
            CallExpression(path) {
                const callee = path.node.callee;

                if (!t.isMemberExpression(callee)) {
                    return;
                }

                if (
                    !isSimpleCall(callee, t) &&
                    !isCallOrApplyOrBindCall(callee, t)
                ) {
                    return;
                }

                if (
                    (
                        t.isVariableDeclarator(path.parent) &&
                        path.parent.init === path.node
                    ) ||
                    t.isCallExpression(path.parent)
                ) {
                    const func = getEmptyFunction(t);
                    path.replaceWith(func);
                } else {
                    path.remove();
                }
            }
        }
    }


    function getEmptyFunction(t) {
        return t.functionExpression(null, [], t.blockStatement([]));
    }

    function isSimpleCall(callee, t) {
        if (
            !t.isIdentifier(callee.object) ||
            callee.object.name !== 'console'
        ) {
            return false;
        }

        if (
            !t.isIdentifier(callee.property) ||
            callee.property.name !== 'log'
        ) {
            return false;
        }

        return true;
    }

    function isCallOrApplyOrBindCall(callee, t) {
        if (
            !t.isMemberExpression(callee.object) ||
            !t.isIdentifier(callee.object.object) ||
            callee.object.object.name !== 'console'
        ) {
            return false;
        }

        if (
            !t.isIdentifier(callee.object.property) ||
            callee.object.property.name !== 'log'
        ) {
            return false;
        }

        if (
            !t.isIdentifier(callee.property) ||
            !['call', 'apply', 'bind'].includes(callee.property.name)
        ) {
            return false;
        }

        return true;
    }
}