import {FC} from 'react';
import {ToSavedTab} from '@navigation/Tabs';
import {concernOf, practiceAddress} from '../types';

export const Room: FC = () => <ToSavedTab addressOf={tab => practiceAddress(concernOf(tab))}/>;
