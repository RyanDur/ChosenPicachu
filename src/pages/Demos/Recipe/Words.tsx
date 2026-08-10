import {FC, PropsWithChildren, ReactNode} from 'react';

type Props = PropsWithChildren<{
  want: ReactNode;
}>;

export const Words: FC<Props> = ({want, children}) =>
  <div className="step-words">
    <p className="step-want">{want}</p>
    {children}
  </div>;
