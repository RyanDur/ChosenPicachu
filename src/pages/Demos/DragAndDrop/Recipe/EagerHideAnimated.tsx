import {FC} from 'react';
import {MotionDial, OriginDial, PaceDial} from '../../Controls';
import {Codes, Mdn, Says, Snippet, Step, Steps, Story, Tell, Words, aside, plain} from '../../Recipe';
import {span, unit} from '../../Recipe/carve';
import {crossingStep, currencyTell, gap, neverOursTell, roadEndStep} from './shared-steps';
import listSource from '../EagerHideAnimatedList/EagerHideAnimatedList.tsx?raw';
import itemSource from '../EagerHideAnimatedList/Item.tsx?raw';
import cssSource from '../EagerHideAnimatedList/EagerHideAnimatedList.css?raw';

export const EagerHideAnimatedRecipe: FC = () => <>
  <Story param="native" id="sort"
         can="The user can sort the list"
         soThat="it reads in the order they mean">
    {currencyTell}
    <Tell>This particular list keeps three more promises. The list answers as they drag, so home
      stays reachable until they let go. One card rides the pointer, so no duplicate muddies
      the carry. And the crossed card slides home, so the eye keeps the story of the swap.</Tell>
    {neverOursTell}
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
            ...span(itemSource, '<article', 'draggable={is(dragging)}>')
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
            ...span(listSource, 'onLifted={setAloft}', 'onLifted={setAloft}'),
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
            ...span(listSource, '<ul aria-label="sortable list"', 'onDrop={event => event.preventDefault()}')
          ]}/>
        </Codes>
      </Step>
      {crossingStep}
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
      {roadEndStep}
    </Steps>
  </Story>
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
            ...unit(itemSource, 'onKeyDown={event => {')
          ]}/>
        </Codes>
      </Step>
    </Steps>
  </Story>
</>;
