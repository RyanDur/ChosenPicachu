import {FC, PropsWithChildren} from 'react';

type Named = PropsWithChildren<{'aria-label'?: string}>;

export const Verdict: FC<Named> = props =>
  <output aria-label={props['aria-label']} className="paragraph bold">{props.children}</output>;
