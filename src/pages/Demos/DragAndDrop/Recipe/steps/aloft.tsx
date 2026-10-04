import {Codes, Mdn, Says, Snippet, Step, Words, aside} from '../../../Recipe';
import {span} from '../../../Recipe/carve';
import {Sample} from '@pages/Demos/Recipe/sample';

export const holdTheAloft = (listSource: Sample) =>
  <Step title="Keep which item is held in state, not in the drag’s payload">
    <Words want={<><Mdn path="Web/API/DataTransfer">dataTransfer</Mdn> is the object a drag event carries its data in, the
      payload. It exists to carry data between windows, and mid-drag it is locked: a handler
      for <Mdn path="Web/API/HTMLElement/dragover_event">dragover</Mdn>, the event the browser fires again and again
      on whatever the pointer is over, may not read what dragstart wrote. So the payload cannot steer the sort.</>}>
      <Says>Your first try writes the item into the payload at dragstart and reads it back in
        dragover, and the read comes back empty. That is not a bug: the store is sealed
        mid-drag so a hovered window cannot sniff data that was never dropped on it.</Says>
      <Says>Steer with state instead, the values React keeps between one drawing of the page and the next. The lift
        reports which item is held, which the code calls aloft, the release clears it, and every handler in between
        reads the same value the render does. The payload API is still there when another window genuinely needs the
        data.</Says>
    </Words>
    <Codes>
      <Snippet label="TS" lines={[
        ...span(listSource, 'onLifted={lifted => setAloft(maybe(lifted))}', 'onLifted={lifted => setAloft(maybe(lifted))}'),
        aside('// the item names itself; the list holds the answer')
      ]}/>
    </Codes>
  </Step>;
