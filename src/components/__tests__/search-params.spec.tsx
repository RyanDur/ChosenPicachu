import {FC} from 'react';
import {screen} from '@testing-library/react';
import * as D from 'schemawax';
import {numberParam, useSearchParamsObject} from '@components/search-params';
import {renderWithMemoryRouter} from '@test-support';

const Probe: FC = () => {
  const {page, tab} = useSearchParamsObject({page: numberParam, tab: D.string}, {page: 1, tab: 'aic'});
  return <output data-testid="probe">{JSON.stringify({page, tab})}</output>;
};

const probeAt = (search: string) =>
  renderWithMemoryRouter({path: '/', element: <Probe/>}, {path: `/${search}`});

describe('search params are decoded, never trusted', () => {
  it('delivers params that match their decoders, as their real types', () => {
    probeAt('?page=3&tab=harvard');
    expect(screen.getByTestId('probe')).toHaveTextContent('{"page":3,"tab":"harvard"}');
  });

  it('falls back to the default when a param is absent', () => {
    probeAt('');
    expect(screen.getByTestId('probe')).toHaveTextContent('{"page":1,"tab":"aic"}');
  });

  it('a param that fails its decoder falls back alone — the rest survive', () => {
    probeAt('?page=banana&tab=harvard');
    expect(screen.getByTestId('probe')).toHaveTextContent('{"page":1,"tab":"harvard"}');
  });
});
