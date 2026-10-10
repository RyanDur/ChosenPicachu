import {Codes, Mdn, Says, Snippet, Step, Words} from '../../../Recipe';
import {span} from '../../../Recipe/carve';
import {gap} from './sources';
import {Sample} from '@pages/Demos/Recipe/sample';

export const acceptTheDrop = (listSource: Sample, itemSource: Sample) =>
  <Step title="Accept the drop, or the platform takes it back">
    <Words want="By default nothing accepts a drop: release over the list and the browser plays the cancel, carrying the card back to where it came from, and you cannot stop it.">
      <Says>A bare list looks finished. Then you release over it, the card flies back, and your drop handler never ran.</Says>
      <Says>One call accepts the <Mdn path="Web/API/HTMLElement/drop_event">drop</Mdn>: the dragover handler
        calls <Mdn path="Web/API/Event/preventDefault">preventDefault</Mdn>, the method that tells the browser not to do
        what it would by default. The default is to refuse the drop, so preventing it accepts the drop, and nothing else
        stops the cancel.</Says>
      <Says>The item’s dragover handler also sets <Mdn path="Web/API/DataTransfer/dropEffect">dropEffect</Mdn>, a
        property of dataTransfer. It is optional and only picks the cursor, and its value has to be one of the effects
        effectAllowed permits, which dragstart sets to say what effects a drag allows, here move.</Says>
      <Says>The drop handler, for the event of a release over a target, calls preventDefault too. The browser’s default
        for a dropped link, file or address is to open it as a page; this list drags none of those, so the call changes
        nothing today and keeps the list safe the day a payload is added.</Says>
    </Words>
    <Codes>
      <Snippet label="HTML" lines={[
        ...span(listSource, '<ol aria-label="sortable list"', 'onDrop={event => event.preventDefault()}'), gap,
        ...span(itemSource, 'onDragOver={event => {', '}}')
      ]}/>
    </Codes>
  </Step>;
