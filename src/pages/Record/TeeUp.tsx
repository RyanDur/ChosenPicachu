import {FC, PropsWithChildren} from 'react';
import {Link} from 'react-router';
import {Paths} from '@pages/Paths';

export const TeeUp: FC<PropsWithChildren> = ({children}) =>
  <footer className="tee-up">
    <p className="sub-title">
      Someone needs something; the clues point at an element; a design takes shape; the stories
      are cut thin; the feature is built on them. That is how every page here is built.
    </p>
    <p className="sub-title">
      The tables are built twice: once with the three languages raw, no framework anywhere in the
      frame, and once in React with the same three underneath. The history above is the argument
      for keeping that seam visible.
    </p>
    <p className="sub-title">
      <Link className="signpost" to={Paths.demos}>Start where the demos start</Link>: the
      accordions, the tricks we used to do beside what the platform gives us now, and how
      much power there is in knowing what was built for what.
    </p>
    {children}
  </footer>;
