import {FC} from 'react';
import {Link} from 'react-router';
import {Paths} from '@pages/Paths';
import './PageError.css';

export const NoRoom: FC = () =>
  <section className="closed-room" aria-labelledby="no-room">
    <h2 id="no-room" className="title bold">There is no room at this address.</h2>
    <p className="paragraph">Nothing was built here. The rest of the site is open.</p>
    <Link className="signpost" to={Paths.home}>Back to the front door</Link>
  </section>;
