import {FC} from 'react';
import {classNames, PropsWithClassName} from '@components';
import './Loading.css';

type LoadingProps = PropsWithClassName<{label?: string}>;

export const Loading: FC<LoadingProps> = ({className, label = 'loading'}) =>
  <progress className={classNames('loading', 'bare', 'borderless', 'unfilled', 'circular', 'ink', 'spinning-dots', className)} aria-label={label}/>;
