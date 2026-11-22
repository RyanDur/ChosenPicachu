import {FC, PropsWithChildren} from 'react';
import {maybe} from '@ryandur/sand';

export const DirectionWord: FC<PropsWithChildren> = ({children}) =>
  maybe(children).map(direction => <>{' '}<span className="off-screen">{direction}</span></>).orNull();
