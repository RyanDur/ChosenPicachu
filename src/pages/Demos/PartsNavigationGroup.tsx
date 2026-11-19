import {FC, PropsWithChildren, useId} from 'react';
import './PartsNavigation.css';

type Props = PropsWithChildren<{label: string; start: number}>;

export const PartsNavigationGroup: FC<Props> = ({label, start, children}) => {
  const labeled = useId();
  return <>
    <p id={labeled} className="parts-navigation-group caption uppercase muted-ink">{label}</p>
    <ol aria-labelledby={labeled} className="parts-index-list numbered" start={start}>{children}</ol>
  </>;
};
