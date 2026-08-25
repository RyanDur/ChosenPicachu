import {FC, PointerEvent} from 'react';
import {Maybe, maybe} from '@ryandur/sand';
import {ColumnData, RowData} from '@components/Table';
import {Drift, Flight} from './travel';
import {Survey} from './survey';
import {ColumnGhost, RowGhost} from './ghosts';

type Surface = {
    onPointerMove: (event: PointerEvent<HTMLElement>) => void;
    onPointerUp: () => void;
    onPointerCancel: () => void;
    onLostPointerCapture: () => void;
};

type Travel<SUBJECT> = {
    aloft: Maybe<SUBJECT>;
    survey: Maybe<Survey>;
    flight: Flight;
    drift: Drift;
    surface: Surface;
};

type Props = {
    columnsTravel: Travel<string>;
    rowsTravel: Travel<number>;
    ordered: readonly ColumnData[];
    rows: RowData[];
    standing: readonly number[];
};

export const Aloft: FC<Props> = ({columnsTravel, rowsTravel, ordered, rows, standing}) => {
    const widths: Readonly<Record<string, number | undefined>> = rowsTravel.survey.map(survey => {
        const spanned = ordered.reduce((sum, {column}) => sum + (survey.columnWidths[column] ?? 0), 0) || 1;
        return Object.fromEntries(ordered.map(({column}) =>
            [column, (survey.columnWidths[column] ?? 0) / spanned * 100]));
    }).orElse({});
    const aloftColumn = columnsTravel.aloft.mBind(held =>
        maybe(ordered.find(definition => definition.column === held)));
    const aloftRow = rowsTravel.aloft.map(held => rows[held]);
    const surface = columnsTravel.aloft.either(() => columnsTravel.surface, () => rowsTravel.surface);
    return <>
        {aloftColumn.either(column =>
            <ColumnGhost at={columnsTravel.flight} drift={columnsTravel.drift}
                         column={column} rows={standing.map(row => rows[row])}
                         heights={columnsTravel.survey
                             .map(survey => standing.map(row => survey.rowHeights[row]))
                             .orElse([])}/>, () => null)}
        {aloftRow.either(row =>
            <RowGhost at={rowsTravel.flight} drift={rowsTravel.drift}
                      columns={ordered} widths={widths} row={row}/>, () => null)}
        {(!columnsTravel.aloft.isNothing || !rowsTravel.aloft.isNothing) &&
            <article className="drag-surface" {...surface}/>}
    </>;
};
