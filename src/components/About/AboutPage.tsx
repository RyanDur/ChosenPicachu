import {FC} from 'react';
import {SideNav} from '../../routes/BasePage/SideNav';
import {Tabs} from "../Tabs";
import {About} from "./About";
import {useQuery} from "../hooks";
import './AboutPage.css';
import '../../routes/BasePage.css';
import '../../routes/BasePage.layout.css';

export const AboutPage: FC = () => {
  const {queryObj: {tab}} = useQuery({tab: 'accordions'});
  return <>
    <header id="app-header" data-testid="header">
      <h1 className="title ellipsis">About {tab}</h1>
    </header>

    <main data-testid="main" className='in-view'>
      <Tabs role='demo-tabs' values={[
        {display: 'Accordions', param: 'accordions'},
        {display: 'Z-Index', param: 'z-index'}
      ]}/>
      <About/>
    </main>

    <SideNav/>
  </>;
};

