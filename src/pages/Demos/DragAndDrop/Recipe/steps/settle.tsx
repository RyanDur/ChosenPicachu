import {FC} from 'react';
import {MotionDial} from '../../../Controls';
import {Codes, Sample, Says, Snippet, Step, Words, lines, carve} from '../../../Recipe';
import {sources} from './sources';

const gap = lines.plain(' ');

export const GlideSettle: FC<{listSource: Sample}> = ({listSource}) =>
  <Step title="Slide every moved item home on release" dial={<MotionDial name="native-motion"/>}>
    <Words want="A lazy settle happens all at once on release, so every item whose place changed has to travel, and the reader should see them all go together.">
      <Says>The list takes its new order at once. Each item whose place changed gets the
        class <code className="monospaced">sliding-in</code> and its own{' '}
      <code className="monospaced">--starts-places-right</code>, its old place minus its new one, so an item that moved
        three places left starts three places to the right. It is the keyframe that slides a crossed item, so every
        moved item slides home together, and the item the reader let go of slides from the place it was lifted
        from.</Says>
      <Says>A reader who asks for less motion gets the new order with no slide.</Says>
    </Words>
    <Codes>
      <Snippet label="HTML" lines={[
        ...carve.span(listSource, 'const slideStart = slideStarts.of(', "style={slideStart.map(places => ({'--starts-places-right': places})).orElse({})}")
      ]}/>
      <Snippet label="TS" lines={[
        ...carve.unit(sources.slideStarts, 'const afterSettle'), gap,
        ...carve.unit(sources.dragSort, 'const settled')
      ]}/>
    </Codes>
  </Step>;
