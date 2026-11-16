import {FC} from 'react';
import {OriginDial} from '../../../Controls';
import {Codes, Says, Sample, Snippet, DialStep, StepHeading, Want, Words, lines, carve} from '../../../Recipe';

export const KeepStanding: FC<{listSource: Sample}> = ({listSource}) =>
  <DialStep>
    <StepHeading title="Leave the lifted card where it was"><OriginDial name="native-origin"/></StepHeading>
    <Words>
      <Want>A card that vanishes can be disorienting; sometimes the reader wants to see the card both where it was and
        where it is going.</Want>
      <Says>Do nothing. This is the keep list, so its <code className="monospaced">Item</code> is the plain card. The
        browser already drew the drag image, so for the length of the drag there are two of the card, one in place and
        one dimmed under the pointer. <code className="monospaced">KeepItem</code> has no hiding code.</Says>
    </Words>
    <Codes>
      <Snippet label="HTML" lines={[
        ...carve.span(listSource, '<KeepItem key={item}', '<KeepItem key={item}'),
        lines.aside('{/* no hiding wiring exists in this list; nothing to erase */}')
      ]}/>
    </Codes>
  </DialStep>;
