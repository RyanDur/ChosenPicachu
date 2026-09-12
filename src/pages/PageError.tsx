import {FC} from 'react';
import {Link} from 'react-router';
import {Paths} from '@pages/Paths';
import './PageError.css';

export const PageError: FC = () =>
  <section className="closed-room" aria-labelledby="closed-room">
    <h2 id="closed-room" className="title bold">This room is closed.</h2>
    <p className="paragraph">Something in this room broke. The rest of the site is open.</p>
    <Link className="signpost" to={Paths.home}>Back to the front door</Link>
  </section>;
