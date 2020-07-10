
export const greet = (lang: string): string => {
  let g = '';
  switch(lang) {
    case 'en-US':
      g = 'Howdy partner';
      break;
    case 'en-GB':
      g = 'Hello govna';
      break;
    default:
      g = 'Hello';
      break;
  }
  return g;
}

