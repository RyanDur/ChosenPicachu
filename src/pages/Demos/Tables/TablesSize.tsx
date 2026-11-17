import {FC} from 'react';
import {tablesContents} from './contents';

export const TablesSize: FC = () =>
  <p className="paragraph">
    {`Eight parts, about ${tablesContents.minutes} minutes: five that build the live table, then three tutorials that add what the trader asked for. The build you choose on one part carries to the next.`}
  </p>;
