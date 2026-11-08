import {FC} from 'react';
import {Header, Page, PageError} from '@frame/page';
import {UsersPage} from '@pages/Users/UsersPage';
import names from '@pages/names.json';

const header = <Header title="Users" listed={names.users}/>;

export const ErrorBoundary: FC = () => <Page header={header} inView={false}><PageError/></Page>;

const Room: FC = () => <Page header={header} inView={false}><UsersPage/></Page>;

export default Room;
