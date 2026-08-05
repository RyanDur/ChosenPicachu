import {FC} from 'react';
import {Link} from 'react-router';
import {PillGlider} from '@components/PillGlider';
import {Paths} from '@pages/Paths';
import {DemoTopics} from '../types';
import {ControlsProps, Motion, Origin, Pace} from '../Controls';
import {StepEntry, StepList, aside, plain} from '../Recipe';
import '../Recipe/Recipe.css';

type Step = Omit<StepEntry, 'dial'> & {
  dial?: 'pace' | 'origin' | 'motion';
};

const paced = (pace: Pace): Step => pace === 'eager'
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
        plain('onDragOver: event => {'),
        plain('    if (crossed(event, item))'),
        plain('        setOrder(previous => array.moveToIndex(index, aloft, previous));'),
        plain('}')
      ]}
    ]
  }
  : {
    title: 'Stash the landing, settle after the drag',
    dial: 'pace',
    want: 'You want the list calm while the platform drags, which means the reorder must wait for a session that is still alive when the drop lands.',
    says: ['Each dragover only remembers where the pointer last hovered, and a dragleave forgets ' +
      'it. The commit runs from dragend, one tick later — the session has to finish before the ' +
      'list moves, because the platform is still animating its own end of the bargain.'],
    code: [
      {label: 'JS', lines: [
        plain('onDragOver: () => setLanding(index),'),
        plain('onDragEnd: () => {'),
        plain('    const settled = array.moveToIndex(landing, aloft, order);'),
        plain('    setTimeout(() => settle(() => setOrder(settled)));'),
        plain('}'),
        aside('// one tick past the session — never inside it')
      ]}
    ]
  };

const shown = (origin: Origin): Step => origin === 'hide'
  ? {
    title: 'Fade the origin to a whisper',
    dial: 'origin',
    want: 'With the snapshot in hand, the origin card reads as a duplicate — but truly vanishing it can kill the drag, because some engines end the session when its source disappears.',
    says: ['So the origin does not vanish; it fades to a whisper. A class lands on dragstart and ' +
      'leaves on dragend, and the CSS behind it is an opacity of nearly nothing — the node stays ' +
      'alive, the session keeps its source, and the eye reads a single card riding the pointer.'],
    code: [
      {label: 'JS', lines: [
        plain("onDragStart: () => updateHide('hide'),"),
        plain('onDragEnd: () => updateHide(undefined)')
      ]},
      {label: 'CSS', lines: [
        plain('.draggable.hide {'),
        plain('    opacity: 0.1%;'),
        plain('}'),
        aside('/* not visibility — the session dies with its source */')
      ]}
    ]
  }
  : {
    title: 'Leave the origin standing',
    dial: 'origin',
    want: 'A vanished origin can disorient; sometimes the eye wants the card both at rest and in hand while it decides.',
    says: ['Do nothing. The platform already drew the snapshot, so there are two of the card for ' +
      'the length of the drag — one at rest in the list, one dimmed under the pointer — and no ' +
      'style needs to change hands at all.'],
    code: [
      {label: 'CSS', lines: [
        aside('/* no rule exists for this variant — the platform paints both */')
      ]}
    ]
  };

const moved = (motion: Motion, pace: Pace): Step => motion === 'static'
  ? {
    title: 'Apply the state update directly',
    dial: 'motion',
    want: 'Motion is not free: it competes with the drag session, costs a frame budget, and some users ask for none at all.',
    says: ['Apply the order and let React paint — the new arrangement is on screen next frame, ' +
      'and nothing races the session the platform is running.'],
    code: [
      {label: 'JS', lines: [
        plain('setOrder(next);'),
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
        'table plays, turned horizontal. The class arrives with the commit and animationend ' +
        'hands it back, and an item still sliding cannot be crossed again.'],
      code: [
        {label: 'CSS', lines: [
          plain('.sortable-list .pushed-left {'),
          plain('    animation: pushed-left 150ms ease-out;'),
          plain('}'),
          plain(''),
          plain('@keyframes pushed-left {'),
          plain('    from {'),
          plain('        transform: translateX(calc(100% + var(--base)));'),
          plain('    }'),
          plain('}'),
          aside('/* pushed-right mirrors with a negative offset */')
        ]},
        {label: 'JS', lines: [
          plain("setPushed({item, toward: homeward ? 'right' : 'left'});")
        ]}
      ]
    }
    : {
      title: 'Glide the settle, one tick after',
      dial: 'motion',
      want: 'A lazy settle happens all at once on release — the perfect moment for a view transition, except the drag session is still alive when the drop fires, and a capture mid-session swallows its events.',
      says: ['Name each item for the transition and defer the settle one tick past dragend. By ' +
        'the time startViewTransition captures the page, the platform has finished its ' +
        'ceremony, and every item glides from where the drag left it to where the order says ' +
        'it belongs.'],
      code: [
        {label: 'HTML', lines: [
          plain("<li style={{viewTransitionName: `sort-${item}`}}>")
        ]},
        {label: 'JS', lines: [
          plain('setTimeout(() => settle(() => setOrder(settled)));'),
          plain(''),
          plain('const settle = (update) =>'),
          plain('    document.startViewTransition(() => flushSync(update));')
        ]}
      ]
    };

const steps = (pace: Pace, origin: Origin, motion: Motion): Step[] => [
  {
    title: 'Arm the drag from its handle',
    want: 'The platform will drag anything marked draggable, but marking the whole card turns every press into a lift and kills text selection inside it.',
    says: ['draggable is only an attribute, so let the grip arm it: a mousedown on the handle ' +
      'sets a flag, the card renders draggable just for that gesture, and dragstart declares ' +
      'the move the platform is about to make. The browser answers with the whole ceremony — ' +
      'the snapshot under your pointer, the cursor, the cancel — without another line.'],
    code: [
      {label: 'HTML', lines: [
        plain('<article draggable={is(dragging)}'),
        plain("         onDragStart={event => { event.dataTransfer.effectAllowed = 'move'; }}>"),
        plain('    <Grip onMouseDown={() => updateDragging(\'dragging\')}/>')
      ]}
    ]
  },
  {
    title: 'Hold the aloft in state, not in the payload',
    want: 'dataTransfer exists to carry data between windows, and mid-drag it is locked — a dragover may not read what dragstart wrote, so the payload cannot steer the sort.',
    says: ['Steer with state instead. dragstart records which item is aloft, dragend clears it, ' +
      'and every handler in between reads the same value the render does. The payload API is ' +
      'still there when another window genuinely needs the data.'],
    code: [
      {label: 'JS', lines: [
        plain('onDragStart: () => setAloft(item),'),
        plain('onDragEnd: () => setAloft(undefined)')
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
        plain('<ul onDragOver={event => event.preventDefault()}'),
        plain('    onDrop={event => event.preventDefault()}>')
      ]},
      {label: 'JS', lines: [
        plain("event.dataTransfer.dropEffect = 'move';")
      ]}
    ]
  },
  {
    title: 'Find the crossing with the inner half',
    want: 'Swap at the first touch of a neighbour and the order chatters: at a boundary, every pixel of movement flips it back and forth.',
    says: ['There is no chart on this road — the platform fires dragover on whatever the pointer ' +
      'is really over, so the event’s own target is the neighbour and its bounding box is the ' +
      'slot. A crossing only counts once the pointer reaches the inner half; the outer quarter ' +
      'holds still, and an item already sliding cannot be overtaken.'],
    code: [
      {label: 'JS', lines: [
        plain('const space = event.currentTarget.getBoundingClientRect();'),
        plain('const quarter = space.width / 4;'),
        plain('const homeward = index < order.indexOf(aloft);'),
        plain('const crossed = homeward'),
        plain('    ? event.clientX < space.right - quarter'),
        plain('    : event.clientX > space.left + quarter;')
      ]}
    ]
  },
  paced(pace),
  shown(origin),
  moved(motion, pace),
  {
    title: 'Know where the road ends',
    want: 'Some pixels on this road are never yours: the snapshot, the cursor, the cancel — and the keyboard never gets a session at all.',
    says: ['The drag image is a bitmap taken at dragstart, so it cannot be animated and cannot ' +
      'be made opaque on macOS; the cursor belongs to the platform; on macOS even the cancel is ' +
      'the platform’s animation to run; and no keyboard event opens a drag session, so this ' +
      'road has no keyboard track to offer. When those pixels matter, build the drag from ' +
      'pointer events instead — the Tables demo walks that road.'],
    code: [
      {label: 'JS', lines: [
        aside('// no API exists for these pixels — when they matter,'),
        aside('// take the pointer road')
      ]}
    ]
  }
];

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
        Eight steps of consent and timing — the one demo on this site built on the API actually
        named drag-and-drop. Steps that carry a dial rewrite to match it.
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
