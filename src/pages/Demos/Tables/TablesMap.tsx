import {FC} from 'react';
import {BookMap} from '@pages/Demos/BookMap';
import {tablesBook} from './tables-book';
import {TablesSize} from './TablesSize';

export const TablesMap: FC = () =>
  <BookMap label="the tables map" size={<TablesSize/>} entries={tablesBook.signposts}/>;
