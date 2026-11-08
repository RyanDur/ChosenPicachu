import {fireEvent, render, screen, within} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {FC} from 'react';
import {TestApp} from '@__test_support/TestApp';
import {bannerChange, useBannerDispatch} from '@components/Banners';

const Trouble: FC<{message: string}> = ({message}) => {
  const dispatchBanner = useBannerDispatch();
  return <button type="button" onClick={() => dispatchBanner(bannerChange.raised(message))}>trouble</button>;
};

const renderWithTrouble = (message: string) => render(<TestApp><Trouble message={message}/></TestApp>);

const troubleOf = (alert: HTMLElement, message: string): HTMLElement => {
  const item = within(alert).getAllByRole('listitem').find(standing => within(standing).queryByText(message) !== null);
  if (!item) {
    throw new Error(`no standing trouble says "${message}"`);
  }
  return item;
};

describe('the banners', () => {
  test('a raised error is announced as an alert', async () => {
    renderWithTrouble('the live feed refused the handshake');

    await userEvent.click(screen.getByRole('button', {name: 'trouble'}));

    expect(within(screen.getByRole('alert')).getByText('the live feed refused the handshake')).toBeInTheDocument();
  });

  test('every raised error stands on its own until dismissed', async () => {
    render(<TestApp><Trouble message="first trouble"/><Trouble message="second trouble"/></TestApp>);
    const [first, second] = screen.getAllByRole('button', {name: 'trouble'});

    await userEvent.click(first);
    await userEvent.click(second);
    const alert = screen.getByRole('alert');
    expect(within(alert).getByText('first trouble')).toBeInTheDocument();
    expect(within(alert).getByText('second trouble')).toBeInTheDocument();

    await userEvent.click(within(alert).getByRole('button', {name: 'dismiss first trouble'}));
    fireEvent.transitionEnd(troubleOf(alert, 'first trouble'), {propertyName: 'grid-template-rows'});
    expect(within(alert).queryByText('first trouble')).not.toBeInTheDocument();
    expect(within(alert).getByText('second trouble')).toBeInTheDocument();
  });

  test('a dismissed trouble leaves only once it has finished closing', async () => {
    render(<TestApp><Trouble message="first trouble"/></TestApp>);
    await userEvent.click(screen.getByRole('button', {name: 'trouble'}));
    const alert = screen.getByRole('alert');

    await userEvent.click(within(alert).getByRole('button', {name: 'dismiss first trouble'}));
    expect(within(alert).getByText('first trouble')).toBeInTheDocument();
    fireEvent.transitionEnd(troubleOf(alert, 'first trouble'), {propertyName: 'translate'});
    expect(within(alert).getByText('first trouble')).toBeInTheDocument();
    fireEvent.transitionEnd(troubleOf(alert, 'first trouble'), {propertyName: 'grid-template-rows'});
    expect(within(alert).queryByText('first trouble')).not.toBeInTheDocument();
  });

  test('the same trouble raised twice stands only once, until dismissed', async () => {
    renderWithTrouble('the feed is down');
    const trouble = screen.getByRole('button', {name: 'trouble'});

    await userEvent.click(trouble);
    await userEvent.click(trouble);
    const alert = screen.getByRole('alert');
    expect(within(alert).getAllByText('the feed is down')).toHaveLength(1);

    await userEvent.click(within(alert).getByRole('button', {name: 'dismiss the feed is down'}));
    fireEvent.transitionEnd(troubleOf(alert, 'the feed is down'), {propertyName: 'grid-template-rows'});
    await userEvent.click(trouble);
    expect(within(alert).getAllByText('the feed is down')).toHaveLength(1);
  });

  test('a trouble in a side stack leaves once its dismissal has finished', async () => {
    render(<TestApp at="/?stack=left"><Trouble message="sideways trouble"/></TestApp>);

    await userEvent.click(screen.getByRole('button', {name: 'trouble'}));
    const alert = screen.getByRole('alert');
    await userEvent.click(within(alert).getByRole('button', {name: 'dismiss sideways trouble'}));
    fireEvent.transitionEnd(troubleOf(alert, 'sideways trouble'), {propertyName: 'grid-template-columns'});
    expect(within(alert).queryByText('sideways trouble')).not.toBeInTheDocument();
  });

  test('with nothing raised, there is no panel', () => {
    renderWithTrouble('unraised');

    expect(screen.queryByRole('alert', {hidden: true})).not.toBeInTheDocument();
  });

  test('once the last banner has left, the panel is gone', async () => {
    renderWithTrouble('the only trouble');
    await userEvent.click(screen.getByRole('button', {name: 'trouble'}));
    const alert = screen.getByRole('alert');

    await userEvent.click(within(alert).getByRole('button', {name: 'dismiss the only trouble'}));
    fireEvent.transitionEnd(troubleOf(alert, 'the only trouble'), {propertyName: 'grid-template-rows'});

    expect(screen.queryByRole('alert', {hidden: true})).not.toBeInTheDocument();
  });

  test('without a provider, raising degrades quietly', async () => {
    render(<Trouble message="into the void"/>);

    await userEvent.click(screen.getByRole('button', {name: 'trouble'}));

    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });
});
