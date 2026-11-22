import {FC, PropsWithChildren} from 'react';
import {BesideAPart} from './beside-a-part';

export const PartPanel: FC<PropsWithChildren> = ({children}) => <BesideAPart value>{children}</BesideAPart>;
