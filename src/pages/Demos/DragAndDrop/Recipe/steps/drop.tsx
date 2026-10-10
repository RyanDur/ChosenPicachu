import {Codes, Mdn, Says, Snippet, Step, Words} from '../../../Recipe';
import {span} from '../../../Recipe/carve';
import {Sample} from '@pages/Demos/Recipe/sample';

export const acceptTheDrop = (listSource: Sample) =>
  <Step title="Accept the drop, or the platform takes it back">
    <Words want="By default nothing accepts a drop: release over the list and the browser plays the cancel, carrying the card back to where it came from, and you cannot stop it.">
      <Says>A bare list looks finished. Then you release over it, the card flies back, and your drop handler never ran.</Says>
      <Says>Accepting a <Mdn path="Web/API/HTMLElement/drop_event">drop</Mdn> takes three things. The dragover handler
        calls <Mdn path="Web/API/Event/preventDefault">preventDefault</Mdn>, the method that tells the browser not to do
        what it would by default; the default is to refuse the drop, so preventing it accepts the drop, and nothing else
        stops the cancel. Setting <Mdn path="Web/API/DataTransfer/dropEffect">dropEffect</Mdn>, a property of
        dataTransfer, picks the cursor, and it has to be one of the effects effectAllowed permits, which here is move.
        And the handler for drop, the event for a release over a target, calls preventDefault so the browser does not
        open the payload as a page. Miss the first and the browser plays the cancel; miss the last and it opens the
        payload.</Says>
    </Words>
    <Codes>
      <Snippet label="HTML" lines={[
        ...span(listSource, '<ol aria-label="sortable list"', 'onDrop={event => event.preventDefault()}')
      ]}/>
    </Codes>
  </Step>;
