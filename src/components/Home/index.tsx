import {Table} from '../Table';
import {columns, rows} from '../../__tests__/util/dummyData';
import './Home.css';

export const Home = () => {
    return <Table tableClassName="home-table" columns={columns} rows={rows}/>;
};