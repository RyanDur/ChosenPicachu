import {FC} from 'react';
import {ToSavedTab} from '@components/Tabs';
import {concernOf, practiceAddress} from '../types';

const ToThePractice: FC = () => <ToSavedTab addressOf={tab => practiceAddress(concernOf(tab))}/>;

export default ToThePractice;
