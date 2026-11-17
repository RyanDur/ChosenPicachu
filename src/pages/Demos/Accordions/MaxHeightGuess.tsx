import {FC} from 'react';
import {lines, Mdn, Snippet} from '../Recipe';
import {OneGuessTwoFolds} from './Diagrams';
import {PartLink} from './PartLink';
import {RemembersTheFoldLink} from './RemembersTheFoldLink';
import '../Runs.css';
import './PartDepth.css';

export const MaxHeightGuess: FC = () => <>
  <p className="paragraph">This part builds on “<PartLink part="a-box-remembers-the-fold"/>”, for the known height
    and the rule that shows the panel.</p>
  <p className="paragraph">When the height isn’t known ahead of time, most of us slid a fold open with a
    guess. A <RemembersTheFoldLink>transition</RemembersTheFoldLink> moves a property over a set time, but it
    can’t move a height to auto, the height the text needs, so we moved the
    panel’s <Mdn path="Web/CSS/max-height">max-height</Mdn> instead,
    from 0 to a number taller than any fold would need, such as 1000px. The panel stopped at its own text, so
    nothing scrolled. The cost was the timing. The transition spent its whole time crossing the guess, so a short
    fold opened in a rush and then sat still, and on closing it waited, unmoving, until the guess fell to its
    text. The bigger the guess, the worse the rush and the wait. A guess too small cut the text off.</p>
  <Snippet label="CSS" lines={[
    lines.plain('.info {'),
    lines.plain('  max-height: 0;'),
    lines.plain('  overflow: hidden;'),
    lines.plain('  transition: max-height .3s ease-in-out;'),
    lines.plain('}'),
    lines.blank,
    lines.plain('.info-toggle:checked ~ .info {'),
    lines.plain('  max-height: 1000px;'),
    lines.plain('}')
  ]}/>
  <OneGuessTwoFolds/>
</>;
