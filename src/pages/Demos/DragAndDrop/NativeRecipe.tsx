import {FC} from 'react';
import {Link} from 'react-router';
import {PillGlider} from '@components/PillGlider';
import {Paths} from '@pages/Paths';
import {DemoTopics} from '../types';
import {ControlsProps, Motion, Origin, Pace} from '../Controls';
import {StepEntry, StepList, aside, plain} from '../Recipe';
import {span, unit} from '../Recipe/carve';
import draggableSource from './Draggable.tsx?raw';
import hideSource from './HideOnDrag.tsx?raw';
import crossingSource from './crossing.ts?raw';
import glideSource from '@components/glide.ts?raw';
import hideCss from './HideOnDrag.css?raw';
import pushedCss from './pushed.css?raw';
import eagerKeepStatic from './lists/EagerKeepStaticList.tsx?raw';
import eagerKeepAnimated from './lists/EagerKeepAnimatedList.tsx?raw';
import eagerHideStatic from './lists/EagerHideStaticList.tsx?raw';
import eagerHideAnimated from './lists/EagerHideAnimatedList.tsx?raw';
import lazyKeepStatic from './lists/LazyKeepStaticList.tsx?raw';
import lazyKeepAnimated from './lists/LazyKeepAnimatedList.tsx?raw';
import lazyHideStatic from './lists/LazyHideStaticList.tsx?raw';
import lazyHideAnimated from './lists/LazyHideAnimatedList.tsx?raw';
import '../Recipe/Recipe.css';

const gap = plain('');

const listSources: Record<Pace, Record<Origin, Record<Motion, string>>> = {
  eager: {
    keep: {animated: eagerKeepAnimated, static: eagerKeepStatic},
    hide: {animated: eagerHideAnimated, static: eagerHideStatic}
  },
  lazy: {
    keep: {animated: lazyKeepAnimated, static: lazyKeepStatic},
    hide: {animated: lazyHideAnimated, static: lazyHideStatic}
  }
};

type Step = Omit<StepEntry, 'dial'> & {
  dial?: 'pace' | 'origin' | 'motion';
};

const paced = (pace: Pace, source: string): Step => pace === 'eager'
  ? {
    title: 'Commit inside the crossing',
    dial: 'pace',
    want: 'You want the list to answer the drag as it happens; waiting for the drop hides the outcome until it is too late to change your mind.',
    says: ['Commit the reorder inside the dragover that detected the crossing — the state updates ' +
      'mid-drag, the markup renders through it, and the same key finds its new seat while the ' +
      'platform still holds the snapshot in your hand. Carrying the item back is just more ' +
      'crossings, so home stays reachable.'],
    code: [
      {label: 'JS', lines: [
        ...unit(source, 'onDragOver={event => {')
      ]}
    ]
  }
  : {
    title: 'Stash the landing, settle after the drag',
    dial: 'pace',
    want: 'You want the list calm while the platform drags, which means the reorder must wait for a session that is still alive when the drop lands.',
    says: ['Each dragover only remembers where the pointer last hovered, and a dragleave forgets ' +
      'it. The commit runs from the release — the session has to finish before the list moves, ' +
      'because the platform is still animating its own end of the bargain.'],
    code: [
      {label: 'JS', lines: [
        ...span(source, 'onDragOver={() => setLanding(index)}', 'onDragOver={() => setLanding(index)}'), gap,
        ...unit(source, 'onReleased={() => {')
      ]}
    ]
  };

const shown = (origin: Origin, source: string): Step => origin === 'hide'
  ? {
    title: 'Fade the origin to a whisper',
    dial: 'origin',
    want: 'With the snapshot in hand, the origin card reads as a duplicate — but truly vanishing it can kill the drag, because some engines end the session when its source disappears.',
    says: ['So the origin does not vanish; it fades to a whisper. This is the hide list, so its ' +
      'item is HideOnDrag — the element that dresses itself on its own lift and undresses on ' +
      'its own release. The CSS behind the class is an opacity of nearly nothing: the node ' +
      'stays alive, the session keeps its source, and the eye reads a single card riding the ' +
      'pointer.'],
    code: [
      {label: 'JS', lines: [
        ...unit(hideSource, 'export const HideOnDrag')
      ]},
      {label: 'CSS', lines: [
        ...unit(hideCss, '.sortable-list .hide {'),
        aside('/* not visibility — the session dies with its source */')
      ]}
    ]
  }
  : {
    title: 'Leave the origin standing',
    dial: 'origin',
    want: 'A vanished origin can disorient; sometimes the eye wants the card both at rest and in hand while it decides.',
    says: ['Do nothing. This is the keep list, so its item is the plain Draggable: the platform ' +
      'already drew the snapshot, there are two of the card for the length of the drag — one ' +
      'at rest, one dimmed under the pointer — and no hiding code exists in this file at all.'],
    code: [
      {label: 'HTML', lines: [
        ...span(source, '<Draggable item={item}', '<Draggable item={item}'),
        aside('{/* no hiding wiring exists in this list — nothing to erase */}')
      ]}
    ]
  };

const moved = (motion: Motion, pace: Pace, source: string): Step => motion === 'static'
  ? {
    title: 'Apply the state update directly',
    dial: 'motion',
    want: 'Motion is not free: it competes with the drag session, costs a frame budget, and some users ask for none at all.',
    says: ['This is the static list — no marking code exists in it. The order applies and React ' +
      'paints next frame; a keyboard walk is applied as plainly as everything else.'],
    code: [
      {label: 'JS', lines: [
        ...span(source, 'onArranged={setOrder}', 'onArranged={setOrder}'),
        aside('// nothing marked, nothing competing with the session')
      ]}
    ]
  }
  : pace === 'eager'
    ? {
      title: 'Slide the crossed item home',
      dial: 'motion',
      want: 'An eager swap that teleports is hard to follow, yet nothing can be animated mid-session by view transitions — the capture would swallow the drag’s own events.',
      says: ['The swap commits instantly and the crossed item is merely drawn where it used to ' +
        'be, sliding home on a keyframe whose from is one seat over — the same theater the ' +
        'table plays, turned horizontal, with the direction as data: --toward flips the sign ' +
        'of one keyframe instead of naming two.'],
      code: [
        {label: 'JS', lines: [
          ...span(source, "setPushed({[item]: homeward ? 'right' : 'left'});",
            "setPushed({[item]: homeward ? 'right' : 'left'});")
        ]},
        {label: 'CSS', lines: [
          ...unit(pushedCss, '.sortable-list .pushed {'), gap,
          ...unit(pushedCss, '@keyframes pushed')
        ]}
      ]
    }
    : {
      title: 'Glide the settle, one tick after',
      dial: 'motion',
      want: 'A lazy settle happens all at once on release — the perfect moment for a view transition, except the drag session is still alive when the drop fires, and a capture mid-session swallows its events.',
      says: ['Name each item for the transition and defer the settle one tick past the release. ' +
        'By the time startViewTransition captures the page, the platform has finished its ' +
        'ceremony, and every item glides from where the drag left it to where the order says ' +
        'it belongs.'],
      code: [
        {label: 'HTML', lines: [
          ...span(source, 'viewTransitionName: `sort-${item}`', 'viewTransitionName: `sort-${item}`')
        ]},
        {label: 'JS', lines: [
          ...span(source, 'setTimeout(() => glide(true)(() => setOrder(settled)));',
            'setTimeout(() => glide(true)(() => setOrder(settled)));'), gap,
          ...unit(glideSource, 'export const glide')
        ]}
      ]
    };

const steps = (pace: Pace, origin: Origin, motion: Motion): Step[] => {
  const source = listSources[pace][origin][motion];
  return [
    {
      title: 'Arm the drag from its handle',
      want: 'The platform will drag anything marked draggable, but marking the whole card turns every press into a lift and kills text selection inside it.',
      says: ['draggable is only an attribute, so let the grip arm it: a mousedown on the handle ' +
        'sets a flag, the card renders draggable just for that gesture, and dragstart declares ' +
        'the move the platform is about to make. The browser answers with the whole ceremony — ' +
        'the snapshot under your pointer, the cursor, the cancel — without another line.'],
      code: [
        {label: 'HTML', lines: [
          ...span(draggableSource, '<article', 'draggable={is(dragging)}>')
        ]}
      ]
    },
    {
      title: 'Hold the aloft in state, not in the payload',
      want: 'dataTransfer exists to carry data between windows, and mid-drag it is locked — a dragover may not read what dragstart wrote, so the payload cannot steer the sort.',
      says: ['Steer with state instead. The lift reports which item is aloft, the release clears ' +
        'it, and every handler in between reads the same value the render does. The payload API ' +
        'is still there when another window genuinely needs the data.'],
      code: [
        {label: 'JS', lines: [
          ...span(source, 'onLifted={setAloft}', 'onLifted={setAloft}'),
          aside('// the item names itself; the list holds the answer')
        ]}
      ]
    },
    {
      title: 'Accept the drop, or the platform takes it back',
      want: 'By default nothing is a drop target — release over the list and the platform animates the card flying home, a snapback you cannot cancel.',
      says: ['Acceptance is a protocol. dragover calls preventDefault to say the drag may land ' +
        'here, dropEffect names the verb so the cursor matches, and drop calls preventDefault so ' +
        'the browser does not treat the payload as a navigation. Miss any of the three and the ' +
        'drag ends in the platform’s apology animation.'],
      code: [
        {label: 'HTML', lines: [
          ...span(source, '<ul aria-label="sortable list"', 'onDrop={event => event.preventDefault()}')
        ]}
      ]
    },
    {
      title: 'Find the crossing with the inner half',
      want: 'Swap at the first touch of a neighbour and the order chatters: at a boundary, every pixel of movement flips it back and forth.',
      says: ['There is no chart on this road — the platform fires dragover on whatever the ' +
        'pointer is really over, so the event’s own target is the neighbour and its bounding ' +
        'box is the slot. A crossing only counts once the pointer reaches the inner half; the ' +
        'outer quarter holds still, and an item already sliding cannot be overtaken.'],
      code: [
        {label: 'JS', lines: [
          ...unit(crossingSource, 'export const crossed')
        ]}
      ]
    },
    paced(pace, source),
    shown(origin, source),
    moved(motion, pace, source),
    {
      title: 'Arrows go straight to the order',
      want: 'A keyboard user needs the same reorders, and this is the one thing the API cannot sell you — drag-and-drop only ever answers the pointer.',
      says: ['It does not matter, because dragging was never the goal — the order changing is. ' +
        'The grip is a real button, so focus reaches it for free, and the item owns its walk: ' +
        'arrow keys compute the move and report the outcome up, none of the ceremony. An item ' +
        'mid-slide keeps the keys silent until it lands. Nothing in this step touches ' +
        'drag-and-drop, which is exactly why it works.'],
      code: [
        {label: 'JS', lines: [
          ...unit(draggableSource, 'onKeyDown={event => {')
        ]}
      ]
    },
    {
      title: 'Know where the road ends',
      want: 'Some pixels on this road are never yours: the snapshot, the cursor, the cancel — and the keyboard never gets a session at all.',
      says: ['The drag image is a bitmap taken at dragstart, so it cannot be animated and cannot ' +
        'be made opaque on macOS; the cursor belongs to the platform; on macOS even the cancel is ' +
        'the platform’s animation to run; and drag-and-drop itself never answers the keyboard ' +
        '— the arrows on the grips work because they change the order directly, without the ' +
        'API. When those pixels matter, build the drag from pointer events instead — the Tables ' +
        'demo walks that road.'],
      code: [
        {label: 'JS', lines: [
          aside('// no API exists for these pixels — when they matter,'),
          aside('// take the pointer road')
        ]}
      ]
    }
  ];
};

export const NativeRecipe: FC<ControlsProps> = ({pace, origin, motion, onPace, onOrigin, onMotion}) => {
  const dials = {
    pace: <PillGlider label="pace"
                      name="native-pace"
                      options={[
                        {display: 'Eager', value: 'eager'},
                        {display: 'Lazy', value: 'lazy'}
                      ]}
                      chosen={pace}
                      onChoose={onPace}/>,
    origin: <PillGlider label="origin"
                        name="native-origin"
                        options={[
                          {display: 'Keep', value: 'keep'},
                          {display: 'Hide', value: 'hide'}
                        ]}
                        chosen={origin}
                        onChoose={onOrigin}/>,
    motion: <PillGlider label="motion"
                        name="native-motion"
                        options={[
                          {display: 'Animate', value: 'animated'},
                          {display: 'Static', value: 'static'}
                        ]}
                        chosen={motion}
                        onChoose={onMotion}/>
  };
  return <section aria-label="build the native drag sort yourself" className="build-steps">
    <header className="brief-line">
      <h2 className="kicker">build the native drag sort yourself</h2>
      <p className="brief">
        Nine steps of consent and timing — the one demo on this site built on the API actually
        named drag-and-drop. The dials choose one of eight lists, the readout names the one on
        screen, and every code block below is carved from that list’s own source.
      </p>
    </header>
    <p className="lead">
      You want the same sortable list the <Link className="signpost"
      to={`${Paths.demos}?tab=${DemoTopics.tables}`}>Tables demo</Link> builds from pointer
      events, paid for in platform currency instead: mark a card draggable and the browser brings
      the ghost, the cursor, and the drop rules for very little code. What it asks in return is
      protocol — the native road is a series of consents and timings, and each step below is one
      of them.
    </p>
    <StepList steps={steps(pace, origin, motion)
      .map(({dial, ...step}) => ({...step, dial: dial && dials[dial]}))}/>
  </section>;
};
