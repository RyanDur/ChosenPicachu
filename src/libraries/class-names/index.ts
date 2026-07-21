export const join =
    (...classes: Partial<(string | boolean)[]>) => classes.filter(className => className).join(' ').trim();

export const classNames = (...classes: (string | boolean | undefined)[]) => classes.filter(Boolean).join(' ');
