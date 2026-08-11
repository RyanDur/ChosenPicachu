import {ReactNode} from 'react';
import * as D from 'schemawax';
import {Link} from 'react-router';
import {Paths} from '@pages/Paths';
import {DemoTopics} from '../../types';
import {Codes, Mdn, Says, Snippet, Step, Tell, Words, aside, plain} from '../../Recipe';
import {unit} from '../../Recipe/carve';
import {SlotsFigure} from './SlotsFigure';
import aloftSource from '@components/DragSortableTable/Aloft.tsx?raw';
import surveySource from '@components/DragSortableTable/survey.ts?raw';
import gripSource from '@components/DragSortableTable/RowGrip.tsx?raw';
import ghostSource from '@components/DragSortableTable/ghosts/Ghost.tsx?raw';
import sortableCss from '@components/DragSortableTable/sortable.css?raw';
import headerCss from '@components/DragSortableTable/Header.css?raw';
import ghostCss from '@components/DragSortableTable/ghosts/Ghost.css?raw';

export {aloftSource, surveySource, gripSource, ghostSource, sortableCss, headerCss, ghostCss};

export type Track = 'pointer' | 'keyboard';

export const trackParam: D.Decoder<Track> = D.literalUnion('pointer', 'keyboard');

export type Dials = Record<'pace' | 'origin' | 'motion', ReactNode>;

export const gap = plain(' ');

export const twoRoads =
  <Tell>There are two roads to dragging something across a page, and this site walks
    both. The <Link className="signpost"
    to={`${Paths.demos}?tab=${DemoTopics.dragAndDrop}`}>Drag sort list demo</Link> takes
    the native API, where the platform brings most of the behavior for very little code;
    its edges (the snapshot that cannot be animated, the cursor that belongs to the
    platform, the macOS cancel) are that road’s own story. This table takes the other
    road: <Mdn path="Web/API/Pointer_events">pointer events</Mdn>, where every pixel is
    ours to own and no drag-and-drop library is anywhere in the build.</Tell>;

export const againstTheStream =
  <Tell>The trader needs to move a column while the stream writes. We could reorder
    the data itself, but every trade that lands would fight every drag; so the order is
    its own piece of state, and the markup renders through it. Moving a column is just
    changing the order. We could ask the DOM where everything is as the pointer moves,
    but layout queries during a drag cause the jank we are trying to avoid; so
    everything the drag needs gets measured once, when you grab.</Tell>;

export const ownedPixels =
  <Tell>And owning the pixels does not mean building in JavaScript. The markup stays a
    normal table; every visible change (the cursors, the hiding, every slide) is a CSS
    rule a class switches on; JavaScript only decides what the state is, and React
    affords nothing the DOM does not give you: the node moves
    are <Mdn path="Web/API/Node/insertBefore">insertBefore</Mdn>, the handlers are
    events, the state is a value. Each code block below is labeled with which of the
    three languages is doing the work.</Tell>;

export const turnedVertical =
  <Tell>We could build rows their own machinery, but the need is the same motion
    turned vertical; so rows ride what the columns built. The differences that remain
    are honest ones: a grip button to grab, row heights in the survey, and a vertical
    hit test. The promises the dials set ride along unchanged; the turn changes the
    axis, nothing else.</Tell>;

export const accessTrack =
  <Tell>We could build the keyboard its own sorting system, but the state, the clamps,
    and the slides already exist; so this track is about access. Focus reaches every grip
    and every header, and two arrow keys get everything the hand has.</Tell>;

export const quietDials =
  <Tell>Two of the dials go quiet here: pace and origin describe a drag session, what happens
    while something is held aloft, and a keyboard nudge holds nothing aloft. Only motion
    still chooses, and the marked step below is written the way that dial sits.</Tell>;

export const cssShare =
  <Step title="Let CSS carry its share">
    <Words want="Whatever the trader arrives with (mouse, touchscreen, keyboard), the platform’s manners come first: cursors that offer the hand, touch that drags, selections that never smear mid-drag.">
      <Says>The markup stays honest HTML, a real table with real headers, so the semantics come
        free: the row grip is a button that reorders rows from the arrow keys without a line of
        drag code, and the resize handle is
        a real <Mdn path="Web/HTML/Element/button">button</Mdn> that announces itself by
        name, and its share once the ledger exists.</Says>
      <Says>CSS carries more of the effect than it appears: the open hand and the closed fist
        are <Mdn path="Web/CSS/cursor">cursors</Mdn>, <Mdn path="Web/CSS/touch-action">touch-action</Mdn>:
        none is the single line that lets pointer events drag on a touchscreen,
        and <Mdn path="Web/CSS/user-select">user-select</Mdn>: none keeps a fast drag from sweeping
        text selections. JavaScript is left holding only what neither can: one measurement, some
        arithmetic, and the order.</Says>
    </Words>
    <Codes>
      <Snippet label="HTML" lines={[
        plain('<table><thead><tr><th scope="col">window</th> ...'),
        plain('<button className="grip" aria-label="move row 2"><Handle/></button>'),
        plain('<button className="resize-handle" aria-label="resize trades, 24%"/>')
      ]}/>
      <Snippet label="CSS" lines={[
        ...unit(sortableCss, '.grabbable {'), gap,
        ...unit(sortableCss, '.sortable {')
      ]}/>
      <Snippet label="JS" lines={[
        aside('// one measurement, slot arithmetic, and the order; nothing else')
      ]}/>
    </Codes>
  </Step>;

export const deadZone =
  <Step title="Find the neighbour under the pointer, with a dead zone">
    <Words want="A drift along a boundary must not chatter the order under the hand.">
      <Says>This step is JavaScript alone, on purpose: where the pointer is, in table terms,
        is a walk over cumulative column widths: arithmetic on the survey,
        never <Mdn path="Web/API/Document/elementFromPoint">elementFromPoint</Mdn>. A{' '}
        neighbour only yields once the pointer reaches its inner half: the outer quarter is a
        dead zone, without which the reorder oscillates when a wide column passes a narrow one.
        After a swap the pointer sits over the carried column itself, a no-op, so reversing
        means deliberately reaching the neighbour’s inner half again. Hysteresis, for free,
        from geometry. The ruling itself is struckPast, one function with no axis in it; the
        vertical turn will reuse it unchanged.</Says>
      <SlotsFigure/>
    </Words>
    <Codes>
      <Snippet label="JS" lines={[
        ...unit(surveySource, 'const deadZone = '), gap,
        ...unit(surveySource, 'const struckPast = '), gap,
        ...unit(surveySource, 'export const columnUnder')
      ]}/>
    </Codes>
  </Step>;
