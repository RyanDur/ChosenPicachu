import {FC} from 'react';
import {Codes, Mdn, Says, Snippet, Step, Steps, Story, Tell, Words, aside, plain} from '../../Recipe';
import {span, unit} from '../../Recipe/carve';
import {Dials, crossingStep, currencyTell, gap, neverOursTell, roadEndStep} from './shared-steps';
import listSource from '../LazyHideStaticList/LazyHideStaticList.tsx?raw';
import itemSource from '../LazyHideStaticList/Item.tsx?raw';
import cssSource from '../LazyHideStaticList/LazyHideStaticList.css?raw';

export const LazyHideStaticRecipe: FC<Dials> = ({pace, origin, motion}) => <>
  <Story param="native" id="sort"
         can="The user can sort the list"
         soThat="it reads in the order they mean">
    {currencyTell}
    <Tell>This particular list keeps three more promises. The list holds calm and settles on the
      drop, so only the destination matters. One card rides the pointer, so no duplicate
      muddies the carry. And the settle lands instantly, so nothing competes with the drag
      session.</Tell>
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
      <Step title="Stash the landing, settle after the drag" dial={pace}>
        <Words want="You want the list calm while the platform drags, which means the reorder must wait for a session that is still alive when the drop lands.">
          <Says>Each dragover only remembers where the pointer last hovered, and
            a <Mdn path="Web/API/HTMLElement/dragleave_event">dragleave</Mdn> forgets it. The commit runs from the release: the session has to finish before the list moves,
            because the platform is still animating its own end of the bargain.</Says>
        </Words>
        <Codes>
          <Snippet label="JS" lines={[
            ...span(listSource, 'onDragOver={() => setLanding(index)}', 'onDragOver={() => setLanding(index)}'), gap,
            ...unit(listSource, 'onReleased={() => {')
          ]}/>
        </Codes>
      </Step>
      <Step title="Fade the origin to a whisper" dial={origin}>
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
      <Step title="Apply the state update directly" dial={motion}>
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
