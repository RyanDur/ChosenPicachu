import {FC} from 'react';
import {useSearchParamsObject} from '@components/search-params';
import {
  EagerHideAnimatedList,
  EagerHideStaticList,
  EagerKeepAnimatedList,
  EagerKeepStaticList,
  LazyHideAnimatedList,
  LazyHideStaticList,
  LazyKeepAnimatedList,
  LazyKeepStaticList
} from '../../DragAndDrop';
import {ListTutorials} from '../../DragAndDrop/Tutorials';
import {DragSortIntroduction} from '../../DragAndDrop/Introduction';
import {defaultDials, motionParam, originParam, paceParam} from '../../Controls';

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
    useSearchParamsObject({pace: paceParam, origin: originParam, motion: motionParam}, defaultDials);
  const List = lists[pace][origin][motion];

  return <>
    <DragSortIntroduction/>
    <List list={new Set(['A', 'B', 'C'])}/>
    <ListTutorials/>
  </>;
};

export default DragSortTab;
