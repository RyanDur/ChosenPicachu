import {FC} from 'react';
import {ToSavedTab} from '@frame/navigation/Tabs';
import {demoAddress, demoTopicOf} from '../types';

const ToTheDemo: FC = () => <ToSavedTab addressOf={tab => demoAddress(demoTopicOf(tab))}/>;

export default ToTheDemo;
