import {FC} from 'react';
import names from '@navigation/names.json';
import {Header} from './Header';
import {Page} from './Page';
import {PageError} from './PageError';

export const ClosedRoom: FC = () =>
  <Page header={<Header title="Closed room" listed={names.closedRoom}/>} inView={false}>
    <PageError/>
  </Page>;
