import {Paths} from '@pages/Paths';
import {PageError} from '@pages/PageError';
import {Header} from '@pages/BasePage/Header';
import {RecordPage} from './RecordPage';
import names from '@pages/names.json';

const RecordHeader = () => <Header title="The record" listed={names.record}/>;

export const TheRecord = {
  path: Paths.record,
  errorElement: <PageError/>,
  handle: {header: RecordHeader},
  element: <RecordPage/>
};
