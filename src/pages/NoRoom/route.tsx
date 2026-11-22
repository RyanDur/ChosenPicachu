import {FC} from 'react';
import {CenteredMain, Header} from '@page';
import names from '@navigation/names.json';
import {NoRoom} from './NoRoom';

export const Room: FC = () => <><Header pageName="No such room" listed={names.noRoom}/><CenteredMain><NoRoom/></CenteredMain></>;
