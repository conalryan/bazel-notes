import 'jasmine';
import { sayIt } from './index';

describe('index tests', () => {
    it('should say hello world', () => {
        const it = sayIt();
        expect(it).toEqual('Hello world');
    });
});