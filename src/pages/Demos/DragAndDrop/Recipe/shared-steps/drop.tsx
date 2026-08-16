import {Codes, Mdn, Says, Snippet, Step, Words, aside, plain} from '../../../Recipe';
import {span} from '../../../Recipe/carve';
import {gap} from './sources';

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
