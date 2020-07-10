// import { sayIt } from './index';
// ^^^^^^
// SyntaxError: Cannot use import statement outside a module

const { sayIt } = require('./index');

describe('index tests', () => {
    it('should say hello world', () => {
        const it = sayIt();
        expect(it).toEqual('Hello world');
    });
});