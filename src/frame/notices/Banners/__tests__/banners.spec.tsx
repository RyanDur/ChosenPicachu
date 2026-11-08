import {render} from '@testing-library/react';
import {FC} from 'react';
import {TestApp} from '@__test_support/TestApp';
import {bannerChange, useBannerDispatch} from '@frame/notices/Banners';
import {banners} from '../__test_support/banners';

const Trouble: FC<{message: string}> = ({message}) => {
  const dispatchBanner = useBannerDispatch();
  return <button type="button" onClick={() => dispatchBanner(bannerChange.raised(message))}>trouble</button>;
};

const renderWithTrouble = (message: string) => render(<TestApp><Trouble message={message}/></TestApp>);

describe('the banners', () => {
  test('should announce a raised error as an alert', async () => {
    renderWithTrouble('the live feed refused the handshake');

    await banners.raise();

    expect(banners.saying('the live feed refused the handshake')).toHaveLength(1);
  });

  test('should let every raised error stand on its own', async () => {
    render(<TestApp><Trouble message="first trouble"/><Trouble message="second trouble"/></TestApp>);
    const [first, second] = banners.raisers();

    await banners.raise(first);
    await banners.raise(second);

    expect(banners.saying('first trouble')).toHaveLength(1);
    expect(banners.saying('second trouble')).toHaveLength(1);
  });

  test('should let the same trouble raised twice stand only once', async () => {
    renderWithTrouble('the feed is down');

    await banners.raise();
    await banners.raise();

    expect(banners.saying('the feed is down')).toHaveLength(1);
  });

  test('should show no panel with nothing raised', () => {
    renderWithTrouble('unraised');

    expect(banners.panel()).not.toBeInTheDocument();
  });

  test('should degrade quietly when raising without a provider', async () => {
    render(<Trouble message="into the void"/>);

    await banners.raise();

    expect(banners.panel()).not.toBeInTheDocument();
  });
});
