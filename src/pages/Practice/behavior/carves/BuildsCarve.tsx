import {FC} from 'react';
import useDragSortableSource from '@components/DragSortableTable/useDragSortable.ts?sample';
import lazyBuildSource from '@pages/Demos/Tables/Frame/builds/Lazy.ts?sample';
import {carve, Snippet} from '@pages/Demos/Recipe';

const reactHand = 'const [hand] = useState(() => tableStore());';
const plainHand = 'const hand = tableStore();';

export const BuildsCarve: FC = () => <>
  <Snippet label="TS" lines={carve.between(useDragSortableSource, reactHand, reactHand)}/>
  <Snippet label="TS" lines={carve.between(lazyBuildSource, plainHand, plainHand)}/>
</>;
