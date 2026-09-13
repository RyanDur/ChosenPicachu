import {render, screen, waitFor} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
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
});
