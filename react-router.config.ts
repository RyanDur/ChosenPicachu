import type {Config} from '@react-router/dev/config';
// React Router loads this file before Vite's aliases apply, so its imports stay relative
import names from './src/pages/names.json' with {type: 'json'};
import {Paths} from './src/pages/Paths';

const fixed = Object.values(Paths).filter(path => path.startsWith('/') && !path.includes(':'));
const tabsOf = (page: string, listings: object): string[] => Object.keys(listings).map(tab => `${page}${tab}/`);

export default {
  appDirectory: 'src',
  basename: '/ChosenPicachu/',
  ssr: false,
  prerender: [...fixed, ...tabsOf(Paths.demos, names.demos), ...tabsOf(`${Paths.demos}charts/`, names.charts), ...tabsOf(Paths.practice, names.practice)],
  future: {
    v8_middleware: true,
    v8_passThroughRequests: true,
    v8_trailingSlashAwareDataRequests: true
  }
} satisfies Config;
