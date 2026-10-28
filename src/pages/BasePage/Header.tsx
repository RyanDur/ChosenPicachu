import {FC, PropsWithChildren} from 'react';
import {useNamingThePage} from '@components/PageName';

export type Listing = {readonly title: string; readonly description: string};

export const Header: FC<PropsWithChildren<{title: string; listed: Listing}>> = ({title, listed, children}) => {
  useNamingThePage(title);
  return <>
    <title>{listed.title}</title>
    <meta name="description" content={listed.description}/>
    <header id="app-header" className="app-header field backdrop-below">
      <h1 className="app-title page-title bold ellipsis">{title}</h1>
      {children}
    </header>
  </>;
};
