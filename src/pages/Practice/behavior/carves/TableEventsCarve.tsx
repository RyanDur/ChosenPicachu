import {FC} from 'react';
import bootSource from '@pages/Demos/Tables/Frame/boot.ts?sample';
import {Snippet, carve} from '@pages/Demos/Recipe';

export const TableEventsCarve: FC = () =>
  <Snippet label="TS" lines={carve.span(bootSource, "table.addEventListener('column-moved'", "table.addEventListener('sorted'")}/>;
