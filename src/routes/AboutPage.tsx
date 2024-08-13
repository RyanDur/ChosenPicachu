import {FC} from 'react';
import {About} from '../components';
import {SideNav} from './BasePage/SideNav';
import './BasePage.css';
import './BasePage.layout.css';

export const AboutPage: FC = () =>
  <>
    <header id="app-header" data-testid="header">
      <h1 className="title ellipsis">About</h1>
    </header>

    <SideNav/>

    <main data-testid="main"><About/></main>
  </>;

