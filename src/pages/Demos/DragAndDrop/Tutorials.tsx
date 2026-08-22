import {FC} from 'react';
import {useSearchParamsObject} from '@components/search-params';
import {motionParam, originParam, paceParam} from '../Controls';
import {Clues, Design, Slices} from '../Recipe/Arc';
import {DialNote, Exercise, stationId, useArrival} from '../Recipe';
import {ListControls} from './ListControls';
import {NativeRecipe} from './NativeRecipe';
import '../Tutorials.css';

const clues: [string, string][] = [
  ['the order is mine', 'The order is the user’s state; the app only renders it. Nothing reorders on its own.'],
  ['belongs above something else', 'One dimension. Position against neighbours is the meaning.'],
  ['pick it up and put it there', 'Direct manipulation: a drag, not arrows in a form. The platform sells one.'],
  ['see it land where I dropped it', 'The drop is the commit, and the eye needs the landing told.']
];

const sketch = <>
  {['first', 'second', 'third', 'fourth'].map(item =>
    <div className="design-item" key={item}>
      <span className="design-grip">≡</span>
      <span className="design-line"/>
    </div>)}
</>;

const unanswered = [
  'Whether the list should make room as you hover, or hold still until the drop.',
  'What the hand may grab: the whole card, or a handle.',
  'What happens when a drop misses the list.',
  'Whether an order should survive a reload.'
];

export const ListTutorials: FC = () => {
  const {pace = 'eager', origin = 'hide', motion = 'animated', updateSearchParams} =
    useSearchParamsObject({pace: paceParam, origin: originParam, motion: motionParam});
  useArrival();
  return <section className="tutorials">
    <h2 className="tutorials-title">let’s build this feature</h2>
    <ol className="spine">
      <li className="station" id={stationId(1)}>
        <Clues quote="I have a list, and the order is mine. When something belongs above something else, I want to pick it up and put it there, and see it land where I dropped it."
               by="a user"
               clues={clues}
               verdict="Items whose positions carry the meaning are a list, and the platform’s list element carries it: entries a reader and a screen reader both walk, in exactly the order the markup says. Everything after this point is layered onto that one choice."/>
      </li>
      <li className="station" id={stationId(2)}>
        <Design sketch={sketch}
                answers="The design answers shape: how a card reads, where the hand grabs, how dense the stack."
                unanswered={unanswered}/>
      </li>
      <li className="station" id={stationId(3)}>
        <Slices who="user"
                can="The user can keep the list in the order they mean"
                soThat="so that what belongs above sits above"
                slices="It slices thin: the same sort told twice, once by pointer on the platform’s own drag-and-drop road, and once by keyboard going straight to the order. Every card below is one of the slices, and each opens into its build."
                sliced={[
                  ['The user can sort the list', 4],
                  ['The user can sort without a mouse', 4]
                ]}/>
        <Exercise interprets="list"/>
      </li>
      <li className="station" id={stationId(4)}>
        <h3 className="phase-title">Layer on functionality, in the order it was asked for</h3>
        <DialNote reads="list"/>
        <ListControls pace={pace} origin={origin} motion={motion}
                      onPace={next => updateSearchParams({pace: next})}
                      onOrigin={next => updateSearchParams({origin: next})}
                      onMotion={next => updateSearchParams({motion: next})}/>
        <NativeRecipe/>
      </li>
    </ol>
  </section>;
};
