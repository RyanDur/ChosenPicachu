import {Children, FC, MouseEvent, PropsWithChildren, ReactNode, isValidElement} from 'react';
import {useSearchParams} from 'react-router';
import {useRanks} from './ranks';
import {Step} from './Step';

const openedIn = (params: URLSearchParams, param: string): Set<string> =>
  new Set((params.get(param) ?? '').split(',').filter(part => part !== ''));

const stepsIn = (children: ReactNode): number =>
  Children.toArray(children).reduce<number>((count, child) => {
    if (!isValidElement<PropsWithChildren>(child)) return count;
    return child.type === Step ? count + 1 : count + stepsIn(child.props.children);
  }, 0);

type Props = PropsWithChildren<{
  param: string;
  id: string;
  can: string;
  soThat: string;
}>;

export const Story: FC<Props> = ({param, id, can, soThat, children}) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const {story: Can} = useRanks();
  const steps = stepsIn(children);
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
    <details className="arc" open={openedIn(searchParams, param).has(id)} aria-labelledby={`${param}-${id}-story`}>
      <summary className="opener" onClick={toggled}>
        <hgroup className="story card rounded-corners lifted">
          <Can className="can" id={`${param}-${id}-story`}>{can}</Can>
          <p className="so-that">so that {soThat}</p>
          {steps > 0 && <p className="step-tally">{steps === 1 ? '1 step' : `${steps} steps`}</p>}
        </hgroup>
      </summary>
      {children}
    </details>
  </li>;
};
