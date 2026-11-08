import {TabLink} from '@pages/Demos/TabLink';
import {DemoTopics} from '../../../demo-topics';
import {FC} from 'react';
import {Codes, Mdn, Says, Snippet, Step, Words, carve, Sample} from '../../../Recipe';

export const ArmTheDrag: FC<{itemSource: Sample}> = ({itemSource}) =>
  <Step title="Arm the drag from its grip">
    <Words want="The browser will drag anything marked draggable, but marking the whole card turns every press into a lift and stops text selection inside it.">
      <Says><code className="monospaced">draggable</code> is an attribute, a setting written on the element, and the
        grip turns it on. An event is the browser telling the page that something happened.
        The <TabLink to={DemoTopics.zIndex}>z-index tab</TabLink> says more about events. On pointerdown, the event for
        a mouse button, a pen or a finger pressing down, the list records the pressed item as gripped, and the card
        renders <code className="monospaced">draggable</code> only while it is the gripped one.</Says>
      <Says>Then the browser fires <Mdn path="Web/API/HTMLElement/dragstart_event">dragstart</Mdn>, the event for a drag
        beginning, and its handler sets <code className="monospaced">effectAllowed</code> to move: this drag moves the
        card, it does not copy or link it.</Says>
      <Says>The li, the list item that is the card, also wears four shared classes, looks that live in the site’s shared
        style sheet and that an element wears by
        name: <code className="monospaced">soft-cornered</code>, <code className="monospaced">field</code>, <code className="monospaced">hairline-outline</code> and{' '}
      <code className="monospaced">handle-raised</code>. They are the
        card’s look, not its drag.</Says>
    </Words>
    <Codes>
      <Snippet label="HTML" lines={[
        ...carve.span(itemSource, '<li', 'draggable={gripped.map(pressed => pressed === item).orElse(false)}>')
      ]}/>
    </Codes>
  </Step>;
