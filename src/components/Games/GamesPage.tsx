import {FC} from 'react';
import {Outlet} from 'react-router-dom';

export const GamesPage: FC = () => {
  return <>
    <header id="app-header" data-testid="header">
      <h1 className="title ellipsis">Play Games</h1>
    </header>

    <main data-testid="main">
      <Outlet/>
    </main>
  </>;
};