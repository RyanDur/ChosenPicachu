import {Children, FC, Fragment, ReactElement, isValidElement} from 'react';
import {CellProps, RowProps} from '@components/Table';
import {RowSetting, useSeat, useTable} from '../context';
import {Cell} from './Cell';

export const DraggableRow: FC<RowProps> = ({children}) => {
  const {state, standing} = useTable();
  const row = useSeat();
  const position = standing.indexOf(row);
  const cells: Record<string, ReactElement> = {};
  Children.forEach(children, child => {
    if (isValidElement<CellProps>(child) && child.type === Cell) {
      cells[child.props.column] = child;
    }
  });

  return <RowSetting.Provider value={{row, position, gripped: true}}>
    <tr className="row">
      {state.order.map(name => <Fragment key={name}>{cells[name]}</Fragment>)}
    </tr>
  </RowSetting.Provider>;
};
