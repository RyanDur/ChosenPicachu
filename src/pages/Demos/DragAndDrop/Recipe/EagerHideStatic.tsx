import {FC} from 'react';
import {MotionDial, OriginDial, PaceDial} from '../../Controls';
import {Codes, Mdn, Says, Snippet, Step, Steps, Story, Tell, Words, aside} from '../../Recipe';
import {span, unit} from '../../Recipe/carve';
import {acceptTheDrop, armTheDrag, gap, holdTheAloft, innerHalf, neverOurs, platformCurrency, roadEnd, straightToOrder} from './shared-steps';
import listSource from '../EagerHideStaticList/EagerHideStaticList.tsx?raw';
import itemSource from '../EagerHideStaticList/Item.tsx?raw';
import cssSource from '../EagerHideStaticList/EagerHideStaticList.css?raw';

export const EagerHideStaticRecipe: FC = () => <>
  <Story param="native" id="sort"
         can="The user can sort the list"
         soThat="it reads in the order they mean">
    {platformCurrency}
    <Tell>This particular list keeps three more promises. The list answers as they drag, so home
      stays reachable until they let go. One card rides the pointer, so no duplicate muddies
      the carry. And the settle lands instantly, so nothing competes with the drag session.</Tell>
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
            ...span(itemSource, "updateHide('hide');", "updateHide('hide');"), gap,
            ...span(itemSource, 'updateHide(undefined);', 'updateHide(undefined);')
          ]}/>
          <Snippet label="CSS" lines={[
            ...unit(cssSource, '.sortable-list .hide {'),
            aside('/* not visibility; the session dies with its source */')
          ]}/>
        </Codes>
      </Step>
      <Step title="Apply the state update directly" dial={<MotionDial name="native-motion"/>}>
        <Words want="Motion is not free: it competes with the drag session, costs a frame budget, and some users ask for none at all.">
          <Says>This is the static list; no marking code exists in it. The order applies and React
            paints next frame; a keyboard walk is applied as plainly as everything else.</Says>
        </Words>
        <Codes>
          <Snippet label="JS" lines={[
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
