import {Table} from '../Table';
import {columns, rows} from '../../__tests__/util/dummyData';
import './Home.css';

export const Home = () =>
    <Table tableClassName="fancy-table home-table"
           theadClassName="header"
           trClassName="row"
           tbodyClassName="body"
           cellClassName="cell"
           columns={columns} rows={rows}/>;
