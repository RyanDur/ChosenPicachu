import {FC} from 'react';
import {Link, useLocation} from 'react-router';
import {useCarriedAddress} from '@pages/Demos/useCarriedAddress';
import {tablesContents} from './contents';

export const TablesMap: FC = () => {
  const {pathname} = useLocation();
  const carried = useCarriedAddress();
  return <nav aria-label="the tables map">
    <p className="paragraph">
      {`Eight parts, about ${tablesContents.minutes} minutes: five that build the live table, then three tutorials that add what the trader asked for. The build you choose on one part carries to the next.`}
    </p>
    <ol className="paragraph">
      {tablesContents.entries.map(({title, to, heading, search}) => <li key={title}>
        {pathname === to
          ? <span aria-current="page">{title}</span>
          : <Link className="signpost" to={carried(to, heading, search)}>{title}</Link>}
      </li>)}
    </ol>
  </nav>;
};
