import {FC, PropsWithChildren} from 'react';

export const MomentSummary: FC<PropsWithChildren> = ({children}) =>
  <p className="moment-summary paragraph muted-ink hyphenated">{children}</p>;
