import {FC} from 'react';
import names from '@navigation/names.json';
import {Header} from './Header';
import {CenteredMain} from './CenteredMain';
import {PageError} from './PageError';

export const ClosedRoom: FC = () =>
  <>
    <Header pageName="Closed room" listed={names.closedRoom}/>
    <CenteredMain><PageError/></CenteredMain>
  </>;
