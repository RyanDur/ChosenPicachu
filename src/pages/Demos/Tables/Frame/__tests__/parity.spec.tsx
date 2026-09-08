import {render, within} from '@testing-library/react';
import {windowedAggregates} from '@pages/Demos/Tables/Aggregations/fold';
import {cells} from '@pages/Demos/Tables/Aggregations/cells';
import {EagerHideAnimatedTable} from '../../Builds/EagerHideAnimatedTable';
import {wire} from '../builds/EagerHideAnimated';
import tableHtml from '../table.html?raw';

type CellShape = {
  tag: string;
  classes: string[];
  scope: string | null;
  buttons: (string | null)[];
};

const shapeOf = (root: HTMLElement): {headers: CellShape[]; rows: CellShape[][]} => {
  const described = (cell: HTMLElement): CellShape => ({
    tag: cell.tagName,
    classes: [...cell.classList].sort(),
    scope: cell.getAttribute('scope'),
    buttons: within(cell).queryAllByRole('button', {hidden: true}).map(button => button.getAttribute('aria-label'))
  });
  const [head, body] = within(root).getAllByRole('rowgroup', {hidden: true});
  return {
    headers: within(head).getAllByRole('columnheader', {hidden: true}).map(described),
    rows: within(body).getAllByRole('row', {hidden: true})
      .map(lane => [within(lane).getByRole('rowheader', {hidden: true}), ...within(lane).getAllByRole('cell', {hidden: true})].map(described))
  };
};

describe('the two worlds deal the same table', () => {
  it('the frame markup stands exactly as the react table renders', () => {
    const rows = windowedAggregates([]).map(cells);
    const {container, unmount} = render(<EagerHideAnimatedTable rows={rows}/>);
    const react = shapeOf(container);
    unmount();

    document.body.innerHTML = tableHtml;
    wire(document);
    const frame = shapeOf(document.body);
    document.body.innerHTML = '';

    expect(frame).toEqual(react);
  });
});
