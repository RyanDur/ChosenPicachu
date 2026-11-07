export const classNames = (...classes: (string | boolean | undefined)[]) =>
  classes.filter(className => typeof className === 'string' && className !== '').join(' ').trim();
