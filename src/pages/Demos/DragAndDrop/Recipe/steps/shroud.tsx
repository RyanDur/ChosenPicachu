import {FC} from 'react';
import {OriginDial} from '../../../Controls';
import {Codes, Mdn, Sample, Says, Snippet, Step, Words, lines, carve} from '../../../Recipe';
import {sources} from './sources';

const gap = lines.plain(' ');

export const FadeOrigin: FC<{itemSource: Sample}> = ({itemSource}) =>
  <Step title="Fade the lifted card almost away" dial={<OriginDial name="native-origin"/>}>
    <Words want="With the drag image under the pointer, the card it came from reads as a duplicate, but removing it can end the drag: some engines stop the drag when its source disappears.">
      <Says>So the card does not disappear; it fades almost away. This is the hide list, so its own Item adds the class
        on its lift and removes it on its release. The CSS behind the class is an{' '}
      <Mdn path="Web/CSS/opacity">opacity</Mdn> of nearly nothing: the node stays in the page, the drag keeps its
        source, and the reader sees one card moving with the pointer.</Says>
    </Words>
    <Codes>
      <Snippet label="TS" lines={[
        ...carve.span(itemSource, 'updateHide(true);', 'updateHide(true);'), gap,
        ...carve.span(itemSource, 'updateHide(false);', 'updateHide(false);')
      ]}/>
      <Snippet label="CSS" lines={[
        ...carve.unit(sources.hideItemCss, '.draggable.hide {'),
        lines.aside('/* opacity, not visibility: a card hidden by visibility is out of view, and so is the drag’s source */')
      ]}/>
    </Codes>
  </Step>;
