import {FC} from 'react';
import {ToSavedTab} from '@frame/navigation/Tabs';
import {demoAddress, demoTopicOf} from '../types';

export const Room: FC = () => <ToSavedTab addressOf={tab => demoAddress(demoTopicOf(tab))}/>;
