import {Paths} from '@pages/Paths';
import {PageError} from '@pages/PageError';
import {Header} from '@pages/BasePage/Header';
import {Page} from '@pages/BasePage/Page';
import {RecordPage} from './RecordPage';
import names from '@pages/names.json';

const header = <Header title="The record" listed={names.record}/>;

export const TheRecord = {
  path: Paths.record,
  errorElement: <Page header={header}><PageError/></Page>,
  element: <Page header={header}><RecordPage/></Page>
};
