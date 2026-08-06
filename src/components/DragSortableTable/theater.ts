import {Shares} from '@components/Table';
import {shifts} from './chart';

export type Slid = Readonly<Record<string, {toward: 'left' | 'right'; by: number}>>;
export type Shifted = Readonly<Record<number, number>>;

type Stage = {
    slid: (marks: Slid) => void;
    shifted: (drops: Shifted) => void;
};

export type Theater = (stage: Stage) => {
    columnsDisplaced: (from: number, to: number, order: readonly string[], shares: Shares) => void;
    partiesSwapped: (key: string, neighbor: string, toward: 1 | -1, shares: Shares) => void;
    rowsShifted: (heights: () => Shifted, before: readonly number[], after: readonly number[], riding?: number) => void;
};

export const staged: Theater = ({slid, shifted}) => ({
    columnsDisplaced: (from, to, order, shares) => {
        const displaced = from < to ? order.slice(from + 1, to + 1) : order.slice(to, from);
        slid(Object.fromEntries(displaced.map(key =>
            [key, {toward: from < to ? 'left' : 'right', by: shares[order[from]] ?? 0}])));
    },
    partiesSwapped: (key, neighbor, toward, shares) => slid({
        [key]: {toward: toward > 0 ? 'right' : 'left', by: shares[neighbor] ?? 0},
        [neighbor]: {toward: toward > 0 ? 'left' : 'right', by: shares[key] ?? 0}
    }),
    rowsShifted: (heights, before, after, riding) => {
        const {[riding ?? -1]: ridden, ...drops} = shifts(heights(), before, after);
        shifted(drops);
    }
});

export const still: Theater = () => ({
    columnsDisplaced: () => undefined,
    partiesSwapped: () => undefined,
    rowsShifted: () => undefined
});
