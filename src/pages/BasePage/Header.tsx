import {FC, PropsWithChildren} from 'react';
import {useNamingThePage} from '@components/PageName';
import {Listing, useListing} from './useListing';

export const Header: FC<PropsWithChildren<{title: string; listed: Listing}>> = ({title, listed, children}) => {
  useNamingThePage(title);
  useListing(listed);
  return <header id="app-header" className="app-header field backdrop-below">
    <h1 className="app-title page-title bold ellipsis">{title}</h1>
    {children}
  </header>;
};
