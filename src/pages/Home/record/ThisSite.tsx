import {FC} from 'react';
import {Moment} from './Moment';

export const ThisSite: FC = () =>
  <Moment year="Today"
          title="This site carries it on"
          tells={<>Three languages, three responsibilities, in concert. Every demo here builds a real
            feature on that architecture, twice: once with the three languages raw, and once with
            React speaking the same three.</>}>
            <p className="paragraph">The demos here take a position in that history: every feature is built twice,
    once with the three languages raw, no framework standing anywhere in the frame, and
    once with React speaking the same three.</p>
    <p className="paragraph">The two builds share their state machine, their listeners, and their markup
    shape; the projection is the difference. What React renders, the vanilla build
    reconciles by hand, and the tutorials walk both so the seam is visible.</p>
    <p className="paragraph">If the history above is the argument, the two worlds are the demonstration:
    whatever tool stands between you and the page, the page is still structure,
    presentation, and behavior, and it rewards being written that way.</p>
  </Moment>;
