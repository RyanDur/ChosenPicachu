import {FC, PropsWithChildren, useId} from 'react';
import {classNames} from '@components';

type Labeled = PropsWithChildren<{label: string; className?: string}>;

export const ResultLine: FC<Labeled> = ({label, className, children}) => {
  const id = useId();
  return <output aria-labelledby={id} className={classNames('paragraph', className)}>
    <span id={id} className="bold">{label}</span> {children}
  </output>;
};
