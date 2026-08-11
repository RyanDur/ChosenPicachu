import {FC} from 'react';
import {MotionDial, OriginDial, PaceDial} from '../../Controls';
import {Codes, Mdn, Says, Snippet, Step, Steps, Story, Tell, Words, aside} from '../../Recipe';
import {span, unit} from '../../Recipe/carve';
import {acceptTheDrop, armTheDrag, gap, holdTheAloft, innerHalf, neverOurs, platformCurrency, roadEnd, straightToOrder} from './shared-steps';
import listSource from '../EagerHideAnimatedList/EagerHideAnimatedList.tsx?raw';
import itemSource from '../EagerHideAnimatedList/Item.tsx?raw';
import cssSource from '../EagerHideAnimatedList/EagerHideAnimatedList.css?raw';

export const EagerHideAnimatedRecipe: FC = () => <>
  <Story param="native" id="sort"
         can="The user can sort the list"
         soThat="it reads in the order they mean">
    {platformCurrency}
    <Tell>This particular list keeps three more promises. The list answers as they drag, so home
      stays reachable until they let go. One card rides the pointer, so no duplicate muddies
      the carry. And the crossed card slides home, so the eye keeps the story of the swap.</Tell>
    {neverOurs}
    <Steps>
      {armTheDrag(itemSource)}
      {holdTheAloft(listSource)}
      {acceptTheDrop(listSource)}
      {innerHalf}
      <Step title="Commit inside the crossing" dial={<PaceDial name="native-pace"/>}>
        <Words want="You want the list to answer the drag as it happens; waiting for the drop hides the outcome until it is too late to change your mind.">
          <Says>Commit the reorder inside the dragover that detected the crossing: the state updates
            mid-drag, the markup renders through it, and the same key finds its new seat while the
            platform still holds the snapshot in your hand. Carrying the item back is just more
            crossings, so home stays reachable.</Says>
        </Words>
        <Codes>
          <Snippet label="JS" lines={[
            ...unit(listSource, 'onDragOver={event => {')
          ]}/>
        </Codes>
      </Step>
      <Step title="Fade the origin to a whisper" dial={<OriginDial name="native-origin"/>}>
        <Words want="With the snapshot in hand, the origin card reads as a duplicate, but truly vanishing it can kill the drag: some engines end the session when its source disappears.">
          <Says>So the origin does not vanish; it fades to a whisper. This is the hide list, so
            its own Item dresses itself on its own lift and undresses on its own release. The CSS behind the class is
            an <Mdn path="Web/CSS/opacity">opacity</Mdn> of nearly nothing: the node stays alive, the
            session keeps its source, and the eye reads a single card riding the pointer.</Says>
        </Words>
        <Codes>
          <Snippet label="JS" lines={[
            ...span(itemSource, 'updateHide(true);', 'updateHide(true);'), gap,
            ...span(itemSource, 'updateHide(false);', 'updateHide(false);')
          ]}/>
          <Snippet label="CSS" lines={[
            ...unit(cssSource, '.sortable-list .hide {'),
            aside('/* not visibility; the session dies with its source */')
          ]}/>
        </Codes>
      </Step>
      <Step title="Slide the crossed item home" dial={<MotionDial name="native-motion"/>}>
        <Words want="An eager swap that teleports is hard to follow, yet nothing can be animated mid-session by view transitions; the capture would swallow the drag’s own events.">
          <Says>The swap commits instantly and the crossed item is merely drawn where it used
            to be, sliding home on a <Mdn path="Web/CSS/@keyframes">keyframe</Mdn> whose from is one
            seat over, the same theater the table plays, turned horizontal, with the direction as
            data: --toward flips the sign of one keyframe instead of naming two.</Says>
        </Words>
        <Codes>
          <Snippet label="JS" lines={[
            ...span(listSource, "setPushed({[item]: homeward ? 'right' : 'left'});",
              "setPushed({[item]: homeward ? 'right' : 'left'});")
          ]}/>
          <Snippet label="CSS" lines={[
            ...unit(cssSource, '.sortable-list .pushed {'), gap,
            ...unit(cssSource, '@keyframes pushed')
          ]}/>
        </Codes>
      </Step>
      {roadEnd}
    </Steps>
  </Story>
  {straightToOrder(itemSource)}
</>;
