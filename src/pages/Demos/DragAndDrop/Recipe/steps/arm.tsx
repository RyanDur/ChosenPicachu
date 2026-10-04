import {Codes, Mdn, Says, Snippet, Step, Words} from '../../../Recipe';
import {span} from '../../../Recipe/carve';

export const armTheDrag = (itemSource: string) =>
  <Step title="Arm the drag from its handle">
    <Words want="The platform will drag anything marked draggable, but marking the whole card turns every press into a lift and kills text selection inside it.">
      <Says>draggable is an attribute, a setting written on the element, so let the grip arm it. An event is the
        browser telling the page that something happened. On mousedown, the event for a mouse button going down, the
        handle sets a flag, and the card renders draggable just for that gesture. Then the browser
        fires <Mdn path="Web/API/HTMLElement/dragstart_event">dragstart</Mdn>, the event for a drag beginning, and its
        handler declares the move the platform is about to make. The browser answers with the whole ceremony (the
        snapshot under your pointer, the cursor, the cancel) without another line.</Says>
    </Words>
    <Codes>
      <Snippet label="HTML" lines={[
        ...span(itemSource, '<li', 'draggable={dragging}>')
      ]}/>
    </Codes>
  </Step>;
