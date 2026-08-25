import {render} from '@testing-library/react';
import {EagerHideAnimatedTable} from '@components/DragSortableTable';
import {Cell, Column, Row} from '@components/Table';
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
      <EagerHideAnimatedTable draggableColumns draggableRows resizableColumns sortable>
        <Column name="window" className="window">window</Column>
        <Column name="trades" className="trades" sortable>trades</Column>
        <Column name="buys" className="buys" sortable>buys</Column>
        <Column name="sells" className="sells" sortable>sells</Column>
        <Column name="volume" className="volume" sortable>volume</Column>
        <Column name="vwap" className="vwap" sortable>vwap</Column>
        <Column name="change" className="change" sortable>change</Column>

        {windowedAggregates([]).map(aggregate => {
          const row = cells(aggregate);

          return <Row key={aggregate.window}>
            <Cell column="window">{row.window.display}</Cell>
            <Cell column="trades" value={row.trades.value}>{row.trades.display}</Cell>
            <Cell column="buys" value={row.buys.value}>{row.buys.display}</Cell>
            <Cell column="sells" value={row.sells.value}>{row.sells.display}</Cell>
            <Cell column="volume" value={row.volume.value}>{row.volume.display}</Cell>
            <Cell column="vwap" value={row.vwap.value}>{row.vwap.display}</Cell>
            <Cell column="change" value={row.change.value}>{row.change.display}</Cell>
          </Row>;
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
