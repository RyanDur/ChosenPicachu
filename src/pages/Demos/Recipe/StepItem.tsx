import {FC, PropsWithChildren, useId} from 'react';
import {has} from '@ryandur/sand';
import {classNames} from '@components';
import {StepHeadingId} from './StepHeadingId';

export type StepProps = PropsWithChildren<{
  id?: string;
}>;

type Props = StepProps & {
  badge: 'mint-badge-before' | 'shadow-badge-before';
};

export const StepItem: FC<Props> = ({badge, id, children}) =>
  <li className={classNames('step', 'badge-before', badge)} id={id} tabIndex={has(id) ? -1 : undefined}>
    <StepHeadingId value={useId()}>{children}</StepHeadingId>
  </li>;
