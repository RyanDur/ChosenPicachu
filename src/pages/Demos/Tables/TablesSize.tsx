import {FC} from 'react';
import {tablesBook} from './tables-book';

export const TablesSize: FC = () =>
  <p className="paragraph">
    {`Eight parts, about ${tablesBook.minutes} minutes: five that build the live table, then three tutorials that add what the trader asked for. The build you choose on one part carries to the next.`}
  </p>;
