type MATCH = string | number;

export const matchOn = <T>(matcher: (value: T) => MATCH) =>
    <V>(on: T, cases: { [k: MATCH]: () => V }): V => cases[matcher(on)]();
