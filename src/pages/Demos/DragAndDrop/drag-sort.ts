import {Maybe, nothing, some, not} from '@ryandur/sand';
import {array} from '@components';
import {DragSortChange} from './drag-sort-change';
import {SlideStarts, slideStarts} from './slide-starts';

export type Moved = {readonly item: string; readonly position: number};

export type Held = {readonly item: string; readonly landing: Maybe<number>};

export type DragSort = {
  readonly order: readonly string[];
  readonly held: Maybe<Held>;
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
    lastMove: nothing(),
    slideStarts: {},
    gripped: nothing(),
    animated
  });

const moved = (
  sort: DragSort,
  item: string,
  to: number,
  starts: SlideStarts
): DragSort => ({
  ...sort,
  order: array.moveToIndex(to, item, sort.order),
  lastMove: some({item, position: to}),
  slideStarts: sort.animated ? {...sort.slideStarts, ...starts} : {}
});

const sliding = (sort: DragSort, item: string): boolean => not(slideStarts.of(sort.slideStarts, item).isNothing);

const crossed = (sort: DragSort, at: number, homeward: boolean): DragSort =>
  sort.held
    .map(({item}) => sliding(sort, item) || sliding(sort, sort.order[at])
      ? sort
      : moved(sort, item, at, slideStarts.afterCrossing(sort.order[at], homeward)))
    .orElse(sort);

const anySliding = (sort: DragSort, starts: SlideStarts): boolean =>
  Object.keys(starts).some(item => sliding(sort, item));

const settled = (sort: DragSort): DragSort => {
  const withNothingHeld: DragSort = {...sort, held: nothing(), gripped: nothing()};
  return sort.held
    .mBind(({item, landing}) => landing.map(at => {
      const starts = slideStarts.afterSettle(sort.order, array.moveToIndex(at, item, sort.order));
      return at === sort.order.indexOf(item) || anySliding(sort, starts)
        ? withNothingHeld
        : moved(withNothingHeld, item, at, starts);
    }))
    .orElse(withNothingHeld);
};

const stepped = (sort: DragSort, item: string, step: 1 | -1): DragSort => {
  const from = sort.order.indexOf(item);
  const to = Math.min(Math.max(from + step, 0), sort.order.length - 1);
  return to === from || sliding(sort, item) || sliding(sort, sort.order[to])
    ? sort
    : moved(sort, item, to, slideStarts.afterKeyboardStep(sort.order, item, step));
};

const reduce = (sort: DragSort, change: DragSortChange): DragSort => {
  switch (change.type) {
    case 'lifted': return {...sort, held: some({item: change.item, landing: nothing()})};
    case 'released': return settled(sort);
    case 'crossed': return crossed(sort, change.at, change.homeward);
    case 'hovered': return {...sort, held: sort.held.map(held => ({...held, landing: some(change.at)}))};
    case 'left': return {...sort, held: sort.held.map(held => ({...held, landing: nothing()}))};
    case 'stepped': return stepped(sort, change.item, change.step);
    case 'slid': return {...sort, slideStarts: slideStarts.ended(sort.slideStarts, change.item)};
    case 'gripped': return {...sort, gripped: some(change.item)};
    case 'letGo': return {...sort, gripped: nothing()};
  }
};

export const dragSort = {initial, reduce};
