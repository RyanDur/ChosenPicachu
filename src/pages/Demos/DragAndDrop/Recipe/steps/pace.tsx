import {FC} from 'react';
import {PaceDial} from '../../../Controls';
import {Codes, Sample, Says, Snippet, Step, Words, carve, lines} from '../../../Recipe';
import {Term} from '../Term';
import {sources} from './sources';

const gap = lines.plain(' ');

export const CommitCrossing: FC<{listSource: Sample}> = ({listSource}) =>
  <Step title="Commit inside the crossing" dial={<PaceDial name="native-pace"/>}>
    <Words want="You want the order to move as you drag; waiting for the drop hides the result until it is too late to change your mind.">
      <Says>Commit the reorder inside the dragover that detected the <Term word="crossing">crossing</Term>. The state
        updates during the drag, the markup renders from it, and React moves the li with the same key to its new place
        while the browser still shows the drag image under the pointer. Carrying the item back is only more crossings,
        so the item can always return to its old place. While an item is still sliding, the reducer ignores crossings
        over it.</Says>
    </Words>
    <Codes>
      <Snippet label="TS" lines={[
        ...carve.unit(sources.crossing, 'const over'), gap,
        ...carve.span(listSource, 'onDragOver={crossing.over(sort.held, sort.order)(item, index, homeward =>', 'dispatch(dragSortChange.crossed(index, homeward)))}'), gap,
        ...carve.unit(sources.dragSort, 'const crossed')
      ]}/>
    </Codes>
  </Step>;
