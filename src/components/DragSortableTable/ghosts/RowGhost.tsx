import {FC} from 'react';
import {has} from '@ryandur/sand';
import {classNames} from '@components/class-names';
import Handle from '@components/grip.svg';
import {Column, Row} from '@components/Table';
import {Ghost} from './dress';

type Props = {
    at: {x: number; y: number; width: number};
    drift: {x: number; y: number};
    columns: readonly Column[];
    widths: Readonly<Record<string, number | undefined>>;
    row: Row;
};

export const RowGhost: FC<Props> = ({at, drift, columns, widths, row}) =>
    <Ghost at={at} drift={drift} className="fancy-table">
        <tbody className="body">
        <tr className="row">
            {columns.map(({column}, place) => {
                const share = widths[column];
                const seat = classNames('cell', place === 0 && 'row-header', has(share) && 'shared', row[column].className, 'ellipsis');
                const width = has(share) ? {'--share': `${share}%`} : undefined;
                return place === 0
                    ? <th scope="row" className={seat} key={place} style={width}>
                        <div className="row-header-content"><span className="grip"><Handle/></span>{row[column].display}</div>
                    </th>
                    : <td className={seat} key={place} style={width}>{row[column].display}</td>;
            })}
        </tr>
        </tbody>
    </Ghost>;
