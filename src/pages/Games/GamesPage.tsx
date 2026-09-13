import {FC} from 'react';
import {Link} from 'react-router';
import {GamePaths} from './GamePaths';

export const GamesPage: FC = () =>
  <nav className="prose" aria-label="games">
    <p className="paragraph">One game so far.</p>
    <Link className="signpost" to={GamePaths.colorGame}>Three in a row</Link>
  </nav>;
