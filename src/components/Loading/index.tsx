import {FC} from 'react';
import {join} from '../util';
import './Loading.css';

interface LoadingProps {
    className?: string;
    testId?: string
}

export const Loading: FC<LoadingProps> = ({className, testId}) =>
    <section className={join('loading-screen', className)}
             data-testid={testId || 'loading'}>
        <article className="loading"/>
    </section>;
