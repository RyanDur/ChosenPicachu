import {FC} from 'react';
import {PaceDial} from '../../../Controls';
import {carve, Codes, DialStep, lines, Sample, Says, Snippet, StepHeading, Want, Words} from '../../../Recipe';
import {Term} from '../Term';
import {sources} from './sources';

export const CommitCrossing: FC<{listSource: Sample}> = ({listSource}) =>
  <DialStep>
    <StepHeading title="Commit inside the crossing"><PaceDial name="native-pace"/></StepHeading>
    <Words>
      <Want>You want the order to move as you drag; waiting for the drop hides the result until it is too late to change
        your mind.</Want>
      <Says>Commit the reorder inside the dragover that detected the <Term word="crossing">crossing</Term>. The state
        updates during the drag, the markup renders from it, and React moves the li with the same key to its new place
        while the browser still shows the drag image under the pointer. Carrying the item back is only more crossings,
        so the item can always return to its old place. While an item is still sliding, the reducer ignores crossings
        over it.</Says>
    </Words>
    <Codes>
      <Snippet label="TS" lines={[
        ...carve.unit(sources.crossing, 'const over'), lines.blank,
        ...carve.between(listSource, 'onDragOver={crossing.over(sort.held, sort.order)(item, index, homeward =>', 'dispatch(dragSortChange.crossed(index, homeward)))}'), lines.blank,
        ...carve.unit(sources.dragSort, 'const crossed')
      ]}/>
    </Codes>
  </DialStep>;
