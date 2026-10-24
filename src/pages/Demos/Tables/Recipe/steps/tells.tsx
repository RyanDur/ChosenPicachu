import {FC} from 'react';
import {Link} from 'react-router';
import {Paths} from '@pages/Paths';
import {DemoTopics} from '../../../types';
import {Codes, Mdn, Snippet, Tell} from '../../../Recipe';
import {withoutImports} from '../../../Recipe/carve';
import {World} from '../../params';
import {Sample} from '@pages/Demos/Recipe/sample';

const sourceOf = (world: World, path: string): string =>
  `${Paths.repo}/${world === 'react' ? 'tree' : 'blob'}/main/src/pages/Demos/Tables/${path}`;

export const TheImplementation: FC<{world: World; react: string; vanilla: string}> = ({world, react, vanilla}) =>
  <Tell>Every block below is carved from the source as it stands, so it cannot drift from the
    build. To read the whole thing in one place, here is <a className="signpost"
    href={sourceOf(world, world === 'react' ? react : vanilla)}
    target="_blank"
    rel="noreferrer">the implementation</a>.</Tell>;

export const TheWholeBuild: FC<{world: World; tableSource: Sample; buildSrc: Sample}> = ({world, tableSource, buildSrc}) =>
  <Codes>
    {world === 'react'
      ? <Snippet label="TS" lines={withoutImports(tableSource)}/>
      : <Snippet label="TS" lines={withoutImports(buildSrc)}/>}
  </Codes>;

export const NamesInTheCode: FC = () =>
  <Tell>A walk is the code’s name for a move made with the arrow keys. A strike is the moment the pointer crosses far
    enough into a neighbour to count. The drift is how far the pointer has moved since the grab. The survey is the one
    measurement taken at the grab: the table’s box, every column’s width, and later the row heights.</Tell>;

export const TwoRoads: FC = () =>
  <Tell>There are two ways to drag something across a page, and I built both. The <Link className="signpost"
    to={`${Paths.demos}?tab=${DemoTopics.dragAndDrop}`}>Drag sort list demo</Link> uses
    the native API, where the platform brings most of the behaviour for very little code;
    its edges (the snapshot that cannot be animated, the cursor that belongs to the
    platform, the macOS cancel) are that demo’s own story. This table uses <Mdn path="Web/API/Pointer_events">pointer events</Mdn>, which leave every pixel of the drag
    to the code, and no drag-and-drop library is anywhere in the build.</Tell>;

export const AgainstTheStream: FC = () =>
  <Tell>The trader needs to move a column while the trades keep landing. I could reorder
    the data itself, but every trade that lands would fight every drag. So the columns and
    the seats are the state, in their order; a trade rewrites a row’s values under its key,
    and the markup renders through them. Moving a column is just changing the
    order. I could ask the DOM where everything is as the pointer moves,
    but layout queries during a drag cause the jank you are trying to avoid. So the lift
    measures everything the drag needs at the grab, as the lift step shows.</Tell>;

export const OwnedPixels: FC<{world: World}> = ({world}) =>
  <Tell>Leaving the pixels to the code does not mean building in JavaScript. The markup stays a
    normal table. Every visible change (the cursors, the hiding, every slide) is a CSS
    rule a class switches on. JavaScript only decides what the state is,
    and {world === 'react'
    ? 'React affords nothing the DOM does not give you'
    : 'there is no framework in the document'}: a move of a node, one element or piece of text in the page’s tree,
    is <Mdn path="Web/API/Node/insertBefore">insertBefore</Mdn>, the handlers are
    events, the state is a value. Each code block below is labelled with which of the
    three languages is doing the work.</Tell>;

export const TurnedVertical: FC = () =>
  <Tell>I could build rows their own machinery, but the need is the same motion
    turned vertical, so rows reuse what the columns built. Three things differ: a grip button to grab, row heights in the survey, and a vertical
    hit test. The promises the dials set carry over unchanged.</Tell>;

export const AccessTrack: FC = () =>
  <Tell>I could build the keyboard its own sorting system, but the state, the clamps
    and the slides already exist. So this track is about access: focus reaches every grip
    and every header, and two arrow keys do everything a drag does.</Tell>;

export const QuietDials: FC = () =>
  <Tell>Two of the dials make no difference here: pace and origin describe a drag session, what happens
    while something is held aloft, and a keyboard nudge holds nothing aloft. Only motion
    still applies, and the motion step below follows that dial’s setting.</Tell>;
