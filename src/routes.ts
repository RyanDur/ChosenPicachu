import {layout, route, RouteConfig} from '@react-router/dev/routes';
// React Router loads this file before Vite's aliases apply, so its imports stay relative
import {Paths} from './pages/Paths';
import {GalleryPaths} from './pages/Gallery/GalleryPaths';
import names from './pages/names.json' with {type: 'json'};

const demoTabs: Record<keyof typeof names.demos, string> = {
  accordions: 'pages/Demos/Accordions/tab.tsx',
  'z-index': 'pages/Demos/ZIndexDemo/tab.tsx',
  'drag-and-drop': 'pages/Demos/DragAndDrop/tab.tsx',
  charts: 'pages/Demos/Charts/tab.tsx',
  tables: 'pages/Demos/Tables/tab.tsx'
};

export default [
  route(Paths.home, 'pages/Home/route.tsx'),
  route(Paths.demos, 'pages/Demos/SavedTab/route.tsx'),
  layout('pages/Demos/route.tsx', [
    ...Object.entries(demoTabs).map(([topic, file]) => route(`${Paths.demos}${topic}/`, file)),
    route(`${Paths.demos}tables/:tutorial/`, demoTabs.tables, {id: 'tables-tutorial'})
  ]),
  route(Paths.chartTutorial, 'pages/Demos/Charts/route.tsx'),
  route(Paths.users, 'pages/Users/route.tsx'),
  route(`${Paths.artGallery}${GalleryPaths.home}`, 'pages/Gallery/route.tsx'),
  route(`${Paths.artGallery}${GalleryPaths.piece}`, 'pages/Gallery/Piece/route.tsx'),
  route(Paths.games, 'pages/Games/route.tsx'),
  route(Paths.record, 'pages/Record/route.tsx'),
  route(Paths.practice, 'pages/Practice/SavedTab/route.tsx', {id: 'practice'}),
  route(Paths.practiceTab, 'pages/Practice/route.tsx'),
  route(Paths.development, 'pages/Practice/SavedTab/route.tsx', {id: 'development'}),
  route('*', 'pages/NoRoom/route.tsx')
] satisfies RouteConfig;
