import {render, screen, within} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {FC} from 'react';
import {TestApp} from '@__test_support/TestApp';
import {bannerChange, useBannerDispatch} from '@frame/notices/banners';

const Trouble: FC<{message: string}> = ({message}) => {
  const dispatchBanner = useBannerDispatch();
  return <button type="button" onClick={() => dispatchBanner(bannerChange.raised(message))}>trouble</button>;
};

const renderWithTrouble = (message: string) => render(<TestApp><Trouble message={message}/></TestApp>);

describe('the banners', () => {
  test('a raised error is announced as an alert', async () => {
    renderWithTrouble('the live feed refused the handshake');

    await userEvent.click(screen.getByRole('button', {name: 'trouble'}));

    expect(within(screen.getByRole('alert')).getByText('the live feed refused the handshake')).toBeInTheDocument();
  });

  test('every raised error stands on its own', async () => {
    render(<TestApp><Trouble message="first trouble"/><Trouble message="second trouble"/></TestApp>);
    const [first, second] = screen.getAllByRole('button', {name: 'trouble'});

    await userEvent.click(first);
    await userEvent.click(second);
    const alert = screen.getByRole('alert');
    expect(within(alert).getByText('first trouble')).toBeInTheDocument();
    expect(within(alert).getByText('second trouble')).toBeInTheDocument();
  });

  test('the same trouble raised twice stands only once', async () => {
    renderWithTrouble('the feed is down');
    const trouble = screen.getByRole('button', {name: 'trouble'});

    await userEvent.click(trouble);
    await userEvent.click(trouble);
    const alert = screen.getByRole('alert');
    expect(within(alert).getAllByText('the feed is down')).toHaveLength(1);
  });

  test('with nothing raised, there is no panel', () => {
    renderWithTrouble('unraised');

    expect(screen.queryByRole('alert', {hidden: true})).not.toBeInTheDocument();
  });

  test('without a provider, raising degrades quietly', async () => {
    render(<Trouble message="into the void"/>);

    await userEvent.click(screen.getByRole('button', {name: 'trouble'}));

    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });
});
