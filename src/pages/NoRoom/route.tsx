import {FC} from 'react';
import {Header} from '@pages/BasePage/Header';
import {Page} from '@pages/BasePage/Page';
import names from '@pages/names.json';
import {NoRoom} from './NoRoom';

const Room: FC = () => <Page header={<Header title="No such room" listed={names.noRoom}/>} inView={false}><NoRoom/></Page>;

export default Room;
