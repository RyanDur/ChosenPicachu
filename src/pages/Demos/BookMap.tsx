import {FC, ReactNode} from 'react';
import {NavLink} from 'react-router';
import {Place, useCarriedAddress} from './useCarriedAddress';
import './BookMap.css';

export type MapEntry = Place & {title: string};

type Props = {
  label: string;
  size: ReactNode;
  entries: readonly MapEntry[];
};

const mapEntry = ({isActive}: {isActive: boolean}): string =>
  isActive ? 'map-entry reachable' : 'map-entry signpost reachable';

export const BookMap: FC<Props> = ({label, size, entries}) => {
  const carried = useCarriedAddress();
  return <nav aria-label={label}>
    {size}
    <ol className="paragraph">
      {entries.map(({title, to, heading}) => <li key={title}>
        <NavLink className={mapEntry} to={carried(to, heading)} end>{title}</NavLink>
      </li>)}
    </ol>
  </nav>;
};
