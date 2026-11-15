import {FC, PropsWithChildren} from 'react';

export const Footer: FC<PropsWithChildren> = ({children}) =>
  <footer id="app-footer" className="app-footer stick-to-bottom field backdrop-above">{children}</footer>;
