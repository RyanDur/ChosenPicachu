import {FC} from 'react';
import {Tabs} from '@components/Tabs';
import {Concern, concernId, concernsInOrder} from '@pages/Record/moments/concerns';
import {practiceAddress} from './types';
import {StructurePractice} from './StructurePractice';
import {PresentationPractice} from './PresentationPractice';
import {BehaviorPractice} from './BehaviorPractice';
import './Practice.css';

const practices: Record<Concern, FC> = {
  'Structure': StructurePractice,
  'Presentation': PresentationPractice,
  'Behavior': BehaviorPractice
};

export const PracticePage: FC<{concern: Concern}> = ({concern}) => {
  const Practice = practices[concern];

  return <>
    <p className="practice-opening paragraph">
      Each tab below is one of the three concerns and says how I organize it: the rules I keep, the moments in the
      record that taught them, and the test that tells me a rule holds. The demos show the rules at work.
    </p>
    <Tabs label="practice" current={concernId(concern)}
      values={concernsInOrder.map(shown => ({display: shown, param: concernId(shown), to: practiceAddress(shown)}))}/>
    <section className="practice" aria-labelledby="practice-title">
      <h2 className="practice-title sub-title" id="practice-title">how I organize it</h2>
      <Practice/>
    </section>
  </>;
};
