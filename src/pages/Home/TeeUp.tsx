import {FC} from 'react';
import {Link} from 'react-router';
import {Paths} from '@pages/Paths';

export const TeeUp: FC = () =>
  <p className="tee-up paragraph">
    Someone needs something; the element chooses itself; a design takes shape; the stories
    slice thin; the feature layers on. That is how every page here is built, twice over:
    once with the three languages raw, no framework standing anywhere in the frame, and once
    with React speaking the same three. The projection is the difference, and the history
    above is the argument for keeping the seam visible.{' '}
    <Link className="signpost" to={Paths.demos}>Start where the demos start</Link>: the
    accordions, the tricks we used to do beside what the platform gives us now, and how much
    power there is in knowing what was built for what.
  </p>;
