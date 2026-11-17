import {FC} from 'react';
import {Link, useLocation} from 'react-router';
import {useCarriedAddress} from '@pages/Demos/useCarriedAddress';
import {tablesBook} from './tables-book';
import {TablesSize} from './TablesSize';
import './TablesMap.css';

export const TablesMap: FC = () => {
  const {pathname} = useLocation();
  const carried = useCarriedAddress();
  return <nav aria-label="the tables map">
    <TablesSize/>
    <ol className="paragraph">
      {tablesBook.signposts.map(({title, to, heading, search}) => <li key={title}>
        {pathname === to
          ? <span className="map-entry reachable" aria-current="page">{title}</span>
          : <Link className="map-entry signpost reachable" to={carried(to, heading, search)}>{title}</Link>}
      </li>)}
    </ol>
  </nav>;
};
