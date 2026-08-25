import {render} from '@testing-library/react';
import {
  Cell, Column, DraggableColumn, DraggableRow, EagerHideAnimatedTable, ResizeHandle, SortMenu
} from '@components/DragSortableTable/EagerHideAnimatedTable';
import {windowedAggregates} from '@pages/Demos/Tables/Aggregations/fold';
import {cells} from '@pages/Demos/Tables/Aggregations/cells';
import {wire} from '../builds/EagerHideAnimated';
import tableHtml from '../table.html?raw';

type CellShape = {
  tag: string;
  classes: string[];
  scope: string | null;
  buttons: (string | null)[];
};

const shapeOf = (root: ParentNode): {headers: CellShape[]; rows: CellShape[][]} => {
  const described = (cell: Element): CellShape => ({
    tag: cell.tagName,
    classes: [...cell.classList].sort(),
    scope: cell.getAttribute('scope'),
    buttons: [...cell.querySelectorAll('button')].map(button => button.getAttribute('aria-label'))
  });
  return {
    headers: [...root.querySelectorAll('thead th')].map(described),
    rows: [...root.querySelectorAll('tbody tr')].map(lane => [...lane.children].map(described))
  };
};

describe('the two worlds deal the same table', () => {
  it('the frame markup stands exactly as the react table renders', () => {
    const {container, unmount} = render(
      <EagerHideAnimatedTable>
        <Column name="window" className="window">window<ResizeHandle/></Column>
        <DraggableColumn name="trades" className="trades">trades<SortMenu/><ResizeHandle/></DraggableColumn>
        <DraggableColumn name="buys" className="buys">buys<SortMenu/><ResizeHandle/></DraggableColumn>
        <DraggableColumn name="sells" className="sells">sells<SortMenu/><ResizeHandle/></DraggableColumn>
        <DraggableColumn name="volume" className="volume">volume<SortMenu/><ResizeHandle/></DraggableColumn>
        <DraggableColumn name="vwap" className="vwap">vwap<SortMenu/><ResizeHandle/></DraggableColumn>
        <Column name="change" className="change">change<SortMenu/><ResizeHandle/></Column>

        {windowedAggregates([]).map(aggregate => {
          const row = cells(aggregate);

          return <DraggableRow key={aggregate.window}>
            <Cell column="window">{row.window.display}</Cell>
            <Cell column="trades" value={row.trades.value}>{row.trades.display}</Cell>
            <Cell column="buys" value={row.buys.value}>{row.buys.display}</Cell>
            <Cell column="sells" value={row.sells.value}>{row.sells.display}</Cell>
            <Cell column="volume" value={row.volume.value}>{row.volume.display}</Cell>
            <Cell column="vwap" value={row.vwap.value}>{row.vwap.display}</Cell>
            <Cell column="change" value={row.change.value}>{row.change.display}</Cell>
          </DraggableRow>;
        })}
      </EagerHideAnimatedTable>);
    const react = shapeOf(container);
    unmount();

    document.body.innerHTML = tableHtml;
    wire(document);
    const frame = shapeOf(document.body);
    document.body.innerHTML = '';

    expect(frame).toEqual(react);
  });
});
