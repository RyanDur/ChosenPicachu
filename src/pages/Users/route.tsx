import {FC} from 'react';
import {CenteredMain, Header, PageError} from '@page';
import {UsersPage} from './UsersPage';
import names from '@navigation/names.json';

const header = <Header pageName="Users" listed={names.users}/>;

export const ErrorBoundary: FC = () => <>{header}<CenteredMain><PageError/></CenteredMain></>;

export const Room: FC = () => <>{header}<CenteredMain><UsersPage/></CenteredMain></>;
