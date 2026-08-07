import tableSource from '@components/DragSortableTable/EagerHideAnimatedTable.tsx?raw';
import headerSource from '@components/DragSortableTable/DraggableHeader.tsx?raw';
import animatedHeaderSource from '@components/DragSortableTable/AnimatedDraggableHeader.tsx?raw';
import rowSource from '@components/DragSortableTable/AnimatedDraggableRow.tsx?raw';
import listSource from '@pages/Demos/DragAndDrop/SortingList.tsx?raw';
import draggableSource from '@pages/Demos/DragAndDrop/Draggable.tsx?raw';
import listCss from '@pages/Demos/DragAndDrop/styles.css?raw';

describe('the hand-written tutorial fragments still tell the truth', () => {
  test.each([
    ['headers render through the order', tableSource, 'ordered.map(column =>'],
    ['the lifted header blanks by comparison', tableSource,
      'aloft: columnsTravel.aloft,'],
    ['the lifted column blanks across rows', tableSource,
      'aloftColumn: columnsTravel.aloft,'],
    ['headers are real column headers', headerSource, 'scope="col"'],
    ['a displaced header wears its direction', animatedHeaderSource, 'displaced-${displaced.toward}'],
    ['a shifted row wears the class', rowSource, "has(drop) && 'shifted'"],
    ['a shifted row carries its drop', rowSource, "'--drop': `${drop}px`"],
    ['the grip arms the native drag', draggableSource, 'draggable={is(dragging)}'],
    ['a lazy list stashes the landing', listSource, 'setLanding(index)'],
    ['a lazy settle waits one tick', listSource, 'setTimeout(() => theater.glided(() => setOrder(settled)))'],
    ['the native origin fades, never vanishes', listCss, 'opacity: 0.1%'],
    ['eager list slides span a seat and a gap', listCss, 'translateX(calc(100% + var(--base)))']
  ])('%s', (_claim, source, fragment) => {
    expect(source).toContain(fragment);
  });
});
