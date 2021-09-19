export const matchOn = <MATCH_ON extends string | number, T>(matcher: (value: T) => MATCH_ON) => <V>(
        on: T,
        cases: Record<MATCH_ON, () => V>
): V => cases[matcher(on)]();
