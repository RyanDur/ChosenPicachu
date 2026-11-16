import {render} from '@testing-library/react';
import {tradeTotals} from '@pages/Demos/Market/trade-totals';
import {cells} from '@pages/Demos/Market';
import {EagerTable} from '../../Builds/EagerTable';
import {tableShape, vanillaFrame} from '../__test_support';

describe('the two worlds deal the same table', () => {
  it('the frame markup stands exactly as the react table renders', () => {
    const rows = tradeTotals.perLookback([]).map(cells.from);
    const {unmount} = render(<EagerTable caption="live aggregations" origin="hide" motion="animated" columns={cells.measures} rows={rows}/>);
    const react = tableShape.read(document.body);
    unmount();

    vanillaFrame.stand();
    const frame = tableShape.read(document.body);
    document.body.innerHTML = '';

    expect(frame).toEqual(react);
  });
});
