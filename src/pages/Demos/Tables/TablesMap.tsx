import {FC} from 'react';
import {NavLink} from 'react-router';
import {useCarriedAddress} from '@pages/Demos/useCarriedAddress';
import {tablesBook} from './tables-book';
import {TablesSize} from './TablesSize';
import './TablesMap.css';

const mapEntry = ({isActive}: {isActive: boolean}): string =>
  isActive ? 'map-entry reachable' : 'map-entry signpost reachable';

export const TablesMap: FC = () => {
  const carried = useCarriedAddress();
  return <nav aria-label="the tables map">
    <TablesSize/>
    <ol className="paragraph">
      {tablesBook.signposts.map(({title, to, heading, search}) => <li key={title}>
        <NavLink className={mapEntry} to={carried(to, heading, search)} end>{title}</NavLink>
      </li>)}
    </ol>
  </nav>;
};
