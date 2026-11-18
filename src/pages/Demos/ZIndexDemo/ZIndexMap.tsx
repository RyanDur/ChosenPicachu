import {FC} from 'react';
import {BookMap, MapEntry} from '@pages/Demos/BookMap';
import {zIndexParts} from './part-pages';
import {ZIndexSize} from './ZIndexSize';

const entries: MapEntry[] = zIndexParts.inOrder.map(part =>
  ({title: zIndexParts.numbered(part), to: zIndexParts.addressOf(part)}));

export const ZIndexMap: FC = () =>
  <BookMap label="the z-index map" size={<ZIndexSize/>} entries={entries}/>;
