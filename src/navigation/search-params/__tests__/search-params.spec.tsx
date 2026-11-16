import {TestApp} from '@__test_support/TestApp';
import {FC} from 'react';
import {render} from '@testing-library/react';
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
