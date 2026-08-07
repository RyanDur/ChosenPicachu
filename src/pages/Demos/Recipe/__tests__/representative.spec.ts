import tableSource from '@components/DragSortableTable/tables/EagerHideAnimatedTable.tsx?raw';
import headerSource from '@components/DragSortableTable/DraggableHeader.tsx?raw';
import animatedHeaderSource from '@components/DragSortableTable/AnimatedDraggableHeader.tsx?raw';
import rowSource from '@components/DragSortableTable/AnimatedDraggableRow.tsx?raw';
import lazyStaticList from '@pages/Demos/DragAndDrop/lists/LazyKeepStaticList.tsx?raw';
import lazyAnimatedList from '@pages/Demos/DragAndDrop/lists/LazyKeepAnimatedList.tsx?raw';
import draggableSource from '@pages/Demos/DragAndDrop/Draggable.tsx?raw';
import whisperCss from '@pages/Demos/DragAndDrop/HideOnDrag.css?raw';
import pushedCss from '@pages/Demos/DragAndDrop/pushed.css?raw';

describe('the hand-written tutorial fragments still tell the truth', () => {
  test.each([
    ['headers render through the order', tableSource, 'ordered.map(column =>'],
    ['the lifted header blanks by comparison', tableSource,
      'aloft={columnsTravel.aloft}'],
    ['the lifted column blanks across rows', tableSource,
      'aloftColumn={columnsTravel.aloft}'],
    ['headers are real column headers', headerSource, 'scope="col"'],
    ["a displaced header carries its direction as data", animatedHeaderSource, "'--toward': displaced.toward === 'left' ? '1' : '-1'"],
    ['a shifted row wears the class', rowSource, "has(drop) && 'shifted'"],
    ['a shifted row carries its drop', rowSource, "'--drop': `${drop}px`"],
    ['the grip arms the native drag', draggableSource, 'draggable={is(dragging)}'],
    ['a lazy list stashes the landing', lazyStaticList, 'setLanding(index)'],
    ['a lazy settle waits one tick', lazyAnimatedList, 'setTimeout(() => glide(true)(() => setOrder(settled)))'],
    ['the native origin fades, never vanishes', whisperCss, 'opacity: 0.1%'],
    ['eager list slides carry a signed seat and gap', pushedCss, 'translateX(calc(var(--toward) * (100% + var(--base))))']
  ])('%s', (_claim, source, fragment) => {
    expect(source).toContain(fragment);
  });
});
