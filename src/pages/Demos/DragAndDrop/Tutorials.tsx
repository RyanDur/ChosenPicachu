import {FC, useId} from 'react';
import {useSearchParamsObject} from '@components/search-params';
import {motionParam, originParam, paceParam} from '../Controls';
import {Clues, Design, Slices} from '../Recipe/Arc';
import {DialNote, Exercise, Station} from '../Recipe';
import {useArrival} from '@components/OpeningFragment';
import {ListControls} from './ListControls';
import {NativeRecipe} from './NativeRecipe';
import '../Tutorials.css';

const clues: [string, string][] = [
  ['the order is mine', 'The order belongs to the user, not us. Nothing reorders on its own.'],
  ['belongs above something else', 'One dimension. Position against neighbours is the meaning.'],
  ['pick it up and put it there', 'Direct manipulation, by pointer or by key. The platform ships the drag.'],
  ['see it stay where I dropped it', 'The drop is the commit, and the landing has to be visible.']
];

const Sketch: FC = () =>
  <div className="design-sketch" aria-hidden="true">
    {['first', 'second', 'third', 'fourth'].map(item =>
      <div className="design-item card hairline-edged rounded-corners" key={item}>
        <span className="muted-ink">≡</span>
        <span className="design-line field rounded-corners"/>
      </div>)}
  </div>;

const unanswered = [
  'Whether the list should make room as you hover, or hold still until the drop.',
  'What the hand may grab: the whole card, or a handle.',
  'What happens when a drop misses the list.',
  'Whether the order should survive a reload.'
];

export const ListTutorials: FC = () => {
  const {pace = 'eager', origin = 'hide', motion = 'animated', updateSearchParams} =
    useSearchParamsObject({pace: paceParam, origin: originParam, motion: motionParam});
  useArrival();
  const titled = `tutorials${useId()}`;
  return <section aria-labelledby={titled} className="tutorials">
    <h2 id={titled} className="title">let’s build this feature</h2>
    <ol className="spine" aria-label="the stations">
      <Station at={1}>
        <Clues quote="These priorities are mine, and the order is mine. When something belongs above something else, I want to pick it up and put it there, and see it stay where I dropped it."
          by="a user"
          clues={clues}
          verdict="Items whose position is the meaning are a list, and an ordered list is the element built for it: entries a reader and a screen reader both walk, in exactly the order the markup says."/>
      </Station>
      <Station at={2}>
        <Design sketch=<Sketch/>
          answers="The design answers shape: how a card reads, where the hand grabs, how dense the stack. The exhibit lays the list across the page, so the grip’s arrows are left and right."
          unanswered={unanswered}/>
      </Station>
      <Station at={3}>
        <Slices who="user"
          can="The user can keep the list in the order they mean"
          soThat="so that what belongs above sits above"
          slices="It slices thin: the same reorder, twice. Once by pointer, on the platform’s own drag and drop, and once by keyboard, moving the order directly. Both are cards in the last station, and each opens into its build."
          sliced={[
            ['The user can arrange the list by hand', 4],
            ['The user can arrange the list from the keyboard', 4]
          ]}/>
        <Exercise/>
      </Station>
      <Station at={4}>
        <h3 className="phase-title title">Layer on functionality, in the order it was asked for</h3>
        <DialNote reads="list"/>
        <ListControls pace={pace} origin={origin} motion={motion}
          onPaceChosen={next => updateSearchParams({pace: next})}
          onOriginChosen={next => updateSearchParams({origin: next})}
          onMotionChosen={next => updateSearchParams({motion: next})}/>
        <NativeRecipe/>
      </Station>
    </ol>
  </section>;
};
