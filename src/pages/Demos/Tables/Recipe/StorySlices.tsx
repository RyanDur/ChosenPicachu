import {FC} from 'react';
import {DemoTopics} from '@pages/Demos';
import {TablePart, tableParts} from '../part-pages';
import {Tutorial, tableTutorials} from '../tutorial-pages';
import {Place} from '@pages/Demos/useCarriedAddress';
import {Exercise, Slices} from '../../Recipe';
import {TabLink} from '@pages/Demos/TabLink';

const atPart = (part: TablePart): [number, Place] => [tableParts.told(part).ordinal, {to: tableParts.addressOf(part)}];

const atTutorial = (tutorial: Tutorial): [number, Place] =>
  [tableTutorials.ordinalOf(tutorial), {to: tableTutorials.addressOf(tutorial)}];

const placed: [string, number, Place][] = [
  ['The trader can read the market in a table', ...atPart('the-still-table')],
  ['The trader can watch the market live, one lookback beside another', ...atPart('the-live-table-and-the-store')],
  ['The trader can sort by column, and by row', ...atTutorial('sort')],
  ['The trader can sort the lookbacks by any measure, or take the order back', ...atTutorial('menu')],
  ['The trader can widen a column', ...atTutorial('resize')]
];

export const StorySlices: FC = () => <>
  <Slices onAPartPage can="The trader can watch the live market over lookbacks they arrange"
    soThat="so that what they compare sits side by side, and what matters most sits on top"
    slices="Too big to build in one motion, so I slice it: the smallest table that honors the shape first, then the flow of data, then each arrangement the trader asked for."
    sliced={placed}/>
  <Exercise>
    If you want the exercise, stop here and build the story yourself first. The table at the top of
    the <TabLink to={DemoTopics.tables}>tables tab</TabLink> is my interpretation of it, and each slice above links
    to the build of its feature. Read those to see how I built it, or to compare it with yours. They link to MDN,
    Mozilla’s web reference, if you want more.
  </Exercise>
</>;
