import {ReactNode} from 'react';
import {Cell, Column, ColumnData, Row, RowData} from '@components/Table';

export const deal = (columns: ColumnData[], rows: RowData[]): ReactNode[] => [
  ...columns.map(({column, display, className, sortable}) =>
    <Column key={column} name={column} className={className} sortable={sortable}>{display}</Column>),
  ...rows.map((row, at) =>
    <Row key={at}>
      {Object.entries(row).map(([column, {display, className, value}]) =>
        <Cell key={column} column={column} className={className} value={value}>{display}</Cell>)}
    </Row>)
];
