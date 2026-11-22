import {FC, PropsWithChildren} from 'react';
import {useNamingThePage} from '@page-name';

export type Listing = {readonly title: string; readonly description: string};

type Props = {
  pageName: string;
  heading?: string;
  listed: Listing;
};

export const Header: FC<PropsWithChildren<Props>> = ({pageName, heading, listed, children}) => {
  useNamingThePage(pageName);
  return <>
    <title>{listed.title}</title>
    <meta name="description" content={listed.description}/>
    <header id="app-header" className="app-header field backdrop-below">
      <h1 className="app-title page-title bold ellipsis">{heading ?? pageName}</h1>
      {children}
    </header>
  </>;
};
