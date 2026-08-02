import {FC} from 'react';
import {join} from '@components/class-names';
import './Loading.css';

type LoadingProps = {
    className?: string;
    label?: string;
}

export const Loading: FC<LoadingProps> = ({className, label = 'loading'}) =>
    <section className={join('loading-screen', className)}>
        <progress className="loading" aria-label={label}/>
    </section>;
