import {FC} from 'react';
import {ToSavedTab} from '@navigation/Tabs';
import {demoTab} from '../demo-tab';

export const Room: FC = () => <ToSavedTab addressOf={tab => demoTab.address(demoTab.topicOf(tab))}/>;
