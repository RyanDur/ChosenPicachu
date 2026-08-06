import {FC} from 'react';
import {has} from '@ryandur/sand';
import {join} from '@components/class-names';
import Handle from '@components/grip.svg';
import {Column, Dress, Row, Shares} from '@components/Table';
import {Ghost} from './Ghost';

type Props = {
    at: {x: number; y: number; width: number};
    drift: {x: number; y: number};
    dress: Dress;
    columns: Column[];
    shares: Shares;
    row: Row;
};

export const RowGhost: FC<Props> = ({at, drift, dress, columns, shares, row}) =>
    <Ghost at={at} drift={drift} dress={dress}>
        <tbody className={dress.tbodyClassName}>
        <tr className={join(dress.trClassName, dress.rowClassName)}>
            {columns.map(({column}, place) => {
                const share = shares[String(column)];
                return <td className={join(dress.tdClassName, dress.cellClassName, row[column].className, 'ellipsis')}
                    key={place}
                    style={has(share) ? {width: `${share}%`} : undefined}>
                    {place === 0 && <i className="grip"><Handle/></i>}
                    {row[column].display}
                </td>;
            })}
        </tr>
        </tbody>
    </Ghost>;
