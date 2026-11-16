import {FC} from 'react';
import {PaceDial} from '../../../Controls';
import {carve, Codes, DialStep, lines, Mdn, Sample, Says, Snippet, StepHeading, Want, Words} from '../../../Recipe';
import {Term} from '../Term';
import {sources} from './sources';

export const StashLanding: FC<{listSource: Sample}> = ({listSource}) =>
  <DialStep>
    <StepHeading title="Stash the landing, settle after the drag"><PaceDial name="native-pace"/></StepHeading>
    <Words>
      <Want>You want the list to hold still while the platform drags. The drop lands while
        the <Term word="session">session</Term> is
        still alive, so the reorder has to wait for the session to end.</Want>
      <Says>Each dragover stores the <Term word="landing">landing</Term>, the item the pointer is over at that
        moment, and the list’s <Mdn path="Web/API/HTMLElement/dragleave_event">dragleave</Mdn> handler, which
        runs when the pointer leaves an item or the list, clears it. Nothing moves until the release. The commit runs
        from dragend, the event that ends the session, because the browser is still playing the end of its own drag
        until then.</Says>
    </Words>
    <Codes>
      <Snippet label="TS" lines={[
        ...carve.between(listSource, 'onDragOver={() => dispatch(dragSortChange.hovered(index))}', 'onDragOver={() => dispatch(dragSortChange.hovered(index))}'), lines.blank,
        ...carve.between(listSource, 'onDragLeave={() => dispatch(dragSortChange.left())}', 'onDragLeave={() => dispatch(dragSortChange.left())}'), lines.blank,
        ...carve.unit(sources.dragSort, 'const settled')
      ]}/>
    </Codes>
  </DialStep>;
