import {FC, PropsWithChildren} from 'react';
import './App.css';
import './App.layout.css';

export const Header: FC<PropsWithChildren<{title: string}>> = ({title, children}) => <header id="app-header" data-testid="header">
  <h1 className="title ellipsis">{title}</h1>
  {children}
</header>
