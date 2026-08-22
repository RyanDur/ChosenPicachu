import {FC} from 'react';
import {Slices} from '../../Recipe/Arc';

export const StorySlices: FC = () =>
  <Slices who="trader"
          can="The trader can watch the live market in windows they arrange"
          soThat="so that what they compare sits side by side, and what matters most sits on top"
          slices="Too big to build in one motion, so it slices: the smallest table that honors the shape comes first, then the flow of data, then each arrangement the trader asked for. Every card below is one of the slices, and each opens into its build."
          sliced={[
            'The trader can read the market in a table',
            'The trader can watch the market live, in windows',
            'The trader can sort by column, and by row',
            'The trader can sort the windows by any measure, or take the order back',
            'The trader can widen a column'
          ]}/>;
