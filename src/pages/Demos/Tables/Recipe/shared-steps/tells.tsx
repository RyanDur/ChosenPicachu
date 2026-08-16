import {ReactNode} from 'react';
import {Link} from 'react-router';
import {Paths} from '@pages/Paths';
import {DemoTopics} from '../../../types';
import {Mdn, Tell} from '../../../Recipe';
import {World} from '../../params';

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

export const ownedPixels = (world: World): ReactNode =>
  <Tell>And owning the pixels does not mean building in JavaScript. The markup stays a
    normal table; every visible change (the cursors, the hiding, every slide) is a CSS
    rule a class switches on; JavaScript only decides what the state is,
    and {world === 'react'
      ? 'React affords nothing the DOM does not give you'
      : 'no framework stands anywhere in the frame'}: the node moves
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
