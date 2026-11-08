import {FC, PropsWithChildren, ReactNode} from 'react';

export const AppHeader: FC<PropsWithChildren<{title: ReactNode}>> = ({title, children}) =>
  <header id="app-header" className="app-header field backdrop-below">
    <h1 className="app-title page-title bold ellipsis">{title}</h1>
    {children}
  </header>;
