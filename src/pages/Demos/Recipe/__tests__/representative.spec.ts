import pageSource from '@pages/Demos/Tables/Builds/EagerHideAnimatedTable/EagerHideAnimatedTable.tsx?raw';
import headerSource from '@components/DragSortableTable/DraggableColumn.tsx?raw';
import cellSource from '@components/DragSortableTable/Cell.tsx?raw';
import animatedTableCss from '@components/DragSortableTable/motion.css?raw';
import lazyStaticList from '@pages/Demos/DragAndDrop/LazyKeepStaticList/LazyKeepStaticList.tsx?raw';
import lazyAnimatedList from '@pages/Demos/DragAndDrop/LazyKeepAnimatedList/LazyKeepAnimatedList.tsx?raw';
import sessionSource from '@pages/Demos/DragAndDrop/session.ts?raw';
import draggableSource from '@pages/Demos/DragAndDrop/items/KeepItem.tsx?raw';
import whisperCss from '@pages/Demos/DragAndDrop/EagerHideStaticList/EagerHideStaticList.css?raw';
import pushedCss from '@pages/Demos/DragAndDrop/EagerKeepAnimatedList/EagerKeepAnimatedList.css?raw';

describe('the hand-written tutorial fragments still tell the truth', () => {
  test.each([
    ['headers are placed by the order', pageSource, '<Headers className="row" onColumnMoved={onColumnMoved} onSorted={onSorted}>'],
    ['the lifted header is carried by the offset from home', headerSource, "'--carried-by': translation(offset)"],
    ['the lifted column is carried across rows', cellSource, "'--carried-by': translation(columnOffset ?? rowOffset)"],
    ['headers are real column headers', headerSource, 'scope="col"'],
    ['the dropped column settles through the stylesheet', animatedTableCss, 'translate: var(--settling-from, 0 0);'],
    ['the shoved neighbour slides through the stylesheet', animatedTableCss, 'translate: var(--shoved-by, 0px) 0;'],
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
