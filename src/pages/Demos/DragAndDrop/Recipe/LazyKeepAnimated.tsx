import {FC} from 'react';
import {MotionDial, OriginDial, PaceDial} from '../../Controls';
import {Codes, Mdn, Says, Snippet, Step, Steps, Story, Tell, Words, aside} from '../../Recipe';
import {span, unit} from '../../Recipe/carve';
import {acceptTheDrop, armTheDrag, gap, holdTheAloft, innerHalf, neverOurs, platformCurrency, roadEnd, straightToOrder} from './shared-steps';
import listSource from '../LazyKeepAnimatedList/LazyKeepAnimatedList.tsx?raw';
import itemSource from '../LazyKeepAnimatedList/Item.tsx?raw';
import glideSource from '@components/glide.ts?raw';

export const LazyKeepAnimatedRecipe: FC = () => <>
  <Story param="native" id="sort"
         can="The user can sort the list"
         soThat="it reads in the order they mean">
    {platformCurrency}
    <Tell>This particular list keeps three more promises. The list holds calm and settles on the
      drop, so only the destination matters. The card at rest stays in sight, so nothing
      vanishes while they decide. And the whole settle glides once, so the landing explains
      itself.</Tell>
    {neverOurs}
    <Steps>
      {armTheDrag(itemSource)}
      {holdTheAloft(listSource)}
      {acceptTheDrop(listSource)}
      {innerHalf}
      <Step title="Stash the landing, settle after the drag" dial={<PaceDial name="native-pace"/>}>
        <Words want="You want the list calm while the platform drags, which means the reorder must wait for a session that is still alive when the drop lands.">
          <Says>Each dragover only remembers where the pointer last hovered, and
            a <Mdn path="Web/API/HTMLElement/dragleave_event">dragleave</Mdn> forgets it. The commit runs from the release: the session has to finish before the list moves,
            because the platform is still animating its own end of the bargain.</Says>
        </Words>
        <Codes>
          <Snippet label="TS" lines={[
            ...span(listSource, 'onDragOver={() => setLanding(maybe(index))}', 'onDragOver={() => setLanding(maybe(index))}'), gap,
            ...unit(listSource, 'const release')
          ]}/>
        </Codes>
      </Step>
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
      </Step>
      <Step title="Glide the settle, one tick after" dial={<MotionDial name="native-motion"/>}>
        <Words want="A lazy settle happens all at once on release, the perfect moment for a view transition, except the drag session is still alive when the drop fires, and a capture mid-session swallows its events.">
          <Says><Mdn path="Web/CSS/view-transition-name">Name each item for the transition</Mdn> and
            defer the settle one tick past the release. By the
            time <Mdn path="Web/API/Document/startViewTransition">startViewTransition</Mdn> captures
            the page, the platform has finished its ceremony, and every item glides from where the
            drag left it to where the order says it belongs.</Says>
        </Words>
        <Codes>
          <Snippet label="HTML" lines={[
            ...span(listSource, 'viewTransitionName: `sort-${item}`', 'viewTransitionName: `sort-${item}`')
          ]}/>
          <Snippet label="TS" lines={[
            ...span(listSource, 'setTimeout(() => glide(true)(() => setOrder(settled)));',
              'setTimeout(() => glide(true)(() => setOrder(settled)));'), gap,
            ...unit(glideSource, 'export const glide')
          ]}/>
        </Codes>
      </Step>
      {roadEnd}
    </Steps>
  </Story>
  {straightToOrder(itemSource)}
</>;
