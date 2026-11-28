import {TestApp} from '@__test_support/TestApp';
import {FC} from 'react';
import {render, screen} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {appAddress} from '@__test_support/address';
import * as schema from 'schemawax';
import {numberParam, useSearchParamsObject} from '@navigation/search-params';
import {decodedParams} from '@navigation/search-params/__test_support/decodedParams';

const Probe: FC = () => {
  const {page, tab} = useSearchParamsObject({page: numberParam, tab: schema.string}, {page: 1, tab: 'aic'});
  return <output aria-label="decoded">{JSON.stringify({page, tab})}</output>;
};

const probeAt = (search: string) =>
  render(<TestApp at={`/${search}`}><Probe/></TestApp>);

describe('search params are decoded, never trusted', () => {
  it('delivers params that match their decoders, as their real types', () => {
    probeAt('?page=3&tab=harvard');
    expect(decodedParams.read()).toEqual({page: 3, tab: 'harvard'});
  });

  it('falls back to the default when a param is absent', () => {
    probeAt('');
    expect(decodedParams.read()).toEqual({page: 1, tab: 'aic'});
  });

  it('a param that fails its decoder falls back alone — the rest survive', () => {
    probeAt('?page=banana&tab=harvard');
    expect(decodedParams.read()).toEqual({page: 1, tab: 'harvard'});
  });
});

const HarvardWithoutThePage: FC = () => {
  const {updateSearchParams} = useSearchParamsObject({page: numberParam, tab: schema.string});
  return <button type="button" onClick={() => updateSearchParams({tab: 'harvard'}, {without: ['page']})}>Harvard</button>;
};

describe('search params change in one step', () => {
  it('sets one param and drops another in a single move, so one Back returns to the address before it', async () => {
    render(<TestApp cameFrom="/" at="/?page=3&tab=aic"><HarvardWithoutThePage/></TestApp>);

    await userEvent.click(screen.getByRole('button', {name: 'Harvard'}));
    expect(appAddress.search()).toHaveTextContent(/^\?tab=harvard$/);

    await appAddress.back();
    expect(appAddress.search()).toHaveTextContent(/^\?page=3&tab=aic$/);
  });
});
