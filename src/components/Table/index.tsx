import {has, notEmpty} from '@ryandur/sand';
import {array} from '@components/arrays';
import {Column, Row} from './types';
import {Dispatch, FC, KeyboardEvent, PointerEvent, SetStateAction, useRef, useState} from 'react';
import {join} from '@components/class-names';
import './Table.css';

export type ColumnDragStyle = 'eager-move' | 'lazy-move' | 'hide-eager-move' | 'hide-lazy-move';

export type TableProps = {
    columns: Column[];
    rows: Row[];
    draggableColumns?: ColumnDragStyle;
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

const emptied = (section: HTMLTableSectionElement): HTMLTableSectionElement =>
    section.tagName === 'THEAD' ? document.createElement('thead') : document.createElement('tbody');

const columnSlice = (section: HTMLTableSectionElement, position: number): HTMLTableSectionElement => {
    const group = emptied(section);
    group.className = section.className;
    for (const row of section.rows) {
        const cell = row.cells[position];
        if (has(cell)) {
            const line = document.createElement('tr');
            line.className = row.className;
            line.appendChild(cell.cloneNode(true));
            group.appendChild(line);
        }
    }
    return group;
};

const columnGhost = (source: HTMLTableElement, position: number): HTMLTableElement => {
    const ghost = document.createElement('table');
    ghost.className = source.className;
    const width = source.rows[0]?.cells[position]?.offsetWidth ?? 0;
    for (const section of [source.tHead, ...source.tBodies]) {
        if (has(section)) {
            ghost.appendChild(columnSlice(section, position));
        }
    }
    ghost.style.position = 'fixed';
    ghost.style.top = '0';
    ghost.style.left = '-100vw';
    ghost.style.width = `${width}px`;
    ghost.style.background = 'var(--paper)';
    ghost.style.boxShadow = 'var(--lift-box-shadow)';
    return ghost;
};

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
        draggableColumns,
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
    const [order, setOrder] = useState<string[]>(() => columns.map(({column}) => String(column)));
    const [armed, setArmed] = useState<string>();
    const [dragged, setDragged] = useState<string>();
    const [overIndex, setOverIndex] = useState(-1);
    const ghost = useRef<HTMLTableElement>(null);
    const byKey = new Map(columns.map(definition => [String(definition.column), definition]));
    const ordered = order.map(key => byKey.get(key)).filter(has);
    const apportioned = ordered.filter(({width}) => has(width)).map(({column}) => String(column));
    const clipped = notEmpty(apportioned);
    const eager = draggableColumns === 'eager-move' || draggableColumns === 'hide-eager-move';
    const hiding = draggableColumns === 'hide-eager-move' || draggableColumns === 'hide-lazy-move';
    const neighborOf = (key: string): string => {
        const index = apportioned.indexOf(key);
        return apportioned[index + 1] ?? apportioned[index - 1];
    };
    const anchored = (position: number): boolean =>
        position === 0 || position === ordered.length - 1;
    const landedAt = (index: number): void => {
        const between = Math.min(Math.max(index, 1), ordered.length - 2);
        if (has(draggableColumns) && has(dragged)) {
            if (eager) {
                setOrder(previous => array.moveToIndex(between, dragged, previous));
            } else {
                setOverIndex(between);
            }
        }
    };
    const released = (): void => {
        if (has(draggableColumns) && !eager && has(dragged) && overIndex >= 0) {
            setOrder(previous => array.moveToIndex(overIndex, dragged, previous));
        }
        ghost.current?.remove();
        setDragged(undefined);
        setArmed(undefined);
        setOverIndex(-1);
    };

    return <table id={id}
                  onDragOver={event => event.preventDefault()}
                  className={join(
                      tableClassName,
                      notEmpty(apportioned) && 'apportioned',
                      has(draggableColumns) && 'sortable'
                  )}>
        <thead className={theadClassName}>
        <tr className={join(
            trClassName,
            headerRowClassName
        )}>{ordered.map(({display, column, className, width}, position) => {
            const key = String(column);
            const share = has(width) ? shares[key] : undefined;
            const travels = has(draggableColumns) && !anchored(position);
            return <th className={join(
                           thClassName, cellClassName, className,
                           clipped && 'clipped',
                           travels && 'grabbable',
                           hiding && dragged === key && 'hide'
                       )}
                       key={key}
                       scope="col"
                       draggable={travels && armed === key}
                       onMouseDown={travels ? () => setArmed(key) : undefined}
                       onDragStart={travels ? event => {
                           setDragged(key);
                           const surface = event.currentTarget.closest('table');
                           if (has(event.dataTransfer) && has(surface)) {
                               ghost.current = columnGhost(surface, position);
                               document.body.appendChild(ghost.current);
                               event.dataTransfer.effectAllowed = 'move';
                               event.dataTransfer.setDragImage(ghost.current, ghost.current.offsetWidth / 2, 16);
                           }
                       } : undefined}
                       onDragOver={event => {
                           event.preventDefault();
                           landedAt(position);
                       }}
                       onDragEnd={travels ? released : undefined}
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
                       onMouseDown={event => event.stopPropagation()}
                       onPointerDown={gripAt(setGrip, key, neighborOf(key), shares)}
                       onPointerMove={dragTo(setShares, grip)}
                       onPointerUp={() => setGrip(null)}/>}
            </th>;
        })}</tr>
        </thead>
        <tbody className={tbodyClassName}>{rows.map((row, rowNumber) =>
            <tr className={join(trClassName, rowClassName)} key={rowNumber}>
                {ordered.map(({column}, columnNumber) => {
                    const cell = row[column];
                    return <td className={join(
                                   tdClassName, cellClassName, cell.className,
                                   clipped && 'ellipsis',
                                   hiding && dragged === String(column) && 'hide'
                               )} key={columnNumber}>
                        {cell.display}
                    </td>;
                })}</tr>
        )}</tbody>
    </table>;
};

export type {Column, Row} from './types';
