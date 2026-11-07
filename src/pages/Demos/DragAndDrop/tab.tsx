import {FC} from 'react';
import {EagerHideAnimatedList} from './EagerHideAnimatedList';
import {EagerHideStaticList} from './EagerHideStaticList';
import {EagerKeepAnimatedList} from './EagerKeepAnimatedList';
import {EagerKeepStaticList} from './EagerKeepStaticList';
import {LazyHideAnimatedList} from './LazyHideAnimatedList';
import {LazyHideStaticList} from './LazyHideStaticList';
import {LazyKeepAnimatedList} from './LazyKeepAnimatedList';
import {LazyKeepStaticList} from './LazyKeepStaticList';
import {ListTutorials} from './Tutorials';
import {DragSortIntroduction} from './Introduction';
import {useControls} from '../Controls';

const lists = {
  eager: {
    keep: {animated: EagerKeepAnimatedList, static: EagerKeepStaticList},
    hide: {animated: EagerHideAnimatedList, static: EagerHideStaticList}
  },
  lazy: {
    keep: {animated: LazyKeepAnimatedList, static: LazyKeepStaticList},
    hide: {animated: LazyHideAnimatedList, static: LazyHideStaticList}
  }
};

const DragSortTab: FC = () => {
  const {pace, origin, motion} =
    useControls();
  const List = lists[pace][origin][motion];

  return <>
    <DragSortIntroduction/>
    <List list={new Set(['A', 'B', 'C'])}/>
    <ListTutorials/>
  </>;
};

export default DragSortTab;
