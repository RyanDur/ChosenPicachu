import {has, notEmpty} from '@ryandur/sand';
import {Column, Row} from './types';
import {Dispatch, FC, KeyboardEvent, PointerEvent, SetStateAction, useState} from 'react';
import {join} from '@components/class-names';
import './Table.css';

export type TableProps = {
    columns: Column[];
    rows: Row[];
    id?: string;
    tableClassName?: string;
    theadClassName?: string;
    tbodyClassName?: string;
    trClassName?: string;
    thClassName?: string;
    tdClassName?: string;
    headerRowClassName?: string;
    rowClassName?: string;
    cellClassName?: string;
}

const STEP_SHARE = 2;
const SLIMMEST = 5;

type Shares = Readonly<Record<string, number>>;
type SetShares = Dispatch<SetStateAction<Shares>>;
type Grip = {
    column: string;
    neighbor: string;
    fromX: number;
    columnShare: number;
    neighborShare: number;
    pxPerShare: number;
} | null;
type SetGrip = Dispatch<SetStateAction<Grip>>;

const seededShares = (columns: Column[]): Shares => {
    const sized = columns.filter(({width}) => has(width));
    const total = sized.reduce((sum, {width}) => sum + (width ?? 0), 0);
    return sized.reduce<Shares>((shares, {column, width}) =>
        ({...shares, [String(column)]: (width ?? 0) / total * 100}), {});
};

const between = (column: number, neighbor: number, delta: number): number =>
    Math.min(Math.max(delta, SLIMMEST - column), neighbor - SLIMMEST);

const shifted = (column: string, neighbor: string, delta: number) => (previous: Shares): Shares => {
    const given = between(previous[column], previous[neighbor], delta);
    return {...previous, [column]: previous[column] + given, [neighbor]: previous[neighbor] - given};
};

const resizeByKey = (setShares: SetShares, column: string, neighbor: string) =>
    (event: KeyboardEvent<HTMLElement>): void => {
        if (event.key !== 'ArrowRight' && event.key !== 'ArrowLeft') {
            return;
        }
        event.preventDefault();
        setShares(shifted(column, neighbor, event.key === 'ArrowRight' ? STEP_SHARE : -STEP_SHARE));
    };

const gripAt = (setGrip: SetGrip, column: string, neighbor: string, shares: Shares) =>
    (event: PointerEvent<HTMLElement>): void => {
        event.currentTarget.setPointerCapture?.(event.pointerId);
        const surface = event.currentTarget.closest('table')?.getBoundingClientRect().width ?? 0;
        setGrip({
            column,
            neighbor,
            fromX: event.clientX,
            columnShare: shares[column],
            neighborShare: shares[neighbor],
            pxPerShare: surface / 100
        });
    };

const dragTo = (setShares: SetShares, grip: Grip) => (event: PointerEvent<HTMLElement>): void => {
    if (grip === null || grip.pxPerShare === 0) {
        return;
    }
    const given = between(grip.columnShare, grip.neighborShare, (event.clientX - grip.fromX) / grip.pxPerShare);
    setShares(previous => ({
        ...previous,
        [grip.column]: grip.columnShare + given,
        [grip.neighbor]: grip.neighborShare - given
    }));
};

export const Table: FC<TableProps> = (
    {
        columns,
        rows,
        id,
        tableClassName,
        theadClassName,
        tbodyClassName,
        trClassName,
        thClassName,
        tdClassName,
        headerRowClassName,
        rowClassName,
        cellClassName
    }
) => {
    const [shares, setShares] = useState<Shares>(() => seededShares(columns));
    const [grip, setGrip] = useState<Grip>(null);
    const apportioned = columns.filter(({width}) => has(width)).map(({column}) => String(column));
    const neighborOf = (key: string): string => {
        const index = apportioned.indexOf(key);
        return apportioned[index + 1] ?? apportioned[index - 1];
    };

    return <table id={id} className={join(tableClassName, notEmpty(apportioned) && 'apportioned')}>
        <thead className={theadClassName}>
        <tr className={join(
            trClassName,
            headerRowClassName
        )}>{columns.map(({display, column, className, width}) => {
            const key = String(column);
            const share = has(width) ? shares[key] : undefined;
            return <th className={join(thClassName, cellClassName, className)}
                       key={key}
                       scope="col"
                       style={has(share) ? {width: `${share}%`} : undefined}>
                {display}
                {has(share) && apportioned.length > 1 &&
                    <i role="separator"
                       tabIndex={0}
                       className="resize-handle"
                       aria-orientation="vertical"
                       aria-label={`resize ${key}`}
                       aria-valuenow={Math.round(share)}
                       aria-valuemin={SLIMMEST}
                       aria-valuemax={100 - SLIMMEST}
                       onKeyDown={resizeByKey(setShares, key, neighborOf(key))}
                       onPointerDown={gripAt(setGrip, key, neighborOf(key), shares)}
                       onPointerMove={dragTo(setShares, grip)}
                       onPointerUp={() => setGrip(null)}/>}
            </th>;
        })}</tr>
        </thead>
        <tbody className={tbodyClassName}>{rows.map((row, rowNumber) =>
            <tr className={join(trClassName, rowClassName)} key={rowNumber}>
                {columns.map(({column}, columnNumber) => {
                    const cell = row[column];
                    return <td className={join(tdClassName, cellClassName, cell.className)} key={columnNumber}>
                        {cell.display}
                    </td>;
                })}</tr>
        )}</tbody>
    </table>;
};

export type {Column, Row} from './types';
