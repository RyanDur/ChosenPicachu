import {FC, PointerEvent} from 'react';
import {has} from '@ryandur/sand';
import {classNames} from '@components/class-names';
import {Column, Dress, TableProps} from '@components/Table';
import {Drift, Flight} from './travel';
import {Bounds} from './survey';
import {ColumnGhost, RowGhost} from './ghosts';

type Surface = {
    onPointerMove: (event: PointerEvent<HTMLElement>) => void;
    onPointerUp: () => void;
    onPointerCancel: () => void;
    onLostPointerCapture: () => void;
};

type Travel<SUBJECT> = {
    aloft?: SUBJECT;
    survey?: Bounds;
    flight: Flight;
    drift: Drift;
    surface: Surface;
};

type Props = {
    columnsTravel: Travel<string>;
    rowsTravel: Travel<number>;
    ordered: readonly Column[];
    rows: TableProps['rows'];
    standing: readonly number[];
    dress: Dress;
};

export const Aloft: FC<Props> = ({columnsTravel, rowsTravel, ordered, rows, standing, dress}) => {
    const rowSurvey = rowsTravel.survey;
    const spanned = ordered.reduce((sum, {column}) => sum + (rowSurvey?.columnWidths[column] ?? 0), 0) || 1;
    const widths = Object.fromEntries(ordered.map(({column}) => [column,
        has(rowSurvey) ? (rowSurvey.columnWidths[column] ?? 0) / spanned * 100 : undefined]));
    const ghostDress = {
        table: classNames(dress.tableClassName),
        thead: classNames(dress.theadClassName),
        headerRow: classNames(dress.trClassName, dress.headerRowClassName),
        header: classNames(dress.thClassName, dress.cellClassName),
        tbody: classNames(dress.tbodyClassName),
        row: classNames(dress.trClassName, dress.rowClassName),
        cell: classNames(dress.tdClassName, dress.cellClassName)
    };
    const aloftColumn = ordered.find(definition => definition.column === columnsTravel.aloft);
    const aloftRow = has(rowsTravel.aloft) ? rows[rowsTravel.aloft] : undefined;
    const surface = has(columnsTravel.aloft) ? columnsTravel.surface : rowsTravel.surface;
    return <>
        {has(aloftColumn) &&
            <ColumnGhost at={columnsTravel.flight} drift={columnsTravel.drift} dress={ghostDress}
                         column={aloftColumn} rows={standing.map(row => rows[row])}/>}
        {has(aloftRow) &&
            <RowGhost at={rowsTravel.flight} drift={rowsTravel.drift} dress={ghostDress}
                      columns={ordered} widths={widths} row={aloftRow}/>}
        {(has(columnsTravel.aloft) || has(rowsTravel.aloft)) &&
            <article className="drag-surface" {...surface}/>}
    </>;
};
