import {FC} from 'react';
import actionsSource from '@components/DragSortableTable/model/actions.ts?sample';
import {Snippet, lines, carve} from '@pages/Demos/Recipe';

export const WalksCarve: FC = () => <Snippet label="TS" lines={[
  ...carve.unit(actionsSource, 'const columnWalkedTo = '),
  lines.aside('// …'),
  ...carve.unit(actionsSource, 'const rowWalkedTo = ')
]}/>;
