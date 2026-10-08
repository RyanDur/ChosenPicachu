import {FC, PropsWithChildren} from 'react';
import {useNamingThePage} from '@components/PageName';
import {Named, useNamed} from './useNamed';

export const Header: FC<PropsWithChildren<{title: string; named: Named}>> = ({title, named, children}) => {
  useNamingThePage(title);
  useNamed(named);
  return <header id="app-header" className="app-header field backdrop-below">
    <h1 className="app-title page-title bold ellipsis">{title}</h1>
    {children}
  </header>;
};
