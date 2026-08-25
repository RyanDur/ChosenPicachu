import {FC} from 'react';
import {has} from '@ryandur/sand';
import {classNames} from '@components/class-names';
import {Column, Row} from '@components/Table';
import {Ghost} from './dress';

type Props = {
    at: {x: number; y: number; width: number};
    drift: {x: number; y: number};
    column: Column;
    rows: readonly Row[];
    heights: readonly (number | undefined)[];
};

export const ColumnGhost: FC<Props> = ({at, drift, column, rows, heights}) =>
    <Ghost at={at} drift={drift} className="fancy-table">
        <thead className="header">
        <tr className="row">
            <th className={classNames('cell', column.className, 'header-cell', 'clipped')} scope="col">
                <div className="header-cell-content">
                    {column.display}
                </div>
            </th>
        </tr>
        </thead>
        <tbody className="body">{rows.map((row, place) =>
            <tr className="row" key={place}
                style={has(heights[place]) ? {'--seat-height': `${heights[place]}px`} : undefined}>
                <td className={classNames('cell', row[column.column].className, 'ellipsis')}>
                    {row[column.column].display}
                </td>
            </tr>
        )}</tbody>
    </Ghost>;
