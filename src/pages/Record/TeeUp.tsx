import {FC, PropsWithChildren} from 'react';
import {Link} from 'react-router';
import {Paths} from '@pages/Paths';

export const TeeUp: FC<PropsWithChildren> = ({children}) =>
  <footer className="tee-up">
    <p className="sub-title">
      I start from what someone needs. The clues in that need point at an element the platform already has. I design
      around the element, cut the design into thin stories, and build the feature one story at a time. Every page here
      was built that way.
    </p>
    <p className="sub-title">
      The tables are built twice: once in plain HTML, CSS and JavaScript with no framework, and once in React on the
      same three. I keep both so the line between the platform and the framework stays visible. The history above is
      why that line matters: what a framework had to do keeps moving into the platform.
    </p>
    <p className="sub-title">
      <Link className="signpost" to={Paths.demos}>Start where the demos start</Link>, with the accordions, which set
      the trick we used before beside what the platform gives now. Knowing what each element was built for is most of
      the work.
    </p>
    {children}
  </footer>;
