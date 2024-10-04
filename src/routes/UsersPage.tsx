import {FC} from 'react';
import {Users} from '../components';
import './BasePage.css';
import './BasePage.layout.css';

export const UsersPage: FC = () =>
  <>
    <header id="app-header" data-testid="header">
      <h1 className="title ellipsis">Users</h1>
    </header>

    <main data-testid="main"><Users/></main>
  </>;
