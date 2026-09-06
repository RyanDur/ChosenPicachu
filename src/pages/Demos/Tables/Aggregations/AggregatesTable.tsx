import {FC, ReactElement} from 'react';
import {Cell} from '@components/DragSortableTable/elements/Cell';
import {Column} from '@components/DragSortableTable/elements/Column';
import {DraggableColumn} from '@components/DragSortableTable/elements/DraggableColumn';
import {RowHeader} from '@components/DragSortableTable/elements/RowHeader';
import {SortMenu} from '@components/DragSortableTable/SortMenu';
import {ResizeHandle} from '@components/Table/ResizeHandle';
import {useStanding, useSelector} from '@components/DragSortableTable/context';
import {Measures} from './cells';

export const measures = ['window', 'trades', 'buys', 'sells', 'volume', 'vwap', 'change'];

type Props = {
  rows: readonly Measures[];
};

export const AggregatesTable: FC<Props> = ({rows}) => {
  const order = useSelector(state => state.order);
  const standing = useStanding();
  const headers: Record<string, ReactElement> = {
    window: <Column key="window" name="window" className="window">window<ResizeHandle/></Column>,
    trades: <DraggableColumn key="trades" name="trades" className="trades">trades<SortMenu/><ResizeHandle/></DraggableColumn>,
    buys: <DraggableColumn key="buys" name="buys" className="buys">buys<SortMenu/><ResizeHandle/></DraggableColumn>,
    sells: <DraggableColumn key="sells" name="sells" className="sells">sells<SortMenu/><ResizeHandle/></DraggableColumn>,
    volume: <DraggableColumn key="volume" name="volume" className="volume">volume<SortMenu/><ResizeHandle/></DraggableColumn>,
    vwap: <DraggableColumn key="vwap" name="vwap" className="vwap">vwap<SortMenu/><ResizeHandle/></DraggableColumn>,
    change: <Column key="change" name="change" className="change">change<SortMenu/><ResizeHandle/></Column>
  };

  return <table className="fancy-table sortable apportioned">
    <thead className="header">
    <tr className="row">{order.map(name => headers[name])}</tr>
    </thead>
    <tbody className="body">
    {standing.map(seat => {
      const row = rows[seat];

      return <tr key={seat} className="row">
        {order.map(column => column === 'window'
          ? <RowHeader key={column} seat={seat} column={column}>{row.window.display}</RowHeader>
          : <Cell key={column} seat={seat} column={column}>{row[column]?.display}</Cell>)}
      </tr>;
    })}
    </tbody>
  </table>;
};
