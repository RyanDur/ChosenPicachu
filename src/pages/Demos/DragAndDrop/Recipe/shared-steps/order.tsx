import {Codes, Says, Snippet, Step, Steps, Story, Tell, Words} from '../../../Recipe';
import {unit} from '../../../Recipe/carve';
import {gap} from './sources';

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
          <Snippet label="TS" lines={[
            ...unit(itemSource, 'const steps'), gap,
            ...unit(itemSource, 'onKeyDown={event =>')
          ]}/>
        </Codes>
      </Step>
    </Steps>
  </Story>;
