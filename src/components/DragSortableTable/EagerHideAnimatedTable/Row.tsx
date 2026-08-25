import {Children, FC, Fragment, ReactElement, isValidElement} from 'react';
import {has} from '@ryandur/sand';
import {classNames} from '@components/class-names';
import {CellProps, RowProps} from '@components/Table';
import {RowSetting, useMoved, useSeat, useTable} from '../context';
import {Cell} from './Cell';

export const Row: FC<RowProps> = ({children}) => {
  const {state, standing} = useTable();
  const {rowsMoved} = useMoved();
  const row = useSeat();
  const position = standing.indexOf(row);
  const drop = rowsMoved?.[row];
  const cells: Record<string, ReactElement> = {};
  Children.forEach(children, child => {
    if (isValidElement<CellProps>(child) && child.type === Cell) {
      cells[child.props.column] = child;
    }
  });

  return <RowSetting.Provider value={{row, position, gripped: false}}>
    <tr className={classNames('row', has(drop) && 'shifted')}
        style={has(drop) ? {'--drop': `${drop}px`} : undefined}>
      {state.order.map(name => <Fragment key={name}>{cells[name]}</Fragment>)}
    </tr>
  </RowSetting.Provider>;
};
