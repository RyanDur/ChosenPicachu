import {FC, PropsWithChildren} from 'react';

export const Verdict: FC<PropsWithChildren<{'aria-label': string}>> = ({'aria-label': name, children}) =>
  <output aria-label={name} className="paragraph bold">{children}</output>;
