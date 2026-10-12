import {FC} from 'react';
import {PaceDial} from '../../../Controls';
import {Codes, Mdn, Says, Snippet, Step, Words} from '../../../Recipe';
import {Term} from '../Term';
import {span, unit} from '../../../Recipe/carve';
import {gap, sessionSource} from './sources';
import {Sample} from '@pages/Demos/Recipe/sample';

export const CommitCrossing: FC<{listSource: Sample}> = ({listSource}) =>
  <Step title="Commit inside the crossing" dial=<PaceDial name="native-pace"/>>
    <Words want="You want the list to answer the drag as it happens; waiting for the drop hides the result until it is too late to change your mind.">
      <Says>Commit the reorder inside the dragover that detected the <Term word="crossing">crossing</Term>: the state
        updates during the drag, the markup renders from it, and the same key finds its new seat while the browser still
        shows the drag image under the pointer. Carrying the item back is only more crossings, so the item can always
        get home.</Says>
    </Words>
    <Codes>
      <Snippet label="TS" lines={[
        ...unit(sessionSource, 'export const crossingOver'), gap,
        ...span(listSource, 'onDragOver={crossingOver(aloft, order)(item, index,', 'setOrder(previous => array.moveToIndex(index, held, previous));')
      ]}/>
    </Codes>
  </Step>;

export const StashLanding: FC<{listSource: Sample}> = ({listSource}) =>
  <Step title="Stash the landing, settle after the drag" dial=<PaceDial name="native-pace"/>>
    <Words want={<>You want the list calm while the platform drags, which means the reorder must wait for a <Term word="session">session</Term> that is still alive when the drop lands.</>}>
      <Says>Each dragover only remembers the <Term word="landing">landing</Term>, the item the pointer is over at that
        moment, and <Mdn path="Web/API/HTMLElement/dragleave_event">dragleave</Mdn>, the event for the pointer leaving
        an item, forgets it. Nothing moves until the release. The commit runs from the release, because the browser is
        still playing the end of its own drag until then, and the list has to wait for it.</Says>
    </Words>
    <Codes>
      <Snippet label="TS" lines={[
        ...span(listSource, 'onDragOver={() => setLanding(maybe(index))}', 'onDragOver={() => setLanding(maybe(index))}'), gap,
        ...unit(listSource, 'const release')
      ]}/>
    </Codes>
  </Step>;
