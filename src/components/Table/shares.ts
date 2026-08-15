export const SLIMMEST = 5;

export type Shares = Readonly<Record<string, number>>;

export const measuredShares = (keys: readonly string[], table: HTMLTableElement): Shares => {
    const widths = [...table.querySelectorAll('thead th')].map(header => header.getBoundingClientRect().width);
    const total = widths.reduce((sum, width) => sum + width, 0);
    return keys.reduce<Shares>((shares, key, at) =>
        ({...shares, [key]: (widths[at] ?? 0) / (total || 1) * 100}), {});
};

export const traded = (column: string, neighbor: string, delta: number) => (previous: Shares): Shares => {
    const given = Math.min(
        Math.max(delta, SLIMMEST - previous[column]),
        previous[neighbor] - SLIMMEST
    );
    return {...previous, [column]: previous[column] + given, [neighbor]: previous[neighbor] - given};
};

export const neighborOf = (apportioned: readonly string[], key: string): string => {
    const index = apportioned.indexOf(key);
    return apportioned[index + 1] ?? apportioned[index - 1];
};

export const STEP_SHARE = 2;

export type Grip = Readonly<{fromX: number; pxPerShare: number}>;

export const sought = ({fromX, pxPerShare}: Grip, clientX: number): number => (clientX - fromX) / pxPerShare;
