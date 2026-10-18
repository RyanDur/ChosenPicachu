import {FC} from 'react';
import {PaceDial} from '../../../Controls';
import {Codes, Mdn, Says, Snippet, Step, Words} from '../../../Recipe';
import {Term} from '../Term';
import {span, unit} from '../../../Recipe/carve';
import {gap, sessionSource} from './sources';
import {Sample} from '@pages/Demos/Recipe/sample';

export const CommitCrossing: FC<{listSource: Sample}> = ({listSource}) =>
  <Step title="Commit inside the crossing" dial={<PaceDial name="native-pace"/>}>
    <Words want="You want the order to move as you drag; waiting for the drop hides the result until it is too late to change your mind.">
      <Says>Commit the reorder inside the dragover that detected the <Term word="crossing">crossing</Term>. The state
        updates during the drag, the markup renders from it, and React moves the li with the same key to its new place while the browser still
        shows the drag image under the pointer. Carrying the item back is only more crossings, so the item can always return to its old place. While an item is still sliding, the handler ignores crossings over it.</Says>
    </Words>
    <Codes>
      <Snippet label="TS" lines={[
        ...unit(sessionSource, 'export const crossingOver'), gap,
        ...span(listSource, 'onDragOver={crossingOver(aloft, order)(item, index,', 'setOrder(previous => array.moveToIndex(index, held, previous));')
      ]}/>
    </Codes>
  </Step>;

export const StashLanding: FC<{listSource: Sample}> = ({listSource}) =>
  <Step title="Stash the landing, settle after the drag" dial={<PaceDial name="native-pace"/>}>
    <Words want={<>You want the list to hold still while the platform drags. The drop lands while the <Term word="session">session</Term> is
      still alive, so the reorder has to wait for the session to end.</>}>
      <Says>Each dragover stores the <Term word="landing">landing</Term>, the item the pointer is over at that
        moment, and the list’s <Mdn path="Web/API/HTMLElement/dragleave_event">dragleave</Mdn> handler, which
        runs when the pointer leaves an item or the list, clears it. Nothing moves until the release. The commit runs from dragend, the event that ends the session, because
        the browser is still playing the end of its own drag until then.</Says>
    </Words>
    <Codes>
      <Snippet label="TS" lines={[
        ...span(listSource, 'onDragOver={() => setLanding(maybe(index))}', 'onDragOver={() => setLanding(maybe(index))}'), gap,
        ...span(listSource, 'onDragLeave={() => setLanding(nothing())}', 'onDragLeave={() => setLanding(nothing())}'), gap,
        ...unit(listSource, 'const release')
      ]}/>
    </Codes>
  </Step>;
