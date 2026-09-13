import {fireEvent, render, screen, within} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {FC} from 'react';
import {TestApp} from '@test-support/TestApp';
import {useBanners} from '@components/Banners/useBanners';

const Trouble: FC<{message: string}> = ({message}) => {
  const {raise} = useBanners();
  return <button type="button" onClick={() => raise(message)}>trouble</button>;
};

const renderWithTrouble = (message: string) => render(<TestApp><Trouble message={message}/></TestApp>);

const troubleOf = (alert: HTMLElement, message: string): HTMLElement => {
  const item = within(alert).getAllByRole('listitem', {hidden: true}).find(standing => within(standing).queryByText(message) !== null);
  if (!item) {
    throw new Error(`no standing trouble says "${message}"`);
  }
  return item;
};

describe('the banners', () => {
  test('a raised error is announced as an alert', async () => {
    renderWithTrouble('the live feed refused the handshake');

    await userEvent.click(screen.getByRole('button', {name: 'trouble'}));

    expect(within(screen.getByRole('alert', {hidden: true})).getByText('the live feed refused the handshake')).toBeInTheDocument();
  });

  test('every raised error stands on its own until dismissed', async () => {
    render(<TestApp><Trouble message="first trouble"/><Trouble message="second trouble"/></TestApp>);
    const [first, second] = screen.getAllByRole('button', {name: 'trouble'});

    await userEvent.click(first);
    await userEvent.click(second);
    const alert = screen.getByRole('alert', {hidden: true});
    expect(within(alert).getByText('first trouble')).toBeInTheDocument();
    expect(within(alert).getByText('second trouble')).toBeInTheDocument();

    await userEvent.click(within(alert).getByRole('button', {name: 'dismiss first trouble', hidden: true}));
    fireEvent.transitionEnd(troubleOf(alert, 'first trouble'), {propertyName: 'grid-template-rows'});
    expect(within(alert).queryByText('first trouble')).not.toBeInTheDocument();
    expect(within(alert).getByText('second trouble')).toBeInTheDocument();
  });

  test('a dismissed trouble leaves only once it has finished closing', async () => {
    render(<TestApp><Trouble message="first trouble"/></TestApp>);
    await userEvent.click(screen.getByRole('button', {name: 'trouble'}));
    const alert = screen.getByRole('alert', {hidden: true});

    await userEvent.click(within(alert).getByRole('button', {name: 'dismiss first trouble', hidden: true}));
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
    const alert = screen.getByRole('alert', {hidden: true});
    expect(within(alert).getAllByText('the feed is down')).toHaveLength(1);

    await userEvent.click(within(alert).getByRole('button', {name: 'dismiss the feed is down', hidden: true}));
    fireEvent.transitionEnd(troubleOf(alert, 'the feed is down'), {propertyName: 'grid-template-rows'});
    await userEvent.click(trouble);
    expect(within(alert).getAllByText('the feed is down')).toHaveLength(1);
  });

  test('a trouble in a side stack leaves once its dismissal has finished', async () => {
    render(<TestApp at="/?stack=left"><Trouble message="sideways trouble"/></TestApp>);

    await userEvent.click(screen.getByRole('button', {name: 'trouble'}));
    const alert = screen.getByRole('alert', {hidden: true});
    await userEvent.click(within(alert).getByRole('button', {name: 'dismiss sideways trouble', hidden: true}));
    fireEvent.transitionEnd(troubleOf(alert, 'sideways trouble'), {propertyName: 'grid-template-columns'});
    expect(within(alert).queryByText('sideways trouble')).not.toBeInTheDocument();
  });

  test('with nothing raised, the panel holds no messages', () => {
    renderWithTrouble('unraised');

    expect(within(screen.getByRole('alert', {hidden: true})).queryAllByRole('listitem', {hidden: true})).toHaveLength(0);
  });

  test('without a provider, raising degrades quietly', async () => {
    render(<Trouble message="into the void"/>);

    await userEvent.click(screen.getByRole('button', {name: 'trouble'}));

    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });
});
