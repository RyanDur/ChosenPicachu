import tableSource from '@components/DragSortableTable/EagerHideAnimatedTable/EagerHideAnimatedTable.tsx?raw';
import headerSource from '@components/DragSortableTable/EagerKeepStaticTable/DraggableColumn.tsx?raw';
import animatedHeaderSource from '@components/DragSortableTable/EagerKeepAnimatedTable/DraggableColumn.tsx?raw';
import cellSource from '@components/DragSortableTable/EagerKeepAnimatedTable/Cell.tsx?raw';
import rowSource from '@components/DragSortableTable/EagerKeepAnimatedTable/Row.tsx?raw';
import lazyStaticList from '@pages/Demos/DragAndDrop/LazyKeepStaticList/LazyKeepStaticList.tsx?raw';
import lazyAnimatedList from '@pages/Demos/DragAndDrop/LazyKeepAnimatedList/LazyKeepAnimatedList.tsx?raw';
import sessionSource from '@pages/Demos/DragAndDrop/session.ts?raw';
import draggableSource from '@pages/Demos/DragAndDrop/items/KeepItem.tsx?raw';
import whisperCss from '@pages/Demos/DragAndDrop/EagerHideStaticList/EagerHideStaticList.css?raw';
import pushedCss from '@pages/Demos/DragAndDrop/EagerKeepAnimatedList/EagerKeepAnimatedList.css?raw';

describe('the hand-written tutorial fragments still tell the truth', () => {
  test.each([
    ['headers render through the order', tableSource, 'order.map(name =>'],
    ['the lifted header blanks by comparison', animatedHeaderSource, "hidden && 'hide',"],
    ['the lifted column blanks across rows', cellSource, "columnAloft(state).map(held => held === column).orElse(false) && 'hide',"],
    ['headers are real column headers', headerSource, 'scope="col"'],
    ["a displaced header carries its direction as data", animatedHeaderSource, "'--toward': displaced.toward === 'left' ? '1' : '-1'"],
    ['a shifted row wears the class', rowSource, "has(drop) && 'shifted'"],
    ['a shifted row carries its drop', rowSource, "'--drop': `${drop}px`"],
    ['the grip arms the native drag', draggableSource, 'draggable={dragging}'],
    ['a lazy list stashes the landing', lazyStaticList, 'setLanding(maybe(index))'],
    ['a lazy settle glides', lazyAnimatedList, 'landedOrder(aloft, landing, order).map(glided(setOrder))'],
    ['a lazy settle waits one tick', sessionSource, 'setTimeout(() => glide(true)(() => apply(settled)))'],
    ['the native origin fades, never vanishes', whisperCss, 'opacity: 0.1%'],
    ['eager list slides carry a signed seat and gap', pushedCss, 'translateX(calc(var(--toward) * (100% + var(--base))))']
  ])('%s', (_claim, source, fragment) => {
    expect(source).toContain(fragment);
  });
});
