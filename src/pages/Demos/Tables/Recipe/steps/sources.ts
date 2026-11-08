import surveySource from '@components/DragSortableTable/model/survey.ts?sample';
import travelSource from '@components/DragSortableTable/model/travel.ts?sample';
import liftSource from '@components/DragSortableTable/model/lift.ts?sample';
import arrowsSource from '@components/DragSortableTable/model/arrows.ts?sample';
import gripSource from '@components/DragSortableTable/RowGrip.tsx?sample';
import sortableCss from '@components/DragSortableTable/sortable.css?sample';
import headerCss from '@components/DragSortableTable/Header.css?sample';
import frameHtml from '../../Frame/table.html?sample';
import surfaceCss from '../../../../../styles/surface.css?sample';
import stateSource from '@components/DragSortableTable/model/table-state.ts?sample';
import reducerSource from '@components/DragSortableTable/model/reducer.ts?sample';
import elementSource from '@components/DragSortableTable/useDragSortable.ts?sample';
import storeSource from '@components/store/store.ts?sample';
import frameSettle from '../../Frame/table/settle.ts?sample';
import frameCarry from '../../Frame/table/carry.ts?sample';
import selectorsSource from '@components/DragSortableTable/model/selectors.ts?sample';
import menuSource from '@components/DragSortableTable/SortMenu.tsx?sample';
import rowSource from '@components/DragSortableTable/Row.tsx?sample';
import headersSource from '@components/DragSortableTable/Headers.tsx?sample';
import arrangementSource from '@components/DragSortableTable/model/arrangement.ts?sample';
import placingSource from '@components/DragSortableTable/placing.ts?sample';
import looksSource from '@components/DragSortableTable/model/looks.ts?sample';
import bootSource from '../../Frame/boot.ts?sample';
import frameColumns from '../../Frame/table/columns.ts?sample';
import frameRows from '../../Frame/table/rows.ts?sample';
import frameGrip from '../../Frame/table/grip.ts?sample';
import frameHandle from '../../Frame/table/handle.ts?sample';
import frameParts from '../../Frame/table/parts.ts?sample';

export const sources = {
  survey: surveySource,
  grip: gripSource,
  sortableCss,
  headerCss,
  frameHtml,
  surfaceCss,
  state: stateSource,
  reducer: reducerSource,
  selectors: selectorsSource,
  frameCarry,
  frameSettle,
  travel: travelSource,
  lift: liftSource,
  arrows: arrowsSource,
  element: elementSource,
  store: storeSource,
  menu: menuSource,
  row: rowSource,
  headers: headersSource,
  arrangement: arrangementSource,
  placing: placingSource,
  looks: looksSource,
  boot: bootSource,
  frameColumns,
  frameRows,
  frameGrip,
  frameHandle,
  frameParts
};
