import {render, screen, within} from '@testing-library/react';
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
  <BannerProvider>
    <Trouble message={message}/>
    <Banners/>
  </BannerProvider>
);

describe('the banners', () => {
  test('a raised error is announced as an alert', async () => {
    renderWithTrouble('the live feed refused the handshake');

    await userEvent.click(screen.getByRole('button', {name: 'trouble'}));

    expect(within(screen.getByRole('alert', {hidden: true})).getByText('the live feed refused the handshake')).toBeInTheDocument();
  });

  test('every raised error stands until dismissed, each on its own', async () => {
    render(
      <BannerProvider>
        <Trouble message="first trouble"/>
        <Trouble message="second trouble"/>
        <Banners/>
      </BannerProvider>
    );
    const [first, second] = screen.getAllByRole('button', {name: 'trouble'});

    await userEvent.click(first);
    await userEvent.click(second);
    const alert = screen.getByRole('alert', {hidden: true});
    expect(within(alert).getByText('first trouble')).toBeInTheDocument();
    expect(within(alert).getByText('second trouble')).toBeInTheDocument();

    await userEvent.click(within(alert).getByRole('button', {name: 'dismiss first trouble', hidden: true}));
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
    await userEvent.click(trouble);
    expect(within(alert).getAllByText('the feed is down')).toHaveLength(1);
  });

  test('with nothing raised, the panel holds no messages', () => {
    renderWithTrouble('unraised');

    expect(screen.getByRole('alert', {hidden: true}).querySelectorAll('li')).toHaveLength(0);
  });

  test('without a provider, raising degrades quietly', async () => {
    render(<Trouble message="into the void"/>);

    await userEvent.click(screen.getByRole('button', {name: 'trouble'}));

    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });
});
