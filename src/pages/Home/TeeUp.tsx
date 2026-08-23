import {FC} from 'react';
import {Link} from 'react-router';
import {Paths} from '@pages/Paths';

export const TeeUp: FC = () =>
  <p className="tee-up paragraph">
    Someone needs something; the element chooses itself; a design takes shape; the stories
    slice thin; the feature layers on. That is how every page here is built.{' '}
    <Link className="signpost" to={Paths.demos}>Start where the demos start</Link>: the
    accordions, the tricks we used to do beside what the platform gives us now, and how much
    power there is in knowing what was built for what.
  </p>;
