import {FC} from 'react';
import {SideNav} from '../../routes/BasePage/SideNav';
import '../../routes/BasePage.css';
import '../../routes/BasePage.layout.css';
import {Tabs} from "../Tabs";
import {About} from "./About";

export const AboutPage: FC = () =>
  <>
    <header id="app-header" data-testid="header">
      <h1 className="title ellipsis">About</h1>
    </header>

    <SideNav/>

    <main data-testid="main" className='in-view'>
      <Tabs role='demo-tabs' values={[
        {display: 'Accordions', param: 'accordions'},
        {display: 'Z-Index', param: 'z-index'}
      ]}/>
      <About/>
    </main>
  </>;

