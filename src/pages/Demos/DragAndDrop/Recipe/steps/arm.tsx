import {Codes, Mdn, Says, Snippet, Step, Words} from '../../../Recipe';
import {span} from '../../../Recipe/carve';
import {Sample} from '@pages/Demos/Recipe/sample';

export const armTheDrag = (itemSource: Sample) =>
  <Step title="Arm the drag from its handle">
    <Words want="The platform will drag anything marked draggable, but marking the whole card turns every press into a lift and kills text selection inside it.">
      <Says>draggable is an attribute, a setting written on the element, so let the grip arm it. An event is the
        browser telling the page that something happened. On pointerdown, the event for a mouse button, a pen or a finger
        pressing down, the handle sets a flag, and the card renders draggable just for that gesture. The li also wears
        the shared classes that paint the card, soft-cornered, field, hairline-outline and handle-raised; they are its
        look, not its drag.</Says>
      <Says>Then the browser fires <Mdn path="Web/API/HTMLElement/dragstart_event">dragstart</Mdn>, the event for a drag
        beginning, and its handler declares the move the platform is about to make. The browser answers with the whole
        ceremony (the drag image under your pointer, the cursor, the cancel) without another line.</Says>
    </Words>
    <Codes>
      <Snippet label="HTML" lines={[
        ...span(itemSource, '<li', 'draggable={dragging}>')
      ]}/>
    </Codes>
  </Step>;
