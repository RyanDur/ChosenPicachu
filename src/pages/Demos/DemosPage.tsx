import {FC, PropsWithChildren} from 'react';
import {useSearchParamsObject} from '@navigation/search-params';
import './DemosPage.css';
import './Tutorials.css';
import {Tabs} from '@navigation/Tabs';
import {DemoTopics} from './demo-topics';
import {demoTab} from './demo-tab';

export const DemosPage: FC<PropsWithChildren<{topic: DemoTopics}>> = ({topic, children}) => {
  const {searchFromShown} = useSearchParamsObject({});

  return <>
    <p className="demos-opening paragraph">
      Each tab below is one feature a page needs. I built each one here and explain it. The tabs run from simple to
      expert: an accordion, a menu that opens under a card, a list you sort by dragging, a live chart, and a table whose
      columns and rows you drag while trades keep landing. A tab shows the
      feature first, with dials wherever the build has a choice. Then comes the explanation, with what the platform
      gives now beside the tricks we used before it. Then come the steps that build it, each beside the code that runs
      on this page. Start with the accordions if HTML, CSS and
      JavaScript are new to you, or go to the tab whose bug you came with.
    </p>
    <Tabs label="demos" current={topic}
      values={Object.values(DemoTopics).map(param => ({display: demoTab.names[param], param, to: `${demoTab.address(param)}${searchFromShown({})}`}))}/>
    <section id="about" aria-label={demoTab.names[topic]} className="about">
      {children}
    </section>
  </>;
};
