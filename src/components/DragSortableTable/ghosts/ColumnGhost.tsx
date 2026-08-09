import {FC} from 'react';
import {classNames} from '@components/class-names';
import {Column, Row} from '@components/Table';
import {Ghost, GhostDress} from './dress';

type Props = {
    at: {x: number; y: number; width: number};
    drift: {x: number; y: number};
    dress: GhostDress;
    column: Column;
    rows: readonly Row[];
};

export const ColumnGhost: FC<Props> = ({at, drift, dress, column, rows}) =>
    <Ghost at={at} drift={drift} className={dress.table}>
        <thead className={dress.thead}>
        <tr className={dress.headerRow}>
            <th className={classNames(dress.header, column.className, 'header-cell', 'clipped')} scope="col">
                <div className="header-cell-grid">
                    {column.display}
                </div>
            </th>
        </tr>
        </thead>
        <tbody className={dress.tbody}>{rows.map((row, place) =>
            <tr className={dress.row} key={place}>
                <td className={classNames(dress.cell, row[column.column].className, 'ellipsis')}>
                    {row[column.column].display}
                </td>
            </tr>
        )}</tbody>
    </Ghost>;
