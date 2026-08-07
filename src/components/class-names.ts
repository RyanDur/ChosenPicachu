export const classNames = (...classes: (string | boolean | undefined)[]) =>
    classes.filter(className => className).join(' ').trim();
