import {FC} from 'react';
import {join} from '@components/class-names';
import {Column, Dress, Row} from '@components/Table';
import {Ghost} from './Ghost';

type Props = {
    at: {x: number; y: number; width: number};
    drift: {x: number; y: number};
    dress: Dress;
    columns: Column[];
    row: Row;
};

export const RowGhost: FC<Props> = ({at, drift, dress, columns, row}) =>
    <Ghost at={at} drift={drift} dress={dress}>
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
