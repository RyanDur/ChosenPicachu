import {ReactNode} from 'react';
import {OriginDial} from '../../../Controls';
import {Codes, Mdn, Says, Snippet, Step, Words, aside} from '../../../Recipe';
import {span, unit} from '../../../Recipe/carve';
import {gap} from './sources';

export const fadeOrigin = (itemSource: string, cssSource: string): ReactNode =>
  <Step title="Fade the origin to a whisper" dial={<OriginDial name="native-origin"/>}>
    <Words want="With the snapshot in hand, the origin card reads as a duplicate, but truly vanishing it can kill the drag: some engines end the session when its source disappears.">
      <Says>So the origin does not vanish; it fades to a whisper. This is the hide list, so
        its own Item dresses itself on its own lift and undresses on its own release. The CSS behind the class is
        an <Mdn path="Web/CSS/opacity">opacity</Mdn> of nearly nothing: the node stays alive, the
        session keeps its source, and the eye reads a single card riding the pointer.</Says>
    </Words>
    <Codes>
      <Snippet label="TS" lines={[
        ...span(itemSource, 'updateHide(true);', 'updateHide(true);'), gap,
        ...span(itemSource, 'updateHide(false);', 'updateHide(false);')
      ]}/>
      <Snippet label="CSS" lines={[
        ...unit(cssSource, '.sortable-list .hide {'),
        aside('/* not visibility; the session dies with its source */')
      ]}/>
    </Codes>
  </Step>;

export const keepStanding = (listSource: string): ReactNode =>
  <Step title="Leave the origin standing" dial={<OriginDial name="native-origin"/>}>
    <Words want="A vanished origin can disorient; sometimes the eye wants the card both at rest and in hand while it decides.">
      <Says>Do nothing. This is the keep list, so its Item is the plain card: the platform
        already drew the snapshot, there are two of the card for the length of the drag, one
        at rest, one dimmed under the pointer, and no hiding code exists in its directory at all.</Says>
    </Words>
    <Codes>
      <Snippet label="HTML" lines={[
        ...span(listSource, '<Item item={item}', '<Item item={item}'),
        aside('{/* no hiding wiring exists in this list; nothing to erase */}')
      ]}/>
    </Codes>
  </Step>;
