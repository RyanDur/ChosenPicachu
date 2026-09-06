import {FC} from 'react';
import {has} from '@ryandur/sand';
import {classNames} from '@components/class-names';
import Handle from '@components/grip.svg';
import {Ghost} from './dress';

type Props = {
    at: {x: number; y: number; width: number};
    drift: {x: number; y: number};
    order: readonly string[];
    widths: Readonly<Record<string, number | undefined>>;
    cells: readonly string[];
};

export const RowGhost: FC<Props> = ({at, drift, order, widths, cells}) =>
    <Ghost at={at} drift={drift} className="fancy-table apportioned">
        <tbody className="body">
        <tr className="row">
            {cells.map((cell, place) => {
                const share = widths[order[place] ?? ''];
                const seat = classNames('cell', place === 0 && 'row-header', has(share) && 'shared');
                const width = has(share) ? {'--share': `${share}%`} : undefined;
                return place === 0
                    ? <th scope="row" className={seat} key={place} style={width}>
                        <span className="grip"><Handle/></span>{cell}
                    </th>
                    : <td className={seat} key={place} style={width}>{cell}</td>;
            })}
        </tr>
        </tbody>
    </Ghost>;
