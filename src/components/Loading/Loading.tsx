import {FC} from 'react';
import {classNames} from '@components/class-names';
import './Loading.css';

type LoadingProps = {
    className?: string;
    label?: string;
}

export const Loading: FC<LoadingProps> = ({className, label = 'loading'}) =>
    <section className={classNames('loading-screen', className)}>
        <progress className="loading" aria-label={label}/>
    </section>;
