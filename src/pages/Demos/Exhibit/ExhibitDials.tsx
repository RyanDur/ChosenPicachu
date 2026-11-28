import {FC, PropsWithChildren} from 'react';
import {DialGroup} from '../Controls';

export const ExhibitDials: FC<PropsWithChildren> = ({children}) =>
  <footer className="field silver-rule-above bottom-rounded-corners">
    <DialGroup>{children}</DialGroup>
  </footer>;
