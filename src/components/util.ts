export const joinClassNames =
    (...classes: Partial<(string | boolean)[]>) => classes.filter(className => className).join(' ').trim();