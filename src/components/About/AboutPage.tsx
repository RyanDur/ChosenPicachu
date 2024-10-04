import {FC} from 'react';
import {Tabs} from "../Tabs";
import {About} from "./About";
import {useQuery} from "../hooks";
import {aboutTopics} from "./types";
import './AboutPage.css';
import '../../routes/BasePage.css';
import '../../routes/BasePage.layout.css';

export const AboutPage: FC = () => {
  const {queryObj: {tab}} = useQuery<{tab: string}>();
  return <>
    <header id="app-header" data-testid="header">
      <h1 className="title ellipsis">About {tab}</h1>
    </header>

    <main data-testid="main" className='in-view'>
      <Tabs role='demo-tabs' values={[
        {display: 'Accordions', param: aboutTopics.accordions},
        {display: 'Z-Index', param: aboutTopics.zIndex}
      ]}/>
      <About/>
    </main>
  </>;
};
