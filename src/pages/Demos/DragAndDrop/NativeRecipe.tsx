import {FC, ReactNode} from 'react';
import {Link} from 'react-router';
import {PillGlider} from '@components/PillGlider';
import {Paths} from '@pages/Paths';
import {DemoTopics} from '../types';
import {ControlsProps, Motion, Origin, Pace} from '../Controls';
import {Codes, Mdn, Says, Snippet, Step, Steps, Stories, Story, Tell, Words, aside, plain} from '../Recipe';
import {span, unit} from '../Recipe/carve';
import crossingSource from './crossing.ts?raw';
import glideSource from '@components/glide.ts?raw';
import eksList from './EagerKeepStaticList/EagerKeepStaticList.tsx?raw';
import eksItem from './EagerKeepStaticList/Item.tsx?raw';
import ekaList from './EagerKeepAnimatedList/EagerKeepAnimatedList.tsx?raw';
import ekaItem from './EagerKeepAnimatedList/Item.tsx?raw';
import ehsList from './EagerHideStaticList/EagerHideStaticList.tsx?raw';
import ehsItem from './EagerHideStaticList/Item.tsx?raw';
import ehaList from './EagerHideAnimatedList/EagerHideAnimatedList.tsx?raw';
import ehaItem from './EagerHideAnimatedList/Item.tsx?raw';
import lksList from './LazyKeepStaticList/LazyKeepStaticList.tsx?raw';
import lksItem from './LazyKeepStaticList/Item.tsx?raw';
import lkaList from './LazyKeepAnimatedList/LazyKeepAnimatedList.tsx?raw';
import lkaItem from './LazyKeepAnimatedList/Item.tsx?raw';
import lhsList from './LazyHideStaticList/LazyHideStaticList.tsx?raw';
import lhsItem from './LazyHideStaticList/Item.tsx?raw';
import lhaList from './LazyHideAnimatedList/LazyHideAnimatedList.tsx?raw';
import lhaItem from './LazyHideAnimatedList/Item.tsx?raw';
import ekaListCss from './EagerKeepAnimatedList/EagerKeepAnimatedList.css?raw';
import ehsListCss from './EagerHideStaticList/EagerHideStaticList.css?raw';
import ehaListCss from './EagerHideAnimatedList/EagerHideAnimatedList.css?raw';
import lkaListCss from './LazyKeepAnimatedList/LazyKeepAnimatedList.css?raw';
import lhsListCss from './LazyHideStaticList/LazyHideStaticList.css?raw';
import lhaListCss from './LazyHideAnimatedList/LazyHideAnimatedList.css?raw';
import '../Recipe/Recipe.css';

const gap = plain(' ');

type Sources = Record<Pace, Record<Origin, Record<Motion, string>>>;

const listSources: Sources = {
  eager: {keep: {animated: ekaList, static: eksList}, hide: {animated: ehaList, static: ehsList}},
  lazy: {keep: {animated: lkaList, static: lksList}, hide: {animated: lhaList, static: lhsList}}
};

const itemSources: Sources = {
  eager: {keep: {animated: ekaItem, static: eksItem}, hide: {animated: ehaItem, static: ehsItem}},
  lazy: {keep: {animated: lkaItem, static: lksItem}, hide: {animated: lhaItem, static: lhsItem}}
};

const cssSources: Record<Pace, Record<Origin, Partial<Record<Motion, string>>>> = {
  eager: {keep: {animated: ekaListCss}, hide: {animated: ehaListCss, static: ehsListCss}},
  lazy: {keep: {animated: lkaListCss}, hide: {animated: lhaListCss, static: lhsListCss}}
};

type Dials = Record<'pace' | 'origin' | 'motion', ReactNode>;

const paced = (pace: Pace, source: string, dial: ReactNode) => pace === 'eager'
  ? <Step title="Commit inside the crossing" dial={dial}>
    <Words want="You want the list to answer the drag as it happens; waiting for the drop hides the outcome until it is too late to change your mind.">
      <Says>Commit the reorder inside the dragover that detected the crossing: the state updates
        mid-drag, the markup renders through it, and the same key finds its new seat while the
        platform still holds the snapshot in your hand. Carrying the item back is just more
        crossings, so home stays reachable.</Says>
    </Words>
    <Codes>
      <Snippet label="JS" lines={[
        ...unit(source, 'onDragOver={event => {')
      ]}/>
    </Codes>
  </Step>
  : <Step title="Stash the landing, settle after the drag" dial={dial}>
    <Words want="You want the list calm while the platform drags, which means the reorder must wait for a session that is still alive when the drop lands.">
      <Says>Each dragover only remembers where the pointer last hovered, and
        a <Mdn path="Web/API/HTMLElement/dragleave_event">dragleave</Mdn> forgets it. The commit runs from the release: the session has to finish before the list moves,
        because the platform is still animating its own end of the bargain.</Says>
    </Words>
    <Codes>
      <Snippet label="JS" lines={[
        ...span(source, 'onDragOver={() => setLanding(index)}', 'onDragOver={() => setLanding(index)}'), gap,
        ...unit(source, 'onReleased={() => {')
      ]}/>
    </Codes>
  </Step>;

const shown = (origin: Origin, sources: {list: string; item: string; css: string}, dial: ReactNode) => origin === 'hide'
  ? <Step title="Fade the origin to a whisper" dial={dial}>
    <Words want="With the snapshot in hand, the origin card reads as a duplicate, but truly vanishing it can kill the drag: some engines end the session when its source disappears.">
      <Says>So the origin does not vanish; it fades to a whisper. This is the hide list, so
        its own Item dresses itself on its own lift and undresses on its own release. The CSS behind the class is
        an <Mdn path="Web/CSS/opacity">opacity</Mdn> of nearly nothing: the node stays alive, the
        session keeps its source, and the eye reads a single card riding the pointer.</Says>
    </Words>
    <Codes>
      <Snippet label="JS" lines={[
        ...span(sources.item, "updateHide('hide');", "updateHide('hide');"), gap,
        ...span(sources.item, 'updateHide(undefined);', 'updateHide(undefined);')
      ]}/>
      <Snippet label="CSS" lines={[
        ...unit(sources.css, '.sortable-list .hide {'),
        aside('/* not visibility; the session dies with its source */')
      ]}/>
    </Codes>
  </Step>
  : <Step title="Leave the origin standing" dial={dial}>
    <Words want="A vanished origin can disorient; sometimes the eye wants the card both at rest and in hand while it decides.">
      <Says>Do nothing. This is the keep list, so its Item is the plain card: the platform
        already drew the snapshot, there are two of the card for the length of the drag, one
        at rest, one dimmed under the pointer, and no hiding code exists in its directory at all.</Says>
    </Words>
    <Codes>
      <Snippet label="HTML" lines={[
        ...span(sources.list, '<Item item={item}', '<Item item={item}'),
        aside('{/* no hiding wiring exists in this list; nothing to erase */}')
      ]}/>
    </Codes>
  </Step>;

const moved = (motion: Motion, pace: Pace, sources: {list: string; css: string}, dial: ReactNode) => motion === 'static'
  ? <Step title="Apply the state update directly" dial={dial}>
    <Words want="Motion is not free: it competes with the drag session, costs a frame budget, and some users ask for none at all.">
      <Says>This is the static list; no marking code exists in it. The order applies and React
        paints next frame; a keyboard walk is applied as plainly as everything else.</Says>
    </Words>
    <Codes>
      <Snippet label="JS" lines={[
        ...span(sources.list, 'onArranged={setOrder}', 'onArranged={setOrder}'),
        aside('// nothing marked, nothing competing with the session')
      ]}/>
    </Codes>
  </Step>
  : pace === 'eager'
    ? <Step title="Slide the crossed item home" dial={dial}>
      <Words want="An eager swap that teleports is hard to follow, yet nothing can be animated mid-session by view transitions; the capture would swallow the drag’s own events.">
        <Says>The swap commits instantly and the crossed item is merely drawn where it used
          to be, sliding home on a <Mdn path="Web/CSS/@keyframes">keyframe</Mdn> whose from is one
          seat over, the same theater the table plays, turned horizontal, with the direction as
          data: --toward flips the sign of one keyframe instead of naming two.</Says>
      </Words>
      <Codes>
        <Snippet label="JS" lines={[
          ...span(sources.list, "setPushed({[item]: homeward ? 'right' : 'left'});",
            "setPushed({[item]: homeward ? 'right' : 'left'});")
        ]}/>
        <Snippet label="CSS" lines={[
          ...unit(sources.css, '.sortable-list .pushed {'), gap,
          ...unit(sources.css, '@keyframes pushed')
        ]}/>
      </Codes>
    </Step>
    : <Step title="Glide the settle, one tick after" dial={dial}>
      <Words want="A lazy settle happens all at once on release, the perfect moment for a view transition, except the drag session is still alive when the drop fires, and a capture mid-session swallows its events.">
        <Says><Mdn path="Web/CSS/view-transition-name">Name each item for the transition</Mdn> and
          defer the settle one tick past the release. By the
          time <Mdn path="Web/API/Document/startViewTransition">startViewTransition</Mdn> captures
          the page, the platform has finished its ceremony, and every item glides from where the
          drag left it to where the order says it belongs.</Says>
      </Words>
      <Codes>
        <Snippet label="HTML" lines={[
          ...span(sources.list, 'viewTransitionName: `sort-${item}`', 'viewTransitionName: `sort-${item}`')
        ]}/>
        <Snippet label="JS" lines={[
          ...span(sources.list, 'setTimeout(() => glide(true)(() => setOrder(settled)));',
            'setTimeout(() => glide(true)(() => setOrder(settled)));'), gap,
          ...unit(glideSource, 'export const glide')
        ]}/>
      </Codes>
    </Step>;

const sortStory = (pace: Pace, origin: Origin, motion: Motion, dials: Dials) => {
  const source = listSources[pace][origin][motion];
  const itemSrc = itemSources[pace][origin][motion];
  const cssSrc = cssSources[pace][origin][motion] ?? '';
  return <Story param="native" id="sort"
                can="The user can sort the list"
                soThat="it reads in the order they mean">
    <Tell>The tables build their drag from pointer events and own every pixel; this
      list pays platform currency instead. Mark a card draggable and the ceremony
      arrives: the snapshot, the cursor, the cancel. What the platform asks in return is
      protocol, a series of consents and timings, and the steps below are those
      consents.</Tell>
    <Tell>This particular list keeps three more promises. {pace === 'eager'
      ? 'The list answers as they drag, so home stays reachable until they let go. '
      : 'The list holds calm and settles on the drop, so only the destination matters. '}{origin === 'hide'
      ? 'One card rides the pointer, so no duplicate muddies the carry. '
      : 'The card at rest stays in sight, so nothing vanishes while they decide. '}{motion === 'static'
      ? 'And the settle lands instantly, so nothing competes with the drag session.'
      : pace === 'eager'
        ? 'And the crossed card slides home, so the eye keeps the story of the swap.'
        : 'And the whole settle glides once, so the landing explains itself.'}</Tell>
    <Tell>Some pixels are never ours on this road: the snapshot, the cursor, the macOS
      cancel. We name them instead of faking them, and the <Link className="signpost"
      to={`${Paths.demos}?tab=${DemoTopics.tables}`}>Tables demo</Link> walks the road that
      owns them.</Tell>
    <Steps>
      <Step title="Arm the drag from its handle">
        <Words want="The platform will drag anything marked draggable, but marking the whole card turns every press into a lift and kills text selection inside it.">
          <Says>draggable is only an attribute, so let the grip arm it: a mousedown on the
            handle sets a flag, the card renders draggable just for that gesture,
            and <Mdn path="Web/API/HTMLElement/dragstart_event">dragstart</Mdn> declares the move
            the platform is about to make. The browser answers with the whole ceremony (the
            snapshot under your pointer, the cursor, the cancel) without another line.</Says>
        </Words>
        <Codes>
          <Snippet label="HTML" lines={[
            ...span(itemSrc, '<article', 'draggable={is(dragging)}>')
          ]}/>
        </Codes>
      </Step>
      <Step title="Hold the aloft in state, not in the payload">
        <Words want={<><Mdn path="Web/API/DataTransfer">dataTransfer</Mdn> exists to carry data between
          windows, and mid-drag it is locked:
          a <Mdn path="Web/API/HTMLElement/dragover_event">dragover</Mdn> may not read what
          dragstart wrote, so the payload cannot steer the sort.</>}>
          <Says>Your first try writes the item into the payload at dragstart and reads it back in
            dragover, and the read comes back empty. That is not a bug: the store is sealed
            mid-drag so a hovered window cannot sniff data that was never dropped on it.</Says>
          <Says>Steer with state instead. The lift reports which item is aloft, the release clears
            it, and every handler in between reads the same value the render does. The payload API
            is still there when another window genuinely needs the data.</Says>
        </Words>
        <Codes>
          <Snippet label="JS" foil lines={[
            plain("event.dataTransfer.setData('text/plain', item);"),
            aside('// written at dragstart'), gap,
            plain("event.dataTransfer.getData('text/plain');"),
            aside('// read in dragover: always "", the store is sealed')
          ]}/>
          <Snippet label="JS" lines={[
            ...span(source, 'onLifted={setAloft}', 'onLifted={setAloft}'),
            aside('// the item names itself; the list holds the answer')
          ]}/>
        </Codes>
      </Step>
      <Step title="Accept the drop, or the platform takes it back">
        <Words want="By default nothing is a drop target: release over the list and the platform animates the card flying home, a snapback you cannot cancel.">
          <Says>A bare list looks finished. Then you release over it, the card flies home, and your
            drop handler never ran.</Says>
          <Says>Acceptance is a protocol. dragover
            calls <Mdn path="Web/API/Event/preventDefault">preventDefault</Mdn> to say the drag may
            land here, <Mdn path="Web/API/DataTransfer/dropEffect">dropEffect</Mdn> names the verb
            so the cursor matches, and <Mdn path="Web/API/HTMLElement/drop_event">drop</Mdn> calls
            preventDefault so the browser does not treat the payload as a navigation. Miss any of
            the three and the drag ends in the platform’s apology animation.</Says>
        </Words>
        <Codes>
          <Snippet label="HTML" foil lines={[
            plain('<ul aria-label="sortable list">'),
            plain('    {order.map(item => <Item key={item} item={item}/>)}'),
            plain('</ul>'), gap,
            aside("{/* release here: the card flies home in the platform's */}"),
            aside('{/* apology animation, and your onDrop never fired */}')
          ]}/>
          <Snippet label="HTML" lines={[
            ...span(source, '<ul aria-label="sortable list"', 'onDrop={event => event.preventDefault()}')
          ]}/>
        </Codes>
      </Step>
      <Step title="Find the crossing with the inner half">
        <Words want="Swap at the first touch of a neighbour and the order chatters: at a boundary, every pixel of movement flips it back and forth.">
          <Says>There is no survey on this road: the platform fires dragover on whatever the
            pointer is really over, so the event’s own target is the neighbour and its bounding
            box is the slot. A crossing only counts once the pointer reaches the inner half; the
            outer quarter holds still, and an item already sliding cannot be overtaken.</Says>
        </Words>
        <Codes>
          <Snippet label="JS" lines={[
            ...unit(crossingSource, 'export const crossed')
          ]}/>
        </Codes>
      </Step>
      {paced(pace, source, dials.pace)}
      {shown(origin, {list: source, item: itemSrc, css: cssSrc}, dials.origin)}
      {moved(motion, pace, {list: source, css: cssSrc}, dials.motion)}
      <Step title="Know where the road ends">
        <Words want="Some pixels on this road are never yours: the snapshot, the cursor, the cancel. And the keyboard never gets a session at all.">
          <Says>The drag image is a bitmap taken at dragstart, so it cannot be animated and cannot
            be made opaque on macOS; the cursor belongs to the platform; on macOS even the cancel is
            the platform’s animation to run; and drag-and-drop itself never answers the keyboard:
            the arrows on the grips work because they change the order directly, without the
            API. When those pixels matter, build the drag from pointer events instead; the Tables
            demo walks that road.</Says>
        </Words>
        <Codes>
          <Snippet label="JS" lines={[
            aside('// no API exists for these pixels; when they matter,'),
            aside('// take the pointer road')
          ]}/>
        </Codes>
      </Step>
    </Steps>
  </Story>;
};

const keyboardStory = (itemSrc: string) =>
  <Story param="native" id="keyboard"
         can="The user can sort without a mouse"
         soThat="the keys go straight to the order">
    <Tell>Drag-and-drop never answers the keyboard, and it does not matter: dragging
      was never the goal, the order changing is. The grip is a real button, and the
      arrows compute the move directly.</Tell>
    <Steps>
      <Step title="Arrows go straight to the order">
        <Words want="A keyboard user needs the same reorders, and this is the one thing the API cannot sell you: drag-and-drop only ever answers the pointer.">
          <Says>It does not matter, because dragging was never the goal; the order changing is.
            The grip is a real button, so focus reaches it for free, and the item owns its walk:
            arrow keys compute the move and report the outcome up, none of the ceremony. An item
            mid-slide keeps the keys silent until it lands. Nothing in this step touches
            drag-and-drop, which is exactly why it works.</Says>
        </Words>
        <Codes>
          <Snippet label="JS" lines={[
            ...unit(itemSrc, 'onKeyDown={event => {')
          ]}/>
        </Codes>
      </Step>
    </Steps>
  </Story>;

export const NativeRecipe: FC<ControlsProps> = ({pace, origin, motion, onPace, onOrigin, onMotion}) => {
  const dials: Dials = {
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
    <Stories>
      {sortStory(pace, origin, motion, dials)}
      {keyboardStory(itemSources[pace][origin][motion])}
    </Stories>
  </section>;
};
