import {FC} from 'react';
import {Header, Page} from '@page';
import names from '@navigation/names.json';
import {NoRoom} from './NoRoom';

export const Room: FC = () => <Page header={<Header title="No such room" listed={names.noRoom}/>} inView={false}><NoRoom/></Page>;
