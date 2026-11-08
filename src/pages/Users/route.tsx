import {FC} from 'react';
import {Header, Page, PageError} from '@frame/page';
import {UsersPage} from './UsersPage';
import names from '@frame/navigation/names.json';

const header = <Header title="Users" listed={names.users}/>;

export const ErrorBoundary: FC = () => <Page header={header} inView={false}><PageError/></Page>;

export const Room: FC = () => <Page header={header} inView={false}><UsersPage/></Page>;
