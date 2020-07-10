import { main } from './main';

console.log('app loaded');

main();

(function iife() {
  console.log('inside iife');
})();
