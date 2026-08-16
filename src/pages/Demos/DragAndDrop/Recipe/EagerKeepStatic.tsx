import {FC} from 'react';
import {MotionDial, OriginDial, PaceDial} from '../../Controls';
import {Codes, Says, Snippet, Step, Steps, Story, Tell, Words, aside} from '../../Recipe';
import {span, unit} from '../../Recipe/carve';
import {acceptTheDrop, armTheDrag, holdTheAloft, innerHalf, neverOurs, platformCurrency, roadEnd, straightToOrder} from './shared-steps';
import listSource from '../EagerKeepStaticList/EagerKeepStaticList.tsx?raw';
import itemSource from '../EagerKeepStaticList/Item.tsx?raw';

export const EagerKeepStaticRecipe: FC = () => <>
  <Story param="native" id="sort"
         can="The user can sort the list"
         soThat="it reads in the order they mean">
    {platformCurrency}
    <Tell>This particular list keeps three more promises. The list answers as they drag, so home
      stays reachable until they let go. The card at rest stays in sight, so nothing
      vanishes while they decide. And the settle lands instantly, so nothing competes with
      the drag session.</Tell>
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
      <Step title="Apply the state update directly" dial={<MotionDial name="native-motion"/>}>
        <Words want="Motion is not free: it competes with the drag session, costs a frame budget, and some users ask for none at all.">
          <Says>This is the static list; no marking code exists in it. The order applies and React
            paints next frame; a keyboard walk is applied as plainly as everything else.</Says>
        </Words>
        <Codes>
          <Snippet label="TS" lines={[
            ...span(listSource, 'onArranged={setOrder}', 'onArranged={setOrder}'),
            aside('// nothing marked, nothing competing with the session')
          ]}/>
        </Codes>
      </Step>
      {roadEnd}
    </Steps>
  </Story>
  {straightToOrder(itemSource)}
</>;
