import {OldTable as Table} from '../Table';
import {columns, rows} from '../../__tests__/util';
import './Home.scss';

export const Home = () =>
    <Table columns={columns} rows={rows}/>;