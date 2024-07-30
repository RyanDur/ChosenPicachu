import {FC, PropsWithChildren} from 'react';
import {SideNav} from './BasePage/SideNav.tsx';
import './BasePage.css';
import './BasePage.layout.css';

export const BasePage: FC<PropsWithChildren<{ title: string }>> = ({title, children}) =>
  <>
    <header id="app-header" data-testid="header">
      <h1 className="title ellipsis">{title}</h1>
    </header>

    <SideNav/>

    <main data-testid="main">{children}</main>
  </>;
