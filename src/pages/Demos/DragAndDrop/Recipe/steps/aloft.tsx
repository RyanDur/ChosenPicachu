import {Codes, Mdn, Says, Snippet, Step, Words, aside} from '../../../Recipe';
import {span} from '../../../Recipe/carve';

export const holdTheAloft = (listSource: string) =>
  <Step title="Hold the aloft in state, not in the payload">
    <Words want={<><Mdn path="Web/API/DataTransfer">dataTransfer</Mdn> exists to carry data between
      windows, and mid-drag it is locked:
      a <Mdn path="Web/API/HTMLElement/dragover_event">dragover</Mdn> may not read what
      dragstart wrote, so the payload cannot steer the sort.</>}>
      <Says>Your first try writes the item into the payload at dragstart and reads it back in
        dragover, and the read comes back empty. That is not a bug: the store is sealed
        mid-drag so a hovered window cannot sniff data that was never dropped on it.</Says>
      <Says>Steer with state instead. The lift reports which item is aloft, the release clears
        it, and every handler in between reads the same value the render does. The payload API
        is still there when another window genuinely needs the data.</Says>
    </Words>
    <Codes>
      <Snippet label="TS" lines={[
        ...span(listSource, 'onLifted={lifted => setAloft(maybe(lifted))}', 'onLifted={lifted => setAloft(maybe(lifted))}'),
        aside('// the item names itself; the list holds the answer')
      ]}/>
    </Codes>
  </Step>;
