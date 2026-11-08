import {FC} from 'react';
import {LoaderFunction, NonIndexRouteObject} from 'react-router';
import {Paths} from '@navigation';
import names from '@navigation/names.json';
import {GalleryPaths} from '@pages/Gallery';
import {ErrorBoundary, HydrateFallback, Root} from './root';

export type RoomModule = {readonly Room: FC; readonly ErrorBoundary?: FC; readonly loader?: LoaderFunction};

type Opened = Pick<NonIndexRouteObject, 'lazy' | 'Component' | 'ErrorBoundary' | 'loader'>;

export type Opener = (file: string) => Opened;

const modules = import.meta.glob<RoomModule>('./pages/**/{route,tab}.tsx');

export const lazily = (opened: (file: string) => void = () => undefined): Opener => file => ({
  lazy: async () => {
    opened(file);
    const {Room, ErrorBoundary, loader} = await modules[`./${file}`]();
    return {Component: Room, ErrorBoundary, loader};
  }
});

const demoTabs: Record<keyof typeof names.demos, string> = {
  accordions: 'pages/Demos/Accordions/tab.tsx',
  'z-index': 'pages/Demos/ZIndexDemo/tab.tsx',
  'drag-and-drop': 'pages/Demos/DragAndDrop/tab.tsx',
  charts: 'pages/Demos/Charts/tab.tsx',
  tables: 'pages/Demos/Tables/tab.tsx'
};

export const siteOpenedBy = (open: Opener): NonIndexRouteObject => ({
  id: 'root',
  path: '/',
  Component: Root,
  ErrorBoundary,
  HydrateFallback,
  children: [
    {path: Paths.home, ...open('pages/Home/route.tsx')},
    {path: Paths.demos, ...open('pages/Demos/SavedTab/route.tsx')},
    {
      ...open('pages/Demos/route.tsx'),
      children: [
        ...Object.entries(demoTabs).map(([topic, file]) => ({path: `${Paths.demos}${topic}/`, ...open(file)})),
        {path: `${Paths.demos}tables/:tutorial/`, ...open(demoTabs.tables)}
      ]
    },
    {path: Paths.chartTutorial, ...open('pages/Demos/Charts/route.tsx')},
    {path: Paths.users, ...open('pages/Users/route.tsx')},
    {path: `${Paths.artGallery}${GalleryPaths.home}`, ...open('pages/Gallery/route.tsx')},
    {path: `${Paths.artGallery}${GalleryPaths.piece}`, ...open('pages/Gallery/Piece/route.tsx')},
    {path: Paths.games, ...open('pages/Games/route.tsx')},
    {path: Paths.record, ...open('pages/Record/route.tsx')},
    {path: Paths.practice, ...open('pages/Practice/SavedTab/route.tsx')},
    {path: Paths.practiceTab, ...open('pages/Practice/route.tsx')},
    {path: Paths.development, ...open('pages/Practice/SavedTab/route.tsx')},
    {path: '*', ...open('pages/NoRoom/route.tsx')}
  ]
});
