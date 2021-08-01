import {FC} from 'react';
import {join} from '../util';
import './Loading.scss';

interface LoadingProps {
    className?: string;
}

export const Loading: FC<LoadingProps> = ({className}) =>
    <section className={join('loading-screen', className)} data-testid="loading">
        <article className="loading"/>
    </section>;