import {Maybe, nothing, some} from '@ryandur/sand';
import {array} from '@components';
import {DragSortChange} from './drag-sort-change';
import {SlideStarts, slideStarts} from './slide-starts';

export type Moved = {readonly item: string; readonly position: number};

export type DragSort = {
  readonly order: readonly string[];
  readonly held: Maybe<string>;
  readonly landing: Maybe<number>;
  readonly lastMove: Maybe<Moved>;
  readonly slideStarts: SlideStarts;
  readonly gripped: Maybe<string>;
  readonly animated: boolean;
};

type Start = {readonly items: Iterable<string>; readonly animated: boolean};

const initial = ({items, animated}: Start): DragSort =>
  ({
    order: [...items],
    held: nothing(),
    landing: nothing(),
    lastMove: nothing(),
    slideStarts: {},
    gripped: nothing(),
    animated
  });

const moved = (
  sort: DragSort,
  item: string,
  to: number,
  slidesFor: (after: readonly string[]) => SlideStarts
): DragSort => {
  const order = array.moveToIndex(to, item, sort.order);
  return {
    ...sort,
    order,
    lastMove: some({item, position: to}),
    slideStarts: sort.animated ? slidesFor(order) : {}
  };
};

const crossed = (sort: DragSort, at: number, homeward: boolean): DragSort =>
  sort.held
    .map(held => moved(sort, held, at, () => slideStarts.afterCrossing(sort.order[at], homeward)))
    .orElse(sort);

const settled = (sort: DragSort): DragSort => {
  const empty: DragSort = {...sort, held: nothing(), landing: nothing(), gripped: nothing()};
  return sort.held.and(sort.landing)
    .map(([held, at]) => at === sort.order.indexOf(held)
      ? empty
      : moved(empty, held, at, after => slideStarts.afterSettle(sort.order, after)))
    .orElse(empty);
};

const stepped = (sort: DragSort, item: string, step: 1 | -1): DragSort => {
  const from = sort.order.indexOf(item);
  const to = Math.min(Math.max(from + step, 0), sort.order.length - 1);
  return to === from ? sort : moved(sort, item, to, () => slideStarts.afterKeyboardStep(sort.order, item, step));
};

const reduce = (sort: DragSort, change: DragSortChange): DragSort => {
  switch (change.type) {
    case 'lifted': return {...sort, held: some(change.item)};
    case 'released': return settled(sort);
    case 'crossed': return crossed(sort, change.at, change.homeward);
    case 'hovered': return {...sort, landing: some(change.at)};
    case 'left': return {...sort, landing: nothing()};
    case 'stepped': return stepped(sort, change.item, change.step);
    case 'slid': return {...sort, slideStarts: {}};
    case 'gripped': return {...sort, gripped: some(change.item)};
    case 'letGo': return {...sort, gripped: nothing()};
  }
};

export const dragSort = {initial, reduce};
