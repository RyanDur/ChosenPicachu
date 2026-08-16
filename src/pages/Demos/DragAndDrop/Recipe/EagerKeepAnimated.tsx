import {FC} from 'react';
import {MotionDial, OriginDial, PaceDial} from '../../Controls';
import {Codes, Mdn, Says, Snippet, Step, Steps, Story, Tell, Words, aside} from '../../Recipe';
import {span, unit} from '../../Recipe/carve';
import {acceptTheDrop, armTheDrag, gap, holdTheAloft, innerHalf, neverOurs, platformCurrency, roadEnd, straightToOrder} from './shared-steps';
import listSource from '../EagerKeepAnimatedList/EagerKeepAnimatedList.tsx?raw';
import itemSource from '../EagerKeepAnimatedList/Item.tsx?raw';
import cssSource from '../EagerKeepAnimatedList/EagerKeepAnimatedList.css?raw';

export const EagerKeepAnimatedRecipe: FC = () => <>
  <Story param="native" id="sort"
         can="The user can sort the list"
         soThat="it reads in the order they mean">
    {platformCurrency}
    <Tell>This particular list keeps three more promises. The list answers as they drag, so home
      stays reachable until they let go. The card at rest stays in sight, so nothing
      vanishes while they decide. And the crossed card slides home, so the eye keeps the
      story of the swap.</Tell>
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
          <Snippet label="TS" lines={[
            ...unit(listSource, 'onDragOver={event => {')
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
      <Step title="Slide the crossed item home" dial={<MotionDial name="native-motion"/>}>
        <Words want="An eager swap that teleports is hard to follow, yet nothing can be animated mid-session by view transitions; the capture would swallow the drag’s own events.">
          <Says>The swap commits instantly and the crossed item is merely drawn where it used
            to be, sliding home on a <Mdn path="Web/CSS/@keyframes">keyframe</Mdn> whose from is one
            seat over, the same theater the table plays, turned horizontal, with the direction as
            data: --toward flips the sign of one keyframe instead of naming two.</Says>
        </Words>
        <Codes>
          <Snippet label="TS" lines={[
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
