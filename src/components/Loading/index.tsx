import './Loading.scss';
import {FC} from 'react';
import {join} from '../util';

interface LoadingProps {
    className?: string;
}

export const Loading: FC<LoadingProps> = ({className}) =>
    <section className={join('loading-screen', className)}>
        <article className="loading"/>
    </section>;