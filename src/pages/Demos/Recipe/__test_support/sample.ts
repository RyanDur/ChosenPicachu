import {Sample} from '../sample';

export const aSample = (text: string, path = 'src/example.ts'): Sample =>
  ({text, path, url: `https://github.com/RyanDur/ChosenPicachu/blob/main/${path}`});
