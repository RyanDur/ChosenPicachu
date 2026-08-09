import {FC} from 'react';
import {has} from '@ryandur/sand';
import {classNames} from '@components/class-names';
import Handle from '@components/grip.svg';
import {Column, Row} from '@components/Table';
import {Ghost, GhostDress} from './dress';

type Props = {
    at: {x: number; y: number; width: number};
    drift: {x: number; y: number};
    dress: GhostDress;
    columns: readonly Column[];
    widths: Readonly<Record<string, number | undefined>>;
    row: Row;
};

export const RowGhost: FC<Props> = ({at, drift, dress, columns, widths, row}) =>
    <Ghost at={at} drift={drift} className={dress.table}>
        <tbody className={dress.tbody}>
        <tr className={dress.row}>
            {columns.map(({column}, place) => {
                const share = widths[column];
                return <td className={classNames(dress.cell, has(share) && 'shared', row[column].className, 'ellipsis')}
                    key={place}
                    style={has(share) ? {'--share': `${share}%`} : undefined}>
                    {place === 0
                        ? <div className="cell-content"><i className="grip"><Handle/></i>{row[column].display}</div>
                        : row[column].display}
                </td>;
            })}
        </tr>
        </tbody>
    </Ghost>;
