import {render} from '@testing-library/react';
import {EagerHideAnimatedTable, SeatedTable} from '@components/DragSortableTable/EagerHideAnimatedTable';
import {windowedAggregates} from '@pages/Demos/Tables/Aggregations/fold';
import {cells, valuesOf} from '@pages/Demos/Tables/Aggregations/cells';
import {AggregatesTable, measures} from '@pages/Demos/Tables/Aggregations/AggregatesTable';
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
    const rows = windowedAggregates([]).map(cells);
    const {container, unmount} = render(
      <SeatedTable columns={measures} values={rows.map(valuesOf)}>
        <EagerHideAnimatedTable>
          <AggregatesTable rows={rows}/>
        </EagerHideAnimatedTable>
      </SeatedTable>);
    const react = shapeOf(container);
    unmount();

    document.body.innerHTML = tableHtml;
    wire(document);
    const frame = shapeOf(document.body);
    document.body.innerHTML = '';

    expect(frame).toEqual(react);
  });
});
