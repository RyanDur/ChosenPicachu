import {FC} from 'react';
import {Tabs} from '@components/Tabs';
import {Concern, concernId} from '@pages/Record/moments/concerns';
import {concernTabs} from './types';
import {useConcernShown} from './useConcernShown';
import {StructurePractice} from './StructurePractice';
import {PresentationPractice} from './PresentationPractice';
import {DynamicInteractionPractice} from './DynamicInteractionPractice';
import './Development.css';

const practices: Record<Concern, FC> = {
  'Structure': StructurePractice,
  'Presentation': PresentationPractice,
  'Dynamic Interaction': DynamicInteractionPractice
};

export const DevelopmentPage: FC = () => {
  const concern = useConcernShown();
  const Practice = practices[concern];

  return <>
    <p className="development-opening paragraph">
      Each tab below is one of the three concerns and says how I organize it: the rules I keep, the moments in the
      record that taught them, and the test that tells me a rule holds. The demos show the rules at work.
    </p>
    <Tabs label="development" current={concernId(concern)} values={concernTabs}/>
    <section className="practice" aria-labelledby="practice-title">
      <h2 className="practice-title sub-title" id="practice-title">how I organize it</h2>
      <Practice/>
    </section>
  </>;
};
