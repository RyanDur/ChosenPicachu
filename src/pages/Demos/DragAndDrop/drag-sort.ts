import {Maybe, not, nothing, some} from '@ryandur/sand';
import {array} from '@components';
import {DragSortChange} from './drag-sort-change';
import {Places, SlideStarts, slideStarts} from './slide-starts';

export type Report = {readonly item: string; readonly position: number; readonly stayed: boolean};

export type Held = {readonly item: string; readonly landing: Maybe<number>};

export type DragSort = {
  readonly order: readonly string[];
  readonly held: Maybe<Held>;
  readonly report: Maybe<Report>;
  readonly slideStarts: SlideStarts;
  readonly gripped: Maybe<string>;
  readonly animated: boolean;
};

type Start = {readonly items: Iterable<string>; readonly animated: boolean};

const initial = ({items, animated}: Start): DragSort =>
  ({
    order: [...items],
    held: nothing(),
    report: nothing(),
    slideStarts: {},
    gripped: nothing(),
    animated
  });

const moved = (
  sort: DragSort,
  item: string,
  order: readonly string[],
  starts: Places
): DragSort => ({
  ...sort,
  order,
  report: some({item, position: order.indexOf(item), stayed: false}),
  slideStarts: sort.animated ? slideStarts.begun(sort.slideStarts, starts) : {}
});

const stayed = (sort: DragSort, item: string): DragSort =>
  ({...sort, report: some({item, position: sort.order.indexOf(item), stayed: true})});

const sliding = (sort: DragSort, item: string): boolean => not(slideStarts.of(sort.slideStarts, item).isNothing);

const crossed = (sort: DragSort, at: number, homeward: boolean): DragSort => {
  const neighbor = sort.order[at];
  return sort.held
    .map(({item}) => neighbor === item || sliding(sort, item) || sliding(sort, neighbor)
      ? sort
      : moved(sort, item, array.moveToIndex(at, item, sort.order), slideStarts.afterCrossing(neighbor, homeward)))
    .orElse(sort);
};

const anySliding = (sort: DragSort, starts: Places): boolean =>
  Object.keys(starts).some(item => sliding(sort, item));

const settled = (sort: DragSort): DragSort => {
  const withNothingHeld: DragSort = {...sort, held: nothing(), gripped: nothing()};
  return sort.held
    .mBind(({item, landing}) => landing.map(at => {
      const order = array.moveToIndex(at, item, sort.order);
      const starts = slideStarts.afterSettle(sort.order, order);
      if (at === sort.order.indexOf(item)) return withNothingHeld;
      return anySliding(sort, starts) ? stayed(withNothingHeld, item) : moved(withNothingHeld, item, order, starts);
    }))
    .orElse(withNothingHeld);
};

const stepped = (sort: DragSort, item: string, step: 1 | -1): DragSort => {
  const from = sort.order.indexOf(item);
  const to = Math.min(Math.max(from + step, 0), sort.order.length - 1);
  if (to === from) return sort;
  return sliding(sort, item) || sliding(sort, sort.order[to])
    ? stayed(sort, item)
    : moved(sort, item, array.moveToIndex(to, item, sort.order), slideStarts.afterKeyboardStep(sort.order, item, step));
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
