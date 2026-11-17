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
          ? <Link className="map-entry reachable" to={carried(to, heading, search)} aria-current="page">{title}</Link>
          : <Link className="map-entry signpost reachable" to={carried(to, heading, search)}>{title}</Link>}
      </li>)}
    </ol>
  </nav>;
};
