import {FC} from 'react';
import {DemoTopics} from '@pages/Demos';
import {tableParts} from '../part-pages';
import {Exercise, Slices} from '../../Recipe';
import {TabLink} from '@pages/Demos/TabLink';

export const StorySlices: FC<{headedBy: string}> = ({headedBy}) => <>
  <Slices partPage={{headedBy, whereIs: tableParts.whereIs}} can="The trader can watch the live market over lookbacks they arrange"
    soThat="so that what they compare sits side by side, and what matters most sits on top"
    slices="Too big to build in one motion, so I slice it: the smallest table that honors the shape first, then the flow of data, then each arrangement the trader asked for."
    sliced={[
      ['The trader can read the market in a table', 4],
      ['The trader can watch the market live, one lookback beside another', 5],
      ['The trader can sort by column, and by row', 6],
      ['The trader can sort the lookbacks by any measure, or take the order back', 6],
      ['The trader can widen a column', 6]
    ]}/>
  <Exercise>
    If you want the exercise, stop here and build the story yourself first. The table at the top of
    the <TabLink to={DemoTopics.tables}>tables tab</TabLink> is my interpretation of it, and each slice above links
    to the build of its feature. Read those to see how I built it, or to compare it with yours. They link to MDN,
    Mozilla’s web reference, if you want more.
  </Exercise>
</>;
