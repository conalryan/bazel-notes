const HELLO = 'Hello';

// export function sayIt() {
// ^^^^^^
// SyntaxError: Unexpected token 'export'

function sayIt() {
    console.log('Saying it...');
    return `${HELLO} world`;
}

exports.sayIt = sayIt;