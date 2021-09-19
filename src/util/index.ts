export const matches = <MATCH extends string | number>(values: MATCH[], defaultValue: MATCH) => {
    const obj = values.reduce((acc, value) => ({...acc, [value]: value}), ({} as Record<MATCH, MATCH>));
    return (value: MATCH) => obj[value] || defaultValue;
};

export const matchOn = <MATCH extends string | number, MATCH_ON>(matcher: (value: MATCH_ON) => MATCH) => <V>(
    on: MATCH_ON,
    cases: Record<MATCH, () => V>
): V => cases[matcher(on)]();
