import {FC, PropsWithChildren} from 'react';

export const PieceNote: FC<PropsWithChildren<{when: string}>> = ({when, children}) => <>
  <p className="note paragraph">{children}</p>
  <p className="when caption muted-ink">{when}</p>
</>;
