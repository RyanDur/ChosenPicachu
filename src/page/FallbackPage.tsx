import {FC} from 'react';
import {Frame} from './Frame';
import {WaitingRoom} from './WaitingRoom';

export const FallbackPage: FC = () => <Frame pageUnknown><WaitingRoom/></Frame>;
