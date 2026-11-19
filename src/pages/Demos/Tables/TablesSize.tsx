import {FC} from 'react';
import {tablesBook} from './tables-book';

export const TablesSize: FC = () =>
  <p className="paragraph">{`Eight parts, about ${tablesBook.minutes} minutes.`}</p>;
