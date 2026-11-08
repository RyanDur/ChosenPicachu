import {FC} from 'react';
import {PaceDial} from '../../../Controls';
import {Codes, Mdn, Sample, Says, Snippet, Step, Words, carve, lines} from '../../../Recipe';
import {Term} from '../Term';

const gap = lines.plain(' ');

export const StashLanding: FC<{listSource: Sample}> = ({listSource}) =>
  <Step title="Stash the landing, settle after the drag" dial={<PaceDial name="native-pace"/>}>
    <Words want={<>You want the list to hold still while the platform drags. The drop lands while
      the <Term word="session">session</Term> is
      still alive, so the reorder has to wait for the session to end.</>}>
      <Says>Each dragover stores the <Term word="landing">landing</Term>, the item the pointer is over at that
        moment, and the list’s <Mdn path="Web/API/HTMLElement/dragleave_event">dragleave</Mdn> handler, which
        runs when the pointer leaves an item or the list, clears it. Nothing moves until the release. The commit runs
        from dragend, the event that ends the session, because the browser is still playing the end of its own drag
        until then.</Says>
    </Words>
    <Codes>
      <Snippet label="TS" lines={[
        ...carve.span(listSource, 'onDragOver={() => setLanding(maybe(index))}', 'onDragOver={() => setLanding(maybe(index))}'), gap,
        ...carve.span(listSource, 'onDragLeave={() => setLanding(nothing())}', 'onDragLeave={() => setLanding(nothing())}'), gap,
        ...carve.unit(listSource, 'const release')
      ]}/>
    </Codes>
  </Step>;
