import {FC} from 'react';
import {Codes, Mdn, Says, Snippet, Step, Words} from '../../../Recipe';
import {span} from '../../../Recipe/carve';
import {Sample} from '@pages/Demos/Recipe/sample';

export const ArmTheDrag: FC<{itemSource: Sample}> = ({itemSource}) =>
  <Step title="Arm the drag from its grip">
    <Words want="The browser will drag anything marked draggable, but marking the whole card turns every press into a lift and stops text selection inside it.">
      <Says>draggable is an attribute, a setting written on the element, and the grip turns it on. An event is the
        browser telling the page that something happened. On pointerdown, the event for a mouse button, a pen or a
        finger pressing down, the grip sets a flag, and the card renders draggable for that gesture only.</Says>
      <Says>Then the browser fires <Mdn path="Web/API/HTMLElement/dragstart_event">dragstart</Mdn>, the event for a drag
        beginning, and its handler sets <code>effectAllowed</code> to move: this drag moves the card, it does not copy or link it.</Says>
      <Says>The li, the list item that is the card, also wears four shared classes, looks that live in the site’s shared
        sheet and that an element wears by name: soft-cornered, field, hairline-outline and handle-raised. They are the
        card’s look, not its drag.</Says>
    </Words>
    <Codes>
      <Snippet label="HTML" lines={[
        ...span(itemSource, '<li', 'draggable={dragging}>')
      ]}/>
    </Codes>
  </Step>;
