export type Pushed = Readonly<Record<string, 'left' | 'right'>>;

export const crossedMark = (item: string, homeward: boolean): Pushed =>
    ({[item]: homeward ? 'right' : 'left'});

export const walkedMarks = (order: readonly string[], walker: string, toward: 1 | -1): Pushed => {
    const neighbour = order[order.indexOf(walker) + toward];
    return {
        [walker]: toward > 0 ? 'right' : 'left',
        [neighbour]: toward > 0 ? 'left' : 'right'
    };
};

export const pushedStyle = (toward?: 'left' | 'right'): {'--toward': string} | undefined =>
    toward ? {'--toward': toward === 'left' ? '1' : '-1'} : undefined;
