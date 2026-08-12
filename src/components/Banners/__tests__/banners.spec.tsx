import {fireEvent, render, screen, within} from '@testing-library/react';
import {MemoryRouter} from 'react-router';
import userEvent from '@testing-library/user-event';
import {FC} from 'react';
import {BannerProvider} from '@components/Banners/BannerProvider';
import {Banners} from '@components/Banners/Banners';
import {useBanners} from '@components/Banners/useBanners';

const Trouble: FC<{message: string}> = ({message}) => {
  const {raise} = useBanners();
  return <button type="button" onClick={() => raise(message)}>trouble</button>;
};

const renderWithTrouble = (message: string) => render(
  <MemoryRouter>
    <BannerProvider>
      <Trouble message={message}/>
      <Banners/>
    </BannerProvider>
  </MemoryRouter>
);

const troubleOf = (alert: HTMLElement, message: string): HTMLElement => {
  const item = within(alert).getByText(message).closest('li');
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

  test('every raised error stands until dismissed, each on its own', async () => {
    render(
      <MemoryRouter>
        <BannerProvider>
          <Trouble message="first trouble"/>
          <Trouble message="second trouble"/>
          <Banners/>
        </BannerProvider>
      </MemoryRouter>
    );
    const [first, second] = screen.getAllByRole('button', {name: 'trouble'});

    await userEvent.click(first);
    await userEvent.click(second);
    const alert = screen.getByRole('alert', {hidden: true});
    expect(within(alert).getByText('first trouble')).toBeInTheDocument();
    expect(within(alert).getByText('second trouble')).toBeInTheDocument();

    await userEvent.click(within(alert).getByRole('button', {name: 'dismiss first trouble', hidden: true}));
    expect(within(alert).getByText('first trouble')).toBeInTheDocument();
    fireEvent.transitionEnd(troubleOf(alert, 'first trouble'), {propertyName: 'translate'});
    expect(within(alert).getByText('first trouble')).toBeInTheDocument();
    fireEvent.transitionEnd(troubleOf(alert, 'first trouble'), {propertyName: 'grid-template-rows'});
    expect(within(alert).queryByText('first trouble')).not.toBeInTheDocument();
    expect(within(alert).getByText('second trouble')).toBeInTheDocument();
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

  test('a sideways stack lets its trouble go when the column closes', async () => {
    render(
      <MemoryRouter initialEntries={['/?stack=left']}>
        <BannerProvider>
          <Trouble message="sideways trouble"/>
          <Banners/>
        </BannerProvider>
      </MemoryRouter>
    );

    await userEvent.click(screen.getByRole('button', {name: 'trouble'}));
    const alert = screen.getByRole('alert', {hidden: true});
    expect(alert).toHaveClass('stack-left');
    await userEvent.click(within(alert).getByRole('button', {name: 'dismiss sideways trouble', hidden: true}));
    fireEvent.transitionEnd(troubleOf(alert, 'sideways trouble'), {propertyName: 'grid-template-columns'});
    expect(within(alert).queryByText('sideways trouble')).not.toBeInTheDocument();
  });

  test('with nothing raised, the panel holds no messages', () => {
    renderWithTrouble('unraised');

    expect(screen.getByRole('alert', {hidden: true}).querySelectorAll('li')).toHaveLength(0);
  });

  test('the panel stands where the dials say, facing its entrance', () => {
    renderWithTrouble('placed');

    const alert = screen.getByRole('alert', {hidden: true});
    expect(alert).toHaveClass('top', 'center', 'from-above', 'stack-down');
  });

  test('without a provider, raising degrades quietly', async () => {
    render(<Trouble message="into the void"/>);

    await userEvent.click(screen.getByRole('button', {name: 'trouble'}));

    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });
});
