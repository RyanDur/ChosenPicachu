import {ReactNode} from 'react';
import {PaceDial} from '../../../Controls';
import {Codes, Mdn, Says, Snippet, Step, Words} from '../../../Recipe';
import {Term} from '../Term';
import {span, unit} from '../../../Recipe/carve';
import {gap, sessionSource} from './sources';

export const commitCrossing = (listSource: string): ReactNode =>
  <Step title="Commit inside the crossing" dial={<PaceDial name="native-pace"/>}>
    <Words want="You want the list to answer the drag as it happens; waiting for the drop hides the outcome until it is too late to change your mind.">
      <Says>Commit the reorder inside the dragover that detected the <Term word="crossing">crossing</Term>: the state updates
        mid-drag, the markup renders through it, and the same key finds its new seat while the
        platform still holds the snapshot in your hand. Carrying the item back is just more
        crossings, so home stays reachable.</Says>
    </Words>
    <Codes>
      <Snippet label="TS" lines={[
        ...unit(sessionSource, 'export const crossingOver'), gap,
        ...span(listSource, 'onDragOver={crossingOver(aloft, order)(item, index,', 'setOrder(previous => array.moveToIndex(index, held, previous));')
      ]}/>
    </Codes>
  </Step>;

export const stashLanding = (listSource: string): ReactNode =>
  <Step title="Stash the landing, settle after the drag" dial={<PaceDial name="native-pace"/>}>
    <Words want={<>You want the list calm while the platform drags, which means the reorder must wait for a <Term word="session">session</Term> that is still alive when the drop lands.</>}>
      <Says>Each dragover only remembers the <Term word="landing">landing</Term> where the pointer last hovered, and
        a <Mdn path="Web/API/HTMLElement/dragleave_event">dragleave</Mdn> forgets it. The commit runs from the release: the session has to finish before the list moves,
        because the platform is still animating its own end of the bargain.</Says>
    </Words>
    <Codes>
      <Snippet label="TS" lines={[
        ...span(listSource, 'onDragOver={() => setLanding(maybe(index))}', 'onDragOver={() => setLanding(maybe(index))}'), gap,
        ...unit(listSource, 'const release')
      ]}/>
    </Codes>
  </Step>;
