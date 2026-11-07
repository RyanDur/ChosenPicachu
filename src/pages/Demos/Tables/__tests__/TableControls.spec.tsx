import {render} from '@testing-library/react';
import {TestApp} from '@__test_support/TestApp';
import {tableControls} from '@pages/Demos/Tables/__test_support';
import {TableControls} from '../TableControls';

describe('the table controls', () => {
  test('offer a pace, an origin and a motion, eager by default', async () => {
    render(<TestApp at="/"><TableControls/></TestApp>);

    await tableControls.pressSettings();

    expect(await tableControls.axes()).toEqual(['pace', 'origin', 'motion']);
    expect(await tableControls.radios()).toEqual(['Eager', 'Lazy', 'Keep', 'Hide', 'Animate', 'Static']);
    expect(await tableControls.radio('Eager')).toBeChecked();
    expect(await tableControls.radio('Hide')).toBeChecked();
    expect(await tableControls.radio('Animate')).toBeChecked();
  });

  test('start folded behind their readout, and a press opens them', async () => {
    render(<TestApp at="/"><TableControls/></TestApp>);
    expect(await tableControls.settings()).not.toHaveAttribute('open');
    expect(await tableControls.readout('<EagerTable className="hide animated"/>')).toBeVisible();

    await tableControls.pressSettings();

    expect(await tableControls.region()).toBeVisible();
    expect(await tableControls.readout('<EagerTable className="hide animated"/>')).toBeVisible();
  });

  test('read their prompt as settings apart from its readout', async () => {
    render(<TestApp at="/"><TableControls/></TestApp>);

    expect(await tableControls.settings()).toHaveTextContent(/^settings \S/);
  });

  test('read out the table first shown', async () => {
    render(<TestApp at="/"><TableControls/></TestApp>);

    expect(await tableControls.reading('pace')).toHaveTextContent(/Neighbors swap the moment you drag past them/);
    expect(await tableControls.reading('origin')).toHaveTextContent(/moves with the pointer, cells and all/);
    expect(await tableControls.reading('motion')).toHaveTextContent(/slide to their new places/);
    expect(await tableControls.readout('<EagerTable className="hide animated"/>')).toBeVisible();
  });

  test('read out whatever is chosen', async () => {
    render(<TestApp at="/"><TableControls/></TestApp>);

    await tableControls.choose('Lazy', 'Keep', 'Static');

    expect(await tableControls.reading('pace')).toHaveTextContent(/dispatches the new order on drop/);
    expect(await tableControls.reading('origin')).toHaveTextContent(/stays where it was/);
    expect(await tableControls.reading('motion')).toHaveTextContent(/gives them no time/);
    expect(await tableControls.readout('<LazyTable className="keep static"/>')).toBeVisible();
  });

  test('take their dials from the url', async () => {
    render(<TestApp at="/?pace=lazy&origin=keep&motion=static"><TableControls/></TestApp>);

    expect(await tableControls.chosenDials()).toEqual(['Lazy', 'Keep', 'Static']);
    expect(await tableControls.readout('<LazyTable className="keep static"/>')).toBeVisible();
  });

  test('read out the frame, not the React table, in the html world', async () => {
    render(<TestApp at="/?world=vanilla"><TableControls/></TestApp>);

    expect(await tableControls.readout('<TableFrame/>')).toBeVisible();
  });
});
