import {FC} from 'react';
import {MotionDial} from '../../../Controls';
import {carve, Codes, lines, Sample, Says, Snippet, Step, Words} from '../../../Recipe';
import {sources} from './sources';

const blankLine = lines.plain(' ');

export const SlideSettle: FC<{listSource: Sample}> = ({listSource}) =>
  <Step title="Slide every moved item home on release" dial={<MotionDial name="native-motion"/>}>
    <Words want="A lazy settle happens all at once on release, so every item whose place changed has to travel, and the reader should see them all go together.">
      <Says>The list takes its new order at once. Each item whose place changed gets a slide
        class, <code className="monospaced">sliding-in</code> or <code className="monospaced">sliding-in-again</code>,
        whichever it didn’t wear last, and its own{' '}
      <code className="monospaced">--starts-places-right</code>, its old place minus its new one, so an item that moved
        three places left starts three places to the right. The class runs <code className="monospaced">slide-in</code> or{' '}
      <code className="monospaced">slide-in-again</code>, a keyframe animation that names only the state the item
        starts in, and the browser draws the frames from there to
        its place. Every moved item slides home together, and the item the reader let go of slides from the place it was
        lifted from.</Says>
      <Says>A drop is ignored when an item it would move is still sliding from the drop before. The list keeps its order
        and lets go of the item, so no slide jumps partway through.</Says>
      <Says>A reader who asks for less motion gets the new order with no slide.</Says>
    </Words>
    <Codes>
      <Snippet label="TS" lines={[
        ...carve.span(listSource, 'const slideStart = slideStarts.of(', 'onAnimationEnd={() => dispatch(dragSortChange.slid(item))}'), blankLine,
        ...carve.unit(sources.slideStarts, 'const afterSettle'), blankLine,
        ...carve.unit(sources.dragSort, 'const settled')
      ]}/>
      <Snippet label="CSS" lines={[
        ...carve.unit(sources.sortableListCss, '@keyframes slide-in {')
      ]}/>
    </Codes>
  </Step>;
