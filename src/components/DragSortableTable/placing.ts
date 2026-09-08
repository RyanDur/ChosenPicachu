import {Children, Key, ReactElement, ReactNode, cloneElement, isValidElement} from 'react';

const named = <Prop extends string>(prop: Prop) => (child: ReactNode): child is ReactElement<Record<Prop, string>> =>
  isValidElement<Partial<Record<Prop, unknown>>>(child) && typeof child.props[prop] === 'string';

const keyed = (cell: ReactElement, key: Key): ReactElement => cloneElement(cell, {key});

export const placed = <Prop extends string>(children: ReactNode, order: readonly string[], prop: Prop): ReactElement[] => {
  const cells = Children.toArray(children).filter(named(prop));
  return order.flatMap(name => cells.filter(cell => cell.props[prop] === name).map(cell => keyed(cell, name)));
};
