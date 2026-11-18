import {FC} from 'react';
import {BookMap, MapEntry} from '@pages/Demos/BookMap';
import {accordionParts} from './part-pages';
import {AccordionsSize} from './AccordionsSize';

const entries: MapEntry[] = accordionParts.inOrder.map(heading =>
  ({title: accordionParts.numbered(heading), ...accordionParts.whereIs(heading)}));

export const AccordionsMap: FC = () =>
  <BookMap label="the accordions map" size={<AccordionsSize/>} entries={entries}/>;
