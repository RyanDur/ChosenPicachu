import {FC, PropsWithChildren, ReactNode} from 'react';

type Props = PropsWithChildren<{
  want: ReactNode;
}>;

export const Words: FC<Props> = ({want, children}) =>
  <article className="step-words">
    <p className="step-want paragraph italic muted-ink">{want}</p>
    {children}
  </article>;
