import {FC} from 'react';
import {has} from '@ryandur/sand';
import {classNames} from '@components/class-names';
import Handle from '@components/grip.svg';
import {Column, Row, Shares} from '@components/Table';
import {Ghost, GhostDress} from './dress';

type Props = {
    at: {x: number; y: number; width: number};
    drift: {x: number; y: number};
    dress: GhostDress;
    columns: Column[];
    shares: Shares;
    row: Row;
};

export const RowGhost: FC<Props> = ({at, drift, dress, columns, shares, row}) =>
    <Ghost at={at} drift={drift} className={dress.table}>
        <tbody className={dress.tbody}>
        <tr className={dress.row}>
            {columns.map(({column}, place) => {
                const share = shares[column];
                return <td className={classNames(dress.cell, row[column].className, 'ellipsis')}
                    key={place}
                    style={has(share) ? {width: `${share}%`} : undefined}>
                    {place === 0 && <i className="grip"><Handle/></i>}
                    {row[column].display}
                </td>;
            })}
        </tr>
        </tbody>
    </Ghost>;
