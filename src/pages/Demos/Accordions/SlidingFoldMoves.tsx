import {FC} from 'react';
import {FoldType} from '../ReaderSettings';
import {Fold} from './accordion-props';
import {PlatformExhibit} from './PlatformExhibit';
import {carve, Mdn, Snippet} from '../Recipe';
import {looks} from './looks';
import {RemembersTheFoldLink} from './RemembersTheFoldLink';
import resetCss from '../../../styles/reset.css?sample';
import '../Runs.css';

export const SlidingFoldMoves: FC<{folds: Record<FoldType, Fold[]>}> = ({folds}) => <>
  <PlatformExhibit folds={folds}/>
  <ol className={looks.runs}>
    <li className="run">
      <p className="paragraph">Every fold that slides on this tab’s pages moves by transition, never by animation,
        because a reader may press again before the fold lands. If they do,
        a <RemembersTheFoldLink>transition</RemembersTheFoldLink> turns around from wherever it is.
        An <Mdn path="Web/CSS/CSS_animations">animation</Mdn> plays a set of keyframes, the values a property passes
        through, on its own clock, whatever the state does.</p>
    </li>
    <li className="run">
      <p className="paragraph">When a reader asks
        for <Mdn path="Web/CSS/@media/prefers-reduced-motion">less motion</Mdn>, every fold opens with no slide. The
        reset, the style sheet that sets every element’s defaults, has a reduced-motion block with three rules.
        The first lists the universal selector, *, which picks every element, and *::before and *::after, which
        reach their before and after. It sets each transition’s duration to zero, cuts each animation to 0.01
        milliseconds, plays each animation once, and turns smooth scrolling into a jump. The second
        names ::details-content, the part a details hides, which the universal selector cannot reach. The third sets
        view transitions, the browser’s moves from one page state to the next, to no animation at all.</p>
      <Snippet label="CSS" lines={carve.unit(resetCss, '@media (prefers-reduced-motion: reduce) {')}/>
    </li>
    <li className="run">
      <p className="paragraph">A fold’s transition has no delay, so with no duration it has no middle: the
        change lands whole in one frame, one picture the browser draws. One that ran even for an instant
        would show the old state for a frame, and a fold’s text would arrive after the fold had opened.</p>
    </li>
  </ol>
</>;
