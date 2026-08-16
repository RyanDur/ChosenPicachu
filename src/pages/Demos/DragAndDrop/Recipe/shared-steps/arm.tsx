import {Codes, Mdn, Says, Snippet, Step, Words} from '../../../Recipe';
import {span} from '../../../Recipe/carve';

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
