import {FC} from 'react';
import {ToSavedTab} from '@navigation/Tabs';
import {practiceAddress} from '../practiceAddress';

export const Room: FC = () =>
  <ToSavedTab addressOf={tab => practiceAddress.of(practiceAddress.concernForSavedTab(tab))}/>;
