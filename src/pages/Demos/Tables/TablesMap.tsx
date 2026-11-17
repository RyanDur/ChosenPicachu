import {FC} from 'react';
import {Link, useLocation} from 'react-router';
import {useCarriedAddress} from '@pages/Demos/useCarriedAddress';
import {tablesContents} from './contents';
import {TablesSize} from './TablesSize';

export const TablesMap: FC = () => {
  const {pathname} = useLocation();
  const carried = useCarriedAddress();
  return <nav aria-label="the tables map">
    <TablesSize/>
    <ol className="paragraph">
      {tablesContents.entries.map(({title, to, heading, search}) => <li key={title}>
        {pathname === to
          ? <span aria-current="page">{title}</span>
          : <Link className="signpost" to={carried(to, heading, search)}>{title}</Link>}
      </li>)}
    </ol>
  </nav>;
};
