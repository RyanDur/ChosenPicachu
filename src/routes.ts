import {route, RouteConfig} from '@react-router/dev/routes';
// React Router loads this file before Vite's aliases apply, so its imports stay relative
import {Paths} from './pages/Paths';
import {GalleryPaths} from './pages/Gallery/GalleryRouter/GalleryPaths';
import {GamePaths} from './pages/Games/GamePaths';

export default [
  route(Paths.home, 'pages/Home/route.tsx'),
  route(Paths.demos, 'pages/Demos/route.tsx'),
  route(Paths.chartTutorial, 'pages/Demos/Charts/route.tsx'),
  route(Paths.users, 'pages/Users/route.tsx'),
  route(`${Paths.artGallery}${GalleryPaths.home}`, 'pages/Gallery/route.tsx'),
  route(`${Paths.artGallery}${GalleryPaths.piece}`, 'pages/Gallery/Piece/route.tsx'),
  route(Paths.games, 'pages/Games/route.tsx'),
  route(`${Paths.games}${GamePaths.colorGame}`, 'pages/Games/ThreeInARow/route.tsx'),
  route(Paths.record, 'pages/Record/route.tsx'),
  route(Paths.practice, 'pages/Practice/route.tsx'),
  route('/development/', 'pages/Practice/Moved/route.tsx'),
  route('*', 'pages/NoRoom/route.tsx')
] satisfies RouteConfig;
