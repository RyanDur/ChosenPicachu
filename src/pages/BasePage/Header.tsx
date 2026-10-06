import {FC, PropsWithChildren} from 'react';
import {useNamingThePage} from '@components/PageName';

export const Header: FC<PropsWithChildren<{title: string}>> = ({title, children}) => {
  useNamingThePage(title);
  return <header id="app-header" className="app-header field backdrop-below">
    <h1 className="app-title page-title bold ellipsis">{title}</h1>
    {children}
  </header>;
};
