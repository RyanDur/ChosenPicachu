import {DragEvent} from 'react';
import {Maybe, has} from '@ryandur/sand';
import {array} from '@components/arrays';
import {glide} from '@components/glide';
import {crossed} from './crossing';

export const crossingOver = (aloft: Maybe<string>, order: readonly string[]) =>
    (item: string, index: number, struck: (held: string, homeward: boolean) => void) =>
        (event: DragEvent<HTMLElement>): void => {
            const lane = event.currentTarget.closest('li');
            if (has(lane) && lane.getAnimations().length > 0) {
                return;
            }
            aloft.map(held => {
                if (held === item) {
                    return;
                }
                const homeward = index < order.indexOf(held);
                if (crossed(event, homeward)) {
                    struck(held, homeward);
                }
            });
        };

export const landedOrder = (aloft: Maybe<string>, landing: Maybe<number>, order: readonly string[]): Maybe<string[]> =>
    aloft.and(landing).map(([held, at]) => array.moveToIndex(at, held, order));

export type Moved = {readonly item: string; readonly position: number; readonly of: number};

export const moveReport = ({item, position, of}: Moved): string =>
    `${item} moved to ${position + 1} of ${of}`;

export const landedMove = (aloft: Maybe<string>, landing: Maybe<number>, order: readonly string[]): Maybe<Moved> =>
    aloft.and(landing).map(([item, position]) => ({item, position, of: order.length}));

export const glided = (apply: (settled: string[]) => void) => (settled: string[]): void => {
    setTimeout(() => glide(true)(() => apply(settled)));
};
