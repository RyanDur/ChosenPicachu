import {FC} from 'react';
import {Home} from '../components';
import './BasePage.css';
import './BasePage.layout.css';

export const HomePage: FC = () =>
  <>
    <header id="app-header" data-testid="header">
      <h1 className="title ellipsis">Home</h1>
    </header>

    <main data-testid="main"><Home/></main>
  </>;

