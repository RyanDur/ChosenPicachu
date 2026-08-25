import {FC, MouseEvent, PointerEvent} from 'react';
import {Maybe, has, not, nothing} from '@ryandur/sand';
import {classNames} from '@components/class-names';
import {ColumnData} from '@components/Table';
import {ResizeHandle} from '@components/Table/ResizeHandle';
import {anchored} from '../survey';
import {staticColumnArrows} from '../travel';
import {Direction, SortMenu} from '../SortMenu';
import {sortedBy} from '../sorting';
import '../Header.css';

type Props = {
  column: ColumnData;
  order: readonly string[];
  share?: number;
  resizable: boolean;
  rule?: { column: string; direction: Direction };
  aloft?: Maybe<string>;
  draggable: boolean;
  onLift: (column: string) => (event: PointerEvent<HTMLTableCellElement>) => void;
  onOrdered: (column: string, to: number) => void;
  onAwaken: (table: HTMLTableElement) => void;
  onTraded: (column: string, delta: number) => void;
  onRule?: (column: string, direction: Direction | undefined, event: MouseEvent<HTMLButtonElement>) => void;
};

export const Header: FC<Props> = (
  {column, order, share, resizable, rule, aloft = nothing(), draggable, onLift, onOrdered, onAwaken, onTraded, onRule}
) => {
  const columnName = column.column;
  const position = order.indexOf(columnName);
  const travels = draggable && not(anchored(position, order.length));
  const hidden = aloft.map(held => held === columnName).orElse(false);
  const sorted = sortedBy(columnName, rule);
  const ordered = ({to}: {from: number; to: number}): void => onOrdered(columnName, to);

  return <th className={classNames(
    'cell', column.className,
    'header-cell',
    resizable && 'clipped',
    travels && 'grabbable',
    hidden && 'hide',
    has(share) && 'shared'
  )}
             scope="col"
             aria-sort={sorted}
             tabIndex={travels ? 0 : undefined}
             onPointerDown={travels ? onLift(columnName) : undefined}
             onKeyDown={travels ? staticColumnArrows(columnName, () => order, ordered) : undefined}
             style={has(share) ? {'--share': `${share}%`} : undefined}>
    <div className={classNames('header-cell-content',
      has(onRule) && column.sortable && 'rankable',
      resizable && order.length > 1 && 'resizable')}>
      {column.display}
      {has(onRule) && column.sortable &&
          <SortMenu column={columnName} onRule={onRule}/>}
      {resizable && order.length > 1 &&
          <ResizeHandle column={columnName} share={share}
                        onAwaken={onAwaken}
                        onTrade={delta => onTraded(columnName, delta)}/>}
    </div>
  </th>;
};
