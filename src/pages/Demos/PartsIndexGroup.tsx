import {FC, PropsWithChildren, useId} from 'react';
import './PartsIndex.css';

type Props = PropsWithChildren<{label: string; start: number}>;

export const PartsIndexGroup: FC<Props> = ({label, start, children}) => {
  const labeled = useId();
  return <>
    <p id={labeled} className="parts-index-group caption uppercase muted-ink">{label}</p>
    <ol aria-labelledby={labeled} className="parts-index-list numbered" start={start}>{children}</ol>
  </>;
};
