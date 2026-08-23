import {FC, PropsWithChildren} from 'react';

export const Header: FC<PropsWithChildren<{title: string}>> = ({title, children}) => <header id="app-header" className="app-header field">
  <h1 className="app-title ellipsis">{title}</h1>
  {children}
</header>;
