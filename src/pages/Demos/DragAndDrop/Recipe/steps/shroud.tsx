import {FC} from 'react';
import {OriginDial} from '../../../Controls';
import {Codes, Mdn, Says, Snippet, Step, Words, aside} from '../../../Recipe';
import {span, unit} from '../../../Recipe/carve';
import {gap, hideItemCss} from './sources';
import {Sample} from '@pages/Demos/Recipe/sample';

export const FadeOrigin: FC<{itemSource: Sample}> = ({itemSource}) =>
  <Step title="Fade the lifted card almost away" dial=<OriginDial name="native-origin"/>>
    <Words want="With the drag image under the pointer, the card it came from reads as a duplicate, but removing it can end the drag: some engines stop the drag when its source disappears.">
      <Says>So the card does not disappear; it fades almost away. This is the hide list, so its own Item adds the class
        on its lift and removes it on its release. The CSS behind the class is an{' '}
      <Mdn path="Web/CSS/opacity">opacity</Mdn> of nearly nothing: the node stays in the page, the drag keeps its
        source, and the reader sees one card moving with the pointer.</Says>
    </Words>
    <Codes>
      <Snippet label="TS" lines={[
        ...span(itemSource, 'updateHide(true);', 'updateHide(true);'), gap,
        ...span(itemSource, 'updateHide(false);', 'updateHide(false);')
      ]}/>
      <Snippet label="CSS" lines={[
        ...unit(hideItemCss, '.draggable.hide {'),
        aside('/* opacity, not visibility: a source hidden by visibility counts as gone, and some engines end the drag */')
      ]}/>
    </Codes>
  </Step>;

export const KeepStanding: FC<{listSource: Sample}> = ({listSource}) =>
  <Step title="Leave the lifted card where it was" dial=<OriginDial name="native-origin"/>>
    <Words want="A card that vanishes can be disorienting; sometimes the reader wants to see the card both where it was and where it is going.">
      <Says>Do nothing. This is the keep list, so its Item is the plain card: the browser already drew the drag image,
        so for the length of the drag there are two of the card, one in place and one dimmed under the pointer, and no
        hiding code exists in its directory.</Says>
    </Words>
    <Codes>
      <Snippet label="HTML" lines={[
        ...span(listSource, '<KeepItem key={item}', '<KeepItem key={item}'),
        aside('{/* no hiding wiring exists in this list; nothing to erase */}')
      ]}/>
    </Codes>
  </Step>;
