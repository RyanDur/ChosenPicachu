import {FC, PropsWithChildren} from 'react';
import {Link} from 'react-router';
import {Paths} from '@pages/Paths';
import {DemoTopics, demoAddress} from '@pages/Demos/types';

export const TeeUp: FC<PropsWithChildren> = ({children}) =>
  <footer className="tee-up">
    <p className="sub-title">
      The record ends here and the practice begins. Each feature on this site starts from what someone needs. The clues
      in that need point at an element the platform already has; the design is built around that element, cut into thin
      stories, and built one story at a time, and every page here was built that way. How each concern is organized, and
      why, is on <Link className="signpost" to={Paths.practice}>the Practice page</Link>, one tab for each.
    </p>
    <p className="sub-title">
      The Demos put that practice to work on the site’s own code. <Link className="signpost"
        to={demoAddress(DemoTopics.tables)}>The tables are built twice</Link>, once in plain HTML, CSS and
      JavaScript with no framework and once in React on the same three, so the line between the platform and a framework
      stays visible, and the history above is why that line matters: what a framework had to do keeps moving into the
      platform. <Link className="signpost" to={demoAddress(DemoTopics.accordions)}>The accordions</Link> set
      the trick used before the platform could do the job beside what it does now. Knowing what each element was built
      for is most of the work.
    </p>
    {children}
  </footer>;
