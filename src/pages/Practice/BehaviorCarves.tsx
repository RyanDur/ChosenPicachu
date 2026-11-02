import {FC} from 'react';
import storeSource from '@components/store.ts?sample';
import actionsSource from '@components/DragSortableTable/actions.ts?sample';
import demosStoreSource from '@pages/Demos/store.ts?sample';
import reducerSource from '@components/DragSortableTable/reducer.ts?sample';
import draggableColumnSource from '@components/DragSortableTable/DraggableColumn.tsx?sample';
import basePageSheet from '../../BasePage.css?sample';
import exchangeSource from '@pages/Demos/exchange.ts?sample';
import useDragSortableSource from '@components/DragSortableTable/useDragSortable.ts?sample';
import lazyBuildSource from '@pages/Demos/Tables/Frame/builds/Lazy.ts?sample';
import bootSource from '@pages/Demos/Tables/Frame/boot.ts?sample';
import surfaceSheet from '../../styles/surface.css?sample';
import accordionsSheet from '@pages/Demos/Accordions/Accordions.css?sample';
import {aside, Snippet} from '@pages/Demos/Recipe';
import {span, unit} from '@pages/Demos/Recipe/carve';
import {Line} from '@pages/Demos/Recipe/Snippet';
import {CodeFile, Sample} from '@pages/Demos/Recipe/sample';

const reducerType = span(storeSource, 'export type Reducer', '(state, action) => reducers.reduce');
const lifted = span(actionsSource, 'export const lifted', 'export const lifted');
const dropped = span(actionsSource, 'export const dropped', 'export const dropped');
const tradeArrived = span(demosStoreSource, 'export const tradeArrived', 'export const tradeArrived');
const tableReducer = span(reducerSource, 'const answering', 'isTableAction(action) ? answering');

export const ReducerCarve: FC = () => <Snippet label="TS" lines={reducerType}/>;

export const EventsCarve: FC = () => <>
  <Snippet label="TS" lines={[...lifted, aside('// …'), ...dropped]}/>
  <Snippet label="TS" lines={tradeArrived}/>
</>;

export const TableReducerCarve: FC = () => <Snippet label="TS" lines={tableReducer}/>;

// sand ships only its built files, so its source is carved by hand from the commit the installed 10.0.0 was built from
const sandUtil: CodeFile = {
  path: 'src/lib/util/index.ts',
  owner: 'sand',
  url: 'https://github.com/RyanDur/sand/blob/65821220fe38666bfad429a6a1b4cfbb65b4c463/src/lib/util/index.ts'
};
const sandLine = (line: number, text: string): Line => ({text, from: {file: sandUtil, line}});

export const PreludeCarve: FC = () => <Snippet label="TS" lines={[
  sandLine(77, 'export const not = (value: unknown): boolean => !value;'),
  aside('// …'),
  sandLine(89, 'export const is = (value: unknown): boolean => !not(value);'),
  aside('// …'),
  sandLine(164, 'export const notEmpty = <T>(value: T | null | undefined): value is T => not(empty(value));'),
  aside('// …'),
  sandLine(188, 'export const has = notEmpty;')
]}/>;

const tableCondition = 'if (has(drag) && has(settling))';

export const ConditionCarve: FC = () =>
  <Snippet label="TS" lines={span(draggableColumnSource, tableCondition, tableCondition)}/>;

const oneLine = (sheet: Sample, line: string): Line[] => span(sheet, line, line);

export const SheetQuestionsCarve: FC = () => <>
  <Snippet label="CSS" lines={oneLine(basePageSheet, '&:not(:has(.header-settings)) .app-title')}/>
  <Snippet label="CSS" lines={oneLine(accordionsSheet, '.info-toggle:not(:checked) ~ .info')}/>
  <Snippet label="CSS" lines={oneLine(surfaceSheet, ':is(:hover, :focus) > .liftable')}/>
</>;

export const MiddlewareCarve: FC = () => <Snippet label="TS" lines={unit(storeSource, 'export type Middleware')}/>;

const fromTheSocket = '.onMessage(event =>';

export const ExchangeCarve: FC = () => <Snippet label="TS" lines={[
  ...span(exchangeSource, fromTheSocket, fromTheSocket),
  aside('// …'),
  ...span(exchangeSource, '.onFailure(cause => {', 'dispatch(candlesRefused(period));')
]}/>;

const reactHand = 'const [hand] = useState(() => tableStore());';
const plainHand = 'const hand = tableStore();';

export const BuildsCarve: FC = () => <>
  <Snippet label="TS" lines={span(useDragSortableSource, reactHand, reactHand)}/>
  <Snippet label="TS" lines={span(lazyBuildSource, plainHand, plainHand)}/>
</>;

export const TableEventsCarve: FC = () =>
  <Snippet label="TS" lines={span(bootSource, "table.addEventListener('column-moved'", "table.addEventListener('sorted'")}/>;
