import {FC} from 'react';
import {Tabs} from '@components/Tabs';
import {Concern, concernId, concernsInOrder} from '@pages/Record/moments/concerns';
import {practiceAddress} from './types';
import {StructurePractice} from './StructurePractice';
import {PresentationPractice} from './PresentationPractice';
import {BehaviorPractice} from './BehaviorPractice';
import './Practice.css';

const appContinuum = 'https://www.appcontinuum.io/';
const utilityFirst = 'https://v3.tailwindcss.com/docs/utility-first';

const practices: Record<Concern, FC> = {
  'Structure': StructurePractice,
  'Presentation': PresentationPractice,
  'Behavior': BehaviorPractice
};

export const PracticePage: FC<{concern: Concern}> = ({concern}) => {
  const Practice = practices[concern];

  return <>
    <div className="practice-opening">
      <p className="paragraph">Each tab below is one of the three concerns and says how I organize it: the rules I keep, the
        moments in the Record that taught them, and the test that tells me a rule holds. The demos show the rules at work.
        One principle runs through all three, and it is worth saying once before the tabs apply it.</p>
      <p className="paragraph">Code is read more often than it is written, and the reader is usually someone who was not
        there, including me a year on. So I organize for the reader: the code says what it means. An element says what
        the thing is, and when no element does, I make one and name it for the one behavior it adds. A class says what
        the element is, what it needs, or what is true right now, and the number lives in the sheet under a name. An
        event says what happened, in the past tense; a type says what is true and refuses what cannot be; a condition
        reads as a sentence, <code>has</code>, <code>not</code>, <code>empty</code>, the same words the sheet uses
        in <code>:has()</code>, <code>:not()</code> and <code>:is()</code>. Files sit by feature, the
        way <a className="signpost" href={appContinuum}>the App Continuum</a> lays them out, so a change to the gallery
        is in the gallery; its authors put it plainly: <a className="signpost" href={appContinuum}>“Naming, organizing,
          and reducing circular dependencies are the three most important things you’ll ever do as a programmer”</a>,
        and <a className="signpost" href={appContinuum}>“Common or Util tells the reader absolutely nothing”</a>.</p>
      <p className="paragraph">Tailwind makes the other case, and it is worth reading in its own
        words: <a className="signpost" href={utilityFirst}>“You aren’t wasting energy inventing class names”</a>. A name
        is a cost, so stop paying it, and the CSS stops growing and changes feel safer because a class is local. I think
        the energy is not wasted; it is the writer paying once what every reader would otherwise pay each
        time. <code>shadow-md p-4 flex</code> says what an element looks like to someone who knows the
        system; <code>lifted padded rounded-corners</code> says what it needs to anyone. Tailwind names its own
        cost, <a className="signpost" href={utilityFirst}>“managing commonly repeated utility combinations”</a>, and
        that cost is the name not given, coming due later. Where I agree with Tailwind is real (compose a look from shared
        pieces, constrain the values, no abstraction before the second use; the Presentation tab says where), and where I
        part is here: the name is the intent, and the intent is what the next reader needs.</p>
    </div>
    <Tabs label="practice" current={concernId(concern)}
      values={concernsInOrder.map(shown => ({display: shown, param: concernId(shown), to: practiceAddress(shown)}))}/>
    <section className="practice" aria-labelledby="practice-title">
      <h2 className="practice-title sub-title" id="practice-title">how I organize it</h2>
      <Practice/>
    </section>
  </>;
};
