import {FC} from 'react';
import {classNames} from '@components/class-names';
import './Loading.css';

type LoadingProps = {
  className?: string;
  label?: string;
};

export const Loading: FC<LoadingProps> = ({className, label = 'loading'}) =>
  <progress className={classNames('loading', 'bare', 'borderless', 'unfilled', 'circular', 'ink', 'spinning-dots', className)} aria-label={label}/>;
