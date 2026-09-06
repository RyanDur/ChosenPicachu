import {FC} from 'react';
import {has} from '@ryandur/sand';
import {Ghost} from './dress';

type Props = {
    at: {x: number; y: number; width: number};
    drift: {x: number; y: number};
    heading: string | undefined;
    cells: readonly string[];
    heights: readonly (number | undefined)[];
};

export const ColumnGhost: FC<Props> = ({at, drift, heading, cells, heights}) =>
    <Ghost at={at} drift={drift} className="fancy-table apportioned">
        <thead className="header">
        <tr className="row">
            <th className="cell header-cell" scope="col">
                <div className="header-cell-content">
                    {heading}
                </div>
            </th>
        </tr>
        </thead>
        <tbody className="body">{cells.map((cell, place) =>
            <tr className="row" key={place}
                style={has(heights[place]) ? {'--seat-height': `${heights[place]}px`} : undefined}>
                <td className="cell">
                    {cell}
                </td>
            </tr>
        )}</tbody>
    </Ghost>;
