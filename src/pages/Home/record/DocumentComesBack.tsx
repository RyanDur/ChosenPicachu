import {FC} from 'react';
import {Moment} from './Moment';

export const DocumentComesBack: FC = () =>
  <Moment year="2016"
          title="The document comes back"
          tells={<>The correction this time was about where. Server-side rendering returned,
            sending real HTML first and attaching behavior after; static generation, islands, and
            server components are the same instinct refined: the document first, the program only
            where the page needs one.</>}>
            <p className="paragraph">Next.js made server rendering the default posture of a React app in 2016; static
    generation pre-rendered what never changes;{' '}
    <a className="signpost" href="https://web.dev/rendering-on-the-web/">hydration</a> attached listeners
    to markup that already stood. The first paint became HTML again, and the program
    arrived second.</p>
    <p className="paragraph">Katie Sylor-Miller coined the island and{' '}
    <a className="signpost" href="https://jasonformat.com/islands-architecture/">Jason Miller documented
    the architecture</a>: pages shipped as HTML with script only where an island of behavior
    lives, the static parts left as the documents they always were. Server components,
    announced in 2020 and stable by 2023, moved rendering back across the wire
    entirely.</p>
    <p className="paragraph">Every step is the same sentence: structure and content travel as HTML, behavior
    arrives as script, presentation stays declarative. The pendulum swings on where the
    work happens; the three responsibilities do not move.</p>
  </Moment>;
