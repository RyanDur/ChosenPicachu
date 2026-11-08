import {FC} from 'react';
import {useArrival} from '@frame/navigation/arrival';
import {Tabs} from '@frame/navigation/Tabs';
import {Concern, concernId, concernsInOrder} from '@pages/Record/moments/concerns';
import {practiceAddress} from './types';
import {StructurePractice} from './StructurePractice';
import {PresentationPractice} from './PresentationPractice';
import {BehaviorPractice} from './BehaviorPractice';
import './Practice.css';

const appContinuum = 'https://www.appcontinuum.io/';

const practices: Record<Concern, FC> = {
  'Structure': StructurePractice,
  'Presentation': PresentationPractice,
  'Behavior': BehaviorPractice
};

export const PracticePage: FC<{concern: Concern}> = ({concern}) => {
  useArrival();
  const Practice = practices[concern];

  return <>
    <div className="practice-opening">
      <p className="paragraph">Each tab below is one of the three concerns and says how I organize it: the rules I keep,
        the moments in the Record that taught them, and the test that tells me a rule holds. The demos show the rules at
        work. One principle runs through all three, and it is worth saying once before the tabs apply it.</p>
      <p className="paragraph">Code is read more often than it is written, and the reader is usually someone who was not
        there, including me when I come back to it. So I organize for the reader: the code says what it means. An
        element says what the thing is. When no element does, I make one and name it for the one behavior it adds. A
        class says what the element is, what it needs, or what is true right now, and the style sheet says what that
        means today. An event says what happened, in the past tense. A type says what is true and refuses what cannot
        be. A condition reads as a
        sentence, <code className="monospaced">has</code>, <code className="monospaced">not</code>, <code className="monospaced">empty</code>, the same words the style sheet uses
        in <code className="monospaced">:has()</code>, <code className="monospaced">:not()</code> and <code className="monospaced">:empty</code>. Files sit by feature too, so a change to the
        gallery is in the gallery. <a className="signpost" href={appContinuum}>The Application Continuum</a>, a guide
        to organizing an application as it grows, lays files out that way. It ranks the work
        plainly: <a className="signpost" href={appContinuum}>“Naming, organizing, and reducing circular dependencies are
          the three most important things you’ll ever do as a programmer”</a>.</p>
    </div>
    <Tabs label="practice" current={concernId(concern)}
      values={concernsInOrder.map(shown => ({display: shown, param: concernId(shown), to: practiceAddress(shown)}))}/>
    <section className="practice" aria-labelledby="practice-title">
      <h2 className="sub-title" id="practice-title">how I organize it</h2>
      <Practice/>
    </section>
  </>;
};
