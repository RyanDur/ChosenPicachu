import {FC, ReactNode} from 'react';
import {Values} from '@components/DragSortableTable/sorting';
import {
  Cell, Column, DraggableColumn, ResizeHandle, RowHeader, SortMenu, useStanding, useSelector
} from '@components/DragSortableTable/EagerKeepStaticTable';
import * as EagerKeepStatic from '@components/DragSortableTable/EagerKeepStaticTable';
import {SeatedTable} from '@components/DragSortableTable/SeatedTable';

export type Kit = {Table: typeof EagerKeepStatic.Table};

export type Fixture = {
  column: string;
  display: ReactNode;
  className?: string;
  sortable?: boolean;
};

export type Seat = Readonly<Record<string, {display: ReactNode; className?: string; value?: number | string}>>;

type Kinds = {
  draggable?: boolean;
  gripped?: boolean;
  sortable?: boolean;
  resizable?: boolean;
};

type Props = {
  kit: Kit;
  columns: Fixture[];
  rows: Seat[];
  kinds?: Kinds;
  id?: string;
};

const valuesOf = (row: Seat): Values =>
  Object.fromEntries(Object.entries(row).map(([column, {value}]) => [column, value]));

const Body: FC<Omit<Props, 'kit'>> = ({columns, rows, kinds = {}, id}) => {
  const order = useSelector(state => state.order);
  const standing = useStanding();
  const headers = Object.fromEntries(columns.map(({column, display, className, sortable}, at) => {
    const Heading = kinds.draggable && at > 0 && at < columns.length - 1 ? DraggableColumn : Column;
    return [column, <Heading key={column} name={column} className={className}>
      {display}
      {kinds.sortable && sortable && <SortMenu/>}
      {kinds.resizable && <ResizeHandle/>}
    </Heading>];
  }));

  return <table id={id} className={['fancy-table', kinds.resizable && 'apportioned', (kinds.draggable || kinds.gripped) && 'sortable'].filter(Boolean).join(' ')}>
    <thead className="header">
    <tr className="row">{order.map(name => headers[name])}</tr>
    </thead>
    <tbody className="body">{standing.map(seat =>
      <tr key={seat} className="row">
        {order.map((column, at) => {
          const {display, className} = rows[seat][column];
          return kinds.gripped && at === 0
            ? <RowHeader key={column} seat={seat} column={column} className={className}>{display}</RowHeader>
            : <Cell key={column} seat={seat} column={column} className={className}>{display}</Cell>;
        })}
      </tr>)}</tbody>
  </table>;
};

export const Dealt: FC<Props> = ({kit: {Table}, ...body}) =>
  <SeatedTable columns={body.columns.map(({column}) => column)} values={body.rows.map(valuesOf)}>
    <Table>
      <Body {...body}/>
    </Table>
  </SeatedTable>;
