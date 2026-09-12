import pageSource from '@pages/Demos/Tables/Builds/EagerTable/EagerTable.tsx?raw';
import headerSource from '@components/DragSortableTable/DraggableColumn.tsx?raw';
import cellSource from '@components/DragSortableTable/Cell.tsx?raw';
import motionCss from '@components/DragSortableTable/motion.css?raw';
import lazyStaticList from '@pages/Demos/DragAndDrop/LazyKeepStaticList/LazyKeepStaticList.tsx?raw';
import lazyAnimatedList from '@pages/Demos/DragAndDrop/LazyKeepAnimatedList/LazyKeepAnimatedList.tsx?raw';
import sessionSource from '@pages/Demos/DragAndDrop/session.ts?raw';
import draggableSource from '@pages/Demos/DragAndDrop/items/KeepItem.tsx?raw';
import whisperCss from '@pages/Demos/DragAndDrop/EagerHideStaticList/EagerHideStaticList.css?raw';
import pushedCss from '@pages/Demos/DragAndDrop/EagerKeepAnimatedList/EagerKeepAnimatedList.css?raw';

describe('the hand-written tutorial fragments still tell the truth', () => {
  test.each([
    ['headers are placed by the order', pageSource, '<Headers className="row" onColumnMoved={onColumnMoved} onSorted={onSorted}>'],
    ['the lifted header wears its seat and its drift', headerSource, "'--seat-x': pixels(seat?.x)"],
    ['the lifted column is carried across rows', cellSource, "'--drift-x': pixels(drift?.x)"],
    ['the carried cell moves only under hide', motionCss, '.sortable.hide .carried {'],
    ['the static sheet gives the marks no time', motionCss, 'animation: settle 0s;'],
    ['headers are real column headers', headerSource, 'scope="col"'],
    ['the dropped column settles through the stylesheet', motionCss, 'translate: var(--settle-x, 0px) var(--settle-y, 0px);'],
    ['the shoved neighbour slides through the stylesheet', motionCss, 'translate: var(--shoved-by, 0px) 0;'],
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
