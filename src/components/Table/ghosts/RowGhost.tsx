import {FC, RefObject} from 'react';
import {join} from '@components/class-names';
import {Column, Dress, Row} from '../types';
import {Ghost} from './Ghost';

type Props = {
    at: {x: number; y: number; width: number};
    ghost: RefObject<HTMLTableElement | null>;
    dress: Dress;
    columns: Column[];
    row: Row;
};

export const RowGhost: FC<Props> = ({at, ghost, dress, columns, row}) =>
    <Ghost at={at} ghost={ghost} dress={dress}>
        <tbody className={dress.tbodyClassName}>
        <tr className={join(dress.trClassName, dress.rowClassName)}>
            {columns.map(({column}, place) =>
                <td className={join(dress.tdClassName, dress.cellClassName, row[column].className, 'ellipsis')}
                    key={place}>
                    {row[column].display}
                </td>
            )}
        </tr>
        </tbody>
    </Ghost>;
