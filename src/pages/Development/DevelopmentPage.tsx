import {FC} from 'react';
import {useSearchParamsObject} from '@components/search-params';
import {Tabs} from '@components/Tabs';
import {developmentTabParam, DevelopmentTabs, tabConcerns} from './types';
import {StructurePractice} from './StructurePractice';
import {PresentationPractice} from './PresentationPractice';
import {DynamicInteractionPractice} from './DynamicInteractionPractice';
import './Development.css';

const practices: Record<DevelopmentTabs, FC> = {
  [DevelopmentTabs.structure]: StructurePractice,
  [DevelopmentTabs.presentation]: PresentationPractice,
  [DevelopmentTabs.dynamicInteraction]: DynamicInteractionPractice
};

const tabs = Object.values(DevelopmentTabs).map(param => ({display: tabConcerns[param], param}));

export const DevelopmentPage: FC = () => {
  const {tab} = useSearchParamsObject({tab: developmentTabParam}, {tab: DevelopmentTabs.structure});
  const Practice = practices[tab];

  return <>
    <p className="development-opening paragraph">
      Each tab below is one of the three concerns and says how I organize it: the rules I keep, the moment in the
      record where each was learned, and the test that tells me a rule holds. The demos show the rules at work.
    </p>
    <Tabs label="development" defaultTab={DevelopmentTabs.structure} values={tabs}/>
    <section className="practice" aria-labelledby="practice-title">
      <h2 className="practice-title sub-title" id="practice-title">how I organize it</h2>
      <Practice/>
    </section>
  </>;
};
