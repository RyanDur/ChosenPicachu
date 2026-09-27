import {FC, PropsWithChildren} from 'react';
import {useNamingThePage} from '@components/PageName';

export const Header: FC<PropsWithChildren<{title: string}>> = ({title, children}) => {
  useNamingThePage(title);
  return <header id="app-header" className="app-header field">
    <h1 className="app-title ellipsis">{title}</h1>
    {children}
  </header>;
};
