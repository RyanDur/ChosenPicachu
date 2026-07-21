export const join = (...classes: (string | boolean | undefined)[]) =>
    classes.filter(className => className).join(' ').trim();

export const classNames = join;
