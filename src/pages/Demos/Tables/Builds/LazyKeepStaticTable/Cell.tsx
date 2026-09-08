import {ComponentProps, FC} from 'react';

export const Cell: FC<ComponentProps<'td'> & {column: string; row: string}> = ({column: _column, row: _row, children, ...td}) =>
  <td {...td}>
    {children}
  </td>;
