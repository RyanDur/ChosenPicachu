import {FC, PropsWithChildren, useId} from 'react';
import {classNames} from '@components';

type Labeled = PropsWithChildren<{label: string; className?: string}>;

export const ResultLine: FC<Labeled> = ({label, className, children}) => {
  const id = useId();
  return <p className={classNames('paragraph', className)}>
    <label htmlFor={id} className="bold">{label}</label> <output id={id}>{children}</output>
  </p>;
};
