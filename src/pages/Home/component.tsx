import {Table} from '@components/Table';
import {columns, rows} from './demoData';
import './Home.css';

export const HomePage = () =>
  <Table tableClassName="fancy-table home-table"
         theadClassName="header"
         trClassName="row"
         tbodyClassName="body"
         cellClassName="cell"
         columns={columns} rows={rows}/>;
