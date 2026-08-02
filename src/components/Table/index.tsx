import {has} from '@ryandur/sand';
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

const STEP = 16;
const NARROWEST = 60;
const WIDEST = 640;

type Widths = Readonly<Record<string, number>>;
type SetWidths = Dispatch<SetStateAction<Widths>>;
type Grip = {column: string; fromX: number; fromWidth: number} | null;
type SetGrip = Dispatch<SetStateAction<Grip>>;

const clamp = (width: number): number => Math.min(WIDEST, Math.max(NARROWEST, width));

const seededWidths = (columns: Column[]): Widths =>
    columns.reduce<Widths>((widths, {column, width}) =>
        has(width) ? {...widths, [String(column)]: width} : widths, {});

const widen = (column: string, delta: number) => (previous: Widths): Widths =>
    ({...previous, [column]: clamp((previous[column] ?? NARROWEST) + delta)});

const resizeByKey = (setWidths: SetWidths, column: string) => (event: KeyboardEvent<HTMLElement>): void => {
    if (event.key !== 'ArrowRight' && event.key !== 'ArrowLeft') {
        return;
    }
    event.preventDefault();
    setWidths(widen(column, event.key === 'ArrowRight' ? STEP : -STEP));
};

const gripAt = (setGrip: SetGrip, column: string, width: number) => (event: PointerEvent<HTMLElement>): void => {
    event.currentTarget.setPointerCapture?.(event.pointerId);
    setGrip({column, fromX: event.clientX, fromWidth: width});
};

const dragTo = (setWidths: SetWidths, grip: Grip) => (event: PointerEvent<HTMLElement>): void => {
    if (grip === null) {
        return;
    }
    setWidths(previous =>
        ({...previous, [grip.column]: clamp(grip.fromWidth + event.clientX - grip.fromX)}));
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
    const [widths, setWidths] = useState<Widths>(() => seededWidths(columns));
    const [grip, setGrip] = useState<Grip>(null);

    return <table id={id} className={tableClassName}>
        <thead className={theadClassName}>
        <tr className={join(
            trClassName,
            headerRowClassName
        )}>{columns.map(({display, column, className, width}) => {
            const key = String(column);
            const sized = has(width) ? widths[key] : undefined;
            return <th className={join(thClassName, cellClassName, className)}
                       key={key}
                       scope="col"
                       style={has(sized) ? {width: sized} : undefined}>
                {display}
                {has(sized) &&
                    <i role="separator"
                       tabIndex={0}
                       className="resize-handle"
                       aria-orientation="vertical"
                       aria-label={`resize ${key}`}
                       aria-valuenow={sized}
                       aria-valuemin={NARROWEST}
                       aria-valuemax={WIDEST}
                       onKeyDown={resizeByKey(setWidths, key)}
                       onPointerDown={gripAt(setGrip, key, sized)}
                       onPointerMove={dragTo(setWidths, grip)}
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
