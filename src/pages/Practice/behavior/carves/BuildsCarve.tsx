import {FC} from 'react';
import useDragSortableSource from '@components/DragSortableTable/useDragSortable.ts?sample';
import lazyBuildSource from '@pages/Demos/Tables/Frame/builds/Lazy.ts?sample';
import {Snippet, carve} from '@pages/Demos/Recipe';

const reactHand = 'const [hand] = useState(() => tableStore());';
const plainHand = 'const hand = tableStore();';

export const BuildsCarve: FC = () => <>
  <Snippet label="TS" lines={carve.span(useDragSortableSource, reactHand, reactHand)}/>
  <Snippet label="TS" lines={carve.span(lazyBuildSource, plainHand, plainHand)}/>
</>;
