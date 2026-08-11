import {Link} from 'react-router';
import {Paths} from '@pages/Paths';
import {DemoTopics} from '../../types';
import {Codes, Mdn, Says, Snippet, Step, Steps, Story, Tell, Words, aside, plain} from '../../Recipe';
import {span, unit} from '../../Recipe/carve';
import crossingSource from '../crossing.ts?raw';

export const gap = plain(' ');

export const platformCurrency =
  <Tell>The tables build their drag from pointer events and own every pixel; this
    list pays platform currency instead. Mark a card draggable and the ceremony
    arrives: the snapshot, the cursor, the cancel. What the platform asks in return is
    protocol, a series of consents and timings, and the steps below are those
    consents.</Tell>;

export const neverOurs =
  <Tell>Some pixels are never ours on this road: the snapshot, the cursor, the macOS
    cancel. We name them instead of faking them, and the <Link className="signpost"
    to={`${Paths.demos}?tab=${DemoTopics.tables}`}>Tables demo</Link> walks the road that
    owns them.</Tell>;

export const armTheDrag = (itemSource: string) =>
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
        ...span(itemSource, '<article', 'draggable={dragging}>')
      ]}/>
    </Codes>
  </Step>;

export const holdTheAloft = (listSource: string) =>
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
        ...span(listSource, 'onLifted={lifted => setAloft(maybe(lifted))}', 'onLifted={lifted => setAloft(maybe(lifted))}'),
        aside('// the item names itself; the list holds the answer')
      ]}/>
    </Codes>
  </Step>;

export const acceptTheDrop = (listSource: string) =>
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
  </Step>;

export const innerHalf =
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
  </Step>;

export const roadEnd =
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
  </Step>;

export const straightToOrder = (itemSource: string) =>
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
            ...unit(itemSource, 'const steps'), gap,
            ...unit(itemSource, 'onKeyDown={event =>')
          ]}/>
        </Codes>
      </Step>
    </Steps>
  </Story>;
