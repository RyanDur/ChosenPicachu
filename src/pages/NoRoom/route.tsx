import {FC} from 'react';
import {Header, Page} from '@frame/page';
import names from '@pages/names.json';
import {NoRoom} from './NoRoom';

const Room: FC = () => <Page header={<Header title="No such room" listed={names.noRoom}/>} inView={false}><NoRoom/></Page>;

export default Room;
