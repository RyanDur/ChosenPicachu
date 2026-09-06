import {FC, PropsWithChildren} from 'react';
import {classNames} from '@components/class-names';
import {useDispatch, useStanding, useSelector} from '../context';
import {RowGrip} from '../RowGrip';
import {baked, columnAloft, lifted, nudgedTo, rowAloft} from '../table-state';
import {Grab, rowArrows, rowLift} from '../travel';

export const RowHeader: FC<PropsWithChildren<{seat: number; column: string; className?: string}>> = ({seat, column, className, children}) => {
  const dispatch = useDispatch();
  const standing = useStanding();
  const order = useSelector(state => state.order);
  const aloft = useSelector(state => state.aloft);
  const hidden = columnAloft({aloft}).map(held => held === column).orElse(false);
  const carried = rowAloft({aloft}).map(held => held === seat).orElse(false);
  const grabbed = (grab: Grab): void => dispatch(current => lifted({axis: 'row', held: seat}, grab)(baked(standing)(current)));
  const walked = ({to}: {to: number; after: number[]}): void => dispatch(current => nudgedTo(seat, to)(baked(standing)(current)));

  return <th scope="row" className={classNames('cell', className, 'row-header', hidden && 'hide', carried && 'hide-across')}
             style={{viewTransitionName: `cell-${seat}-${column}`}}>
    <RowGrip position={standing.indexOf(seat)} onLift={rowLift(() => order, () => standing, grabbed)}
             onArrows={rowArrows(seat, () => standing, walked)}/>
    {children}
  </th>;
};
