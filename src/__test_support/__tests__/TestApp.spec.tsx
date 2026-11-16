import {render, waitFor} from '@testing-library/react';
import {Route} from 'react-router';
import * as schema from 'schemawax';
import {Tabs} from '@navigation/Tabs';
import {useSearchParamsObject} from '@navigation/search-params';
import {tabStrip} from '@navigation/Tabs/__test_support/tabStrip';
import {appAddress} from '@__test_support/address';
import {appErrors} from '@__test_support/errors';
import {TestApp} from '@__test_support/TestApp';

const doors = [{display: 'First', param: 'first', to: '?tab=first'}, {display: 'Second', param: 'second', to: '?tab=second'}];

const Doors = () => {
  const {tab} = useSearchParamsObject({tab: schema.string});
  return <Tabs label="doors" current={tab} values={doors}/>;
};

describe('the test app', () => {
  test('the address probe never runs ahead of the screen', async () => {
    render(<TestApp at="/somewhere"><Doors/></TestApp>);

    await tabStrip('doors').open('Second');

    await waitFor(() => expect(appAddress.search()).toHaveTextContent('tab=second'));
    expect(tabStrip('doors').current()).toEqual(['Second']);
  });

  test('the page reads the address the app is at, and the address follows each navigation', async () => {
    render(<TestApp at="/somewhere#here"><Doors/></TestApp>);

    expect(window.location).toBeAt('/somewhere#here');

    await tabStrip('doors').open('Second');

    await waitFor(() => expect(window.location).toBeAt('/somewhere?tab=second'));
  });

  test('Back returns to the address the reader came from', async () => {
    render(<TestApp cameFrom="/before" at="/somewhere"><Doors/></TestApp>);

    await appAddress.back();

    await waitFor(() => expect(window.location).toBeAt('/before'));
  });

  test('the probes outlive an error no page catches', async () => {
    const boom = new Error('boom');
    const Boom = () => {
      throw boom;
    };
    const caught: unknown[] = [];

    render(<TestApp at="/nowhere"><Route path="/nowhere" element={<Boom/>}/></TestApp>,
      {onCaughtError: error => caught.push(error)});

    expect(await appErrors.reported()).toEqual(['boom']);
    expect(appAddress.path()).toHaveTextContent('/nowhere');
  });

  test("an error no page catches reaches the test's error handler", async () => {
    const boom = new Error('boom');
    const Boom = () => {
      throw boom;
    };
    const caught: unknown[] = [];

    render(<TestApp at="/nowhere"><Route path="/nowhere" element={<Boom/>}/></TestApp>,
      {onCaughtError: error => caught.push(error)});

    await appErrors.reported();
    expect(caught).toEqual([boom]);
  });
});
