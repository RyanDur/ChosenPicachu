import {empty, has, notEmpty} from '@ryandur/sand';
import {array} from '@components/arrays';
import {Column, Row} from './types';
import {Dispatch, FC, KeyboardEvent, PointerEvent, SetStateAction, useRef, useState} from 'react';
import {join} from '@components/class-names';
import Handle from '@components/grip.svg';
import './Table.css';

export type DragStyle = 'eager-move' | 'lazy-move' | 'hide-eager-move' | 'hide-lazy-move';
export type ColumnDragStyle = DragStyle;

export type TableProps = {
    columns: Column[];
    rows: Row[];
    draggableColumns?: DragStyle;
    draggableRows?: DragStyle;
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

const rowGhost = (source: HTMLTableElement, position: number): HTMLTableElement => {
    const ghost = document.createElement('table');
    ghost.className = join(source.className, 'column-ghost');
    const line = source.tBodies[0]?.rows[position];
    if (has(line)) {
        const body = document.createElement('tbody');
        body.className = source.tBodies[0].className;
        body.appendChild(line.cloneNode(true));
        ghost.appendChild(body);
    }
    ghost.style.position = 'fixed';
    ghost.style.top = '0';
    ghost.style.left = '0';
    ghost.style.willChange = 'transform';
    ghost.style.width = `${source.offsetWidth}px`;
    ghost.style.background = 'var(--paper)';
    ghost.style.boxShadow = 'var(--lift-box-shadow)';
    ghost.style.pointerEvents = 'none';
    return ghost;
};

const columnGhost = (source: HTMLTableElement, position: number): HTMLTableElement => {
    const ghost = document.createElement('table');
    ghost.className = join(source.className, 'column-ghost');
    const width = source.rows[0]?.cells[position]?.offsetWidth ?? 0;
    for (const section of [source.tHead, ...source.tBodies]) {
        if (has(section)) {
            ghost.appendChild(columnSlice(section, position));
        }
    }
    ghost.style.position = 'fixed';
    ghost.style.top = '0';
    ghost.style.left = '0';
    ghost.style.willChange = 'transform';
    ghost.style.width = `${width}px`;
    ghost.style.background = 'var(--paper)';
    ghost.style.boxShadow = 'var(--lift-box-shadow)';
    ghost.style.pointerEvents = 'none';
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
        draggableRows,
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
    const [dragged, setDragged] = useState<string>();
    const [draggedRow, setDraggedRow] = useState(-1);
    const landing = useRef('');
    const rowLanding = useRef(-1);
    const [rowOrder, setRowOrder] = useState<number[]>(() => rows.map((_, seat) => seat));
    const ghost = useRef<HTMLTableElement>(null);
    const byKey = new Map(columns.map(definition => [String(definition.column), definition]));
    const ordered = order.map(key => byKey.get(key)).filter(has);
    const apportioned = ordered.filter(({width}) => has(width)).map(({column}) => String(column));
    const clipped = notEmpty(apportioned);
    const eager = draggableColumns === 'eager-move' || draggableColumns === 'hide-eager-move';
    const hiding = draggableColumns === 'hide-eager-move' || draggableColumns === 'hide-lazy-move';
    const rowsEager = draggableRows === 'eager-move' || draggableRows === 'hide-eager-move';
    const rowsHiding = draggableRows === 'hide-eager-move' || draggableRows === 'hide-lazy-move';
    const arranged = rowOrder.length === rows.length
        ? rowOrder.map(seat => ({row: rows[seat], seat}))
        : rows.map((row, seat) => ({row, seat}));
    const neighborOf = (key: string): string => {
        const index = apportioned.indexOf(key);
        return apportioned[index + 1] ?? apportioned[index - 1];
    };
    const anchored = (position: number): boolean =>
        position === 0 || position === ordered.length - 1;
    const headerUnder = (x: number, y: number): string =>
        document.elementFromPoint(x, y)?.closest('th')?.dataset.column ?? '';
    const rest = (key: string, struck: string) => (previous: string[]): string[] => {
        const between = Math.min(Math.max(previous.indexOf(struck), 1), previous.length - 2);
        return array.moveToIndex(between, key, previous);
    };
    const lifted = (key: string, position: number) => (event: PointerEvent<HTMLElement>): void => {
        event.preventDefault();
        const surface = event.currentTarget.closest('table');
        let grip = 0;
        if (has(surface)) {
            const shade = columnGhost(surface, position);
            document.body.appendChild(shade);
            grip = shade.offsetWidth / 2;
            shade.style.transform = `translate(${event.clientX - grip}px, ${event.clientY - 16}px)`;
            ghost.current = shade;
        }
        setDragged(key);
        let lastStruck = '';
        const carried = (moving: globalThis.PointerEvent): void => {
            ghost.current?.style.setProperty('transform',
                `translate(${moving.clientX - grip}px, ${moving.clientY - 16}px)`);
            const struck = headerUnder(moving.clientX, moving.clientY);
            if (empty(struck) || struck === key || struck === lastStruck) {
                return;
            }
            lastStruck = struck;
            if (eager) {
                setOrder(rest(key, struck));
            } else {
                landing.current = struck;
            }
        };
        const released = (): void => {
            if (!eager && notEmpty(landing.current)) {
                setOrder(rest(key, landing.current));
            }
            ghost.current?.remove();
            ghost.current = null;
            landing.current = '';
            setDragged(undefined);
            document.removeEventListener('pointermove', carried);
            document.removeEventListener('pointerup', released);
            document.removeEventListener('pointercancel', released);
        };
        document.addEventListener('pointermove', carried);
        document.addEventListener('pointerup', released);
        document.addEventListener('pointercancel', released);
    };
    const nudged = (seat: number) => (event: KeyboardEvent<HTMLElement>): void => {
        if (event.key !== 'ArrowUp' && event.key !== 'ArrowDown') {
            return;
        }
        event.preventDefault();
        const toward = event.key === 'ArrowDown' ? 1 : -1;
        setRowOrder(previous => {
            const at = previous.indexOf(seat);
            const to = Math.min(Math.max(at + toward, 0), previous.length - 1);
            return array.moveToIndex(to, seat, previous);
        });
    };
    const rowUnder = (x: number, y: number): number => {
        const struck = document.elementFromPoint(x, y)?.closest('tr')?.dataset.seat;
        return has(struck) ? Number(struck) : -1;
    };
    const reseated = (seat: number, struck: number) => (previous: number[]): number[] =>
        array.moveToIndex(previous.indexOf(struck), seat, previous);
    const liftedRow = (seat: number, position: number) => (event: PointerEvent<HTMLElement>): void => {
        event.preventDefault();
        const surface = event.currentTarget.closest('table');
        let grip = 0;
        if (has(surface)) {
            const shade = rowGhost(surface, position);
            document.body.appendChild(shade);
            grip = 16;
            shade.style.transform = `translate(${event.clientX - grip}px, ${event.clientY - 16}px)`;
            ghost.current = shade;
        }
        setDraggedRow(seat);
        let lastStruck = -1;
        const carried = (moving: globalThis.PointerEvent): void => {
            ghost.current?.style.setProperty('transform',
                `translate(${moving.clientX - grip}px, ${moving.clientY - 16}px)`);
            const struck = rowUnder(moving.clientX, moving.clientY);
            if (struck < 0 || struck === seat || struck === lastStruck) {
                return;
            }
            lastStruck = struck;
            if (rowsEager) {
                setRowOrder(reseated(seat, struck));
            } else {
                rowLanding.current = struck;
            }
        };
        const released = (): void => {
            if (!rowsEager && rowLanding.current >= 0) {
                setRowOrder(reseated(seat, rowLanding.current));
            }
            ghost.current?.remove();
            ghost.current = null;
            rowLanding.current = -1;
            setDraggedRow(-1);
            document.removeEventListener('pointermove', carried);
            document.removeEventListener('pointerup', released);
            document.removeEventListener('pointercancel', released);
        };
        document.addEventListener('pointermove', carried);
        document.addEventListener('pointerup', released);
        document.addEventListener('pointercancel', released);
    };

    return <table id={id}
                  className={join(
                      tableClassName,
                      notEmpty(apportioned) && 'apportioned',
                      (has(draggableColumns) || has(draggableRows)) && 'sortable'
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
                       data-column={key}
                       onPointerDown={travels ? lifted(key, position) : undefined}
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
        <tbody className={tbodyClassName}>{arranged.map(({row, seat}, position) =>
            <tr className={join(trClassName, rowClassName)}
                key={seat}
                data-seat={seat}>
                {ordered.map(({column}, columnNumber) => {
                    const cell = row[column];
                    return <td className={join(
                                   tdClassName, cellClassName, cell.className,
                                   clipped && 'ellipsis',
                                   hiding && dragged === String(column) && 'hide',
                                   rowsHiding && draggedRow === seat && 'hide-across'
                               )} key={columnNumber}>
                        {columnNumber === 0 && has(draggableRows) &&
                            <button type="button"
                                    className="grip grabbable"
                                    aria-label={`move row ${position + 1}`}
                                    onKeyDown={nudged(seat)}
                                    onPointerDown={liftedRow(seat, position)}>
                                <Handle/>
                            </button>}
                        {cell.display}
                    </td>;
                })}</tr>
        )}</tbody>
    </table>;
};

export type {Column, Row} from './types';
