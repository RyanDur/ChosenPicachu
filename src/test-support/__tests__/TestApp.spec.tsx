import {render, screen, waitFor} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {Route} from 'react-router';
import {Tabs} from '@components/Tabs';
import {TestApp} from '../TestApp';

const doors = [{display: 'First', param: 'first'}, {display: 'Second', param: 'second'}];

describe('the test app', () => {
  test('the address probe never runs ahead of the screen', async () => {
    render(<TestApp at="/somewhere"><Tabs label="doors" values={doors}/></TestApp>);

    await userEvent.click(screen.getByRole('link', {name: 'Second'}));

    await waitFor(() => expect(screen.getByLabelText('url search')).toHaveTextContent('tab=second'));
    expect(screen.getByRole('link', {name: 'Second', current: 'page'})).toBeInTheDocument();
  });

  test('the probes outlive an error no page catches', async () => {
    const boom = new Error('boom');
    const Boom = () => {
      throw boom;
    };
    const caught: unknown[] = [];

    render(<TestApp at="/nowhere"><Route path="/nowhere" element={<Boom/>}/></TestApp>,
      {onCaughtError: error => caught.push(error)});

    expect(await screen.findByLabelText('errors reported')).toHaveTextContent(/^boom$/);
    expect(screen.getByLabelText('url path')).toHaveTextContent('/nowhere');
    expect(caught).toEqual([boom]);
  });
});
