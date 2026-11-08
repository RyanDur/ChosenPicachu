import {FC, PropsWithChildren} from 'react';
import {AppHeader} from './AppHeader';
import {Listing, PageTitle} from './PageTitle';

export const Header: FC<PropsWithChildren<{title: string; listed: Listing}>> = ({title, listed, children}) =>
  <AppHeader title={<PageTitle title={title} listed={listed}/>}>{children}</AppHeader>;
