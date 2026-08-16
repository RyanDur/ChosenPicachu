import {render} from '@testing-library/react';
import {EagerHideAnimatedTable} from '@components/DragSortableTable';
import {windowedAggregates} from '@pages/Demos/Tables/Aggregations/fold';
import {cells} from '@pages/Demos/Tables/Aggregations/cells';
import {wire} from '../builds/EagerHideAnimated';
import tableHtml from '../table.html?raw';

const columns = [
  {display: 'window', column: 'window', className: 'window'},
  {display: 'trades', column: 'trades', className: 'trades', sortable: true},
  {display: 'buys', column: 'buys', className: 'buys', sortable: true},
  {display: 'sells', column: 'sells', className: 'sells', sortable: true},
  {display: 'volume', column: 'volume', className: 'volume', sortable: true},
  {display: 'vwap', column: 'vwap', className: 'vwap', sortable: true},
  {display: 'change', column: 'change', className: 'change', sortable: true}
];

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
    const dealt = windowedAggregates([]).map(cells);
    const {container, unmount} = render(
      <EagerHideAnimatedTable tableClassName="fancy-table"
                              draggableColumns
                              draggableRows
                              resizableColumns
                              sortable
                              theadClassName="header"
                              trClassName="row"
                              tbodyClassName="body"
                              cellClassName="cell"
                              columns={columns}
                              rows={dealt}/>);
    const react = shapeOf(container);
    unmount();

    document.body.innerHTML = tableHtml;
    wire(document);
    const frame = shapeOf(document.body);
    document.body.innerHTML = '';

    expect(frame).toEqual(react);
  });
});
