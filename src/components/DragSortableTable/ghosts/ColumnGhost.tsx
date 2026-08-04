import {FC} from 'react';
import {join} from '@components/class-names';
import {Column, Dress, Row} from '@components/Table';
import {Ghost} from './Ghost';

type Props = {
    at: {x: number; y: number; width: number};
    drift: {x: number; y: number};
    dress: Dress;
    column: Column;
    rows: Row[];
};

export const ColumnGhost: FC<Props> = ({at, drift, dress, column, rows}) =>
    <Ghost at={at} drift={drift} dress={dress}>
        <thead className={dress.theadClassName}>
        <tr className={join(dress.trClassName, dress.headerRowClassName)}>
            <th className={join(dress.thClassName, dress.cellClassName, column.className, 'clipped')} scope="col">
                {column.display}
            </th>
        </tr>
        </thead>
        <tbody className={dress.tbodyClassName}>{rows.map((row, seat) =>
            <tr className={join(dress.trClassName, dress.rowClassName)} key={seat}>
                <td className={join(dress.tdClassName, dress.cellClassName, row[column.column].className, 'ellipsis')}>
                    {row[column.column].display}
                </td>
            </tr>
        )}</tbody>
    </Ghost>;
