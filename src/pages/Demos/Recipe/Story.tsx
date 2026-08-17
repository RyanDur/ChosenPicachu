import {FC, MouseEvent, PropsWithChildren} from 'react';
import {has} from '@ryandur/sand';
import {useSearchParams} from 'react-router';

const openedIn = (params: URLSearchParams, param: string): Set<string> =>
  new Set((params.get(param) ?? '').split(',').filter(part => part !== ''));

type Props = PropsWithChildren<{
  param: string;
  id: string;
  can: string;
  soThat: string;
  steps?: number;
}>;

export const Story: FC<Props> = ({param, id, can, soThat, steps, children}) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const toggled = (event: MouseEvent<HTMLElement>) => {
    event.preventDefault();
    setSearchParams(previous => {
      const next = openedIn(previous, param);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      const params = new URLSearchParams(previous);
      if (next.size > 0) {
        params.set(param, [...next].join(','));
      } else {
        params.delete(param);
      }
      return params;
    }, {replace: true});
  };
  return <li>
    <details className="arc" open={openedIn(searchParams, param).has(id)}>
      <summary className="opener" onClick={toggled}>
        <hgroup className="story">
          <h3 className="can">{can}</h3>
          <p className="so-that">so that {soThat}</p>
          {has(steps) && <p className="step-tally">{steps === 1 ? '1 step' : `${steps} steps`}</p>}
        </hgroup>
      </summary>
      {children}
    </details>
  </li>;
};
