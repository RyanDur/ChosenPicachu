import {Table} from '../Table';
import {columns, rows} from '../../__tests__/util';
import './Home.css';

export const Home = () => {
    return <article className="card gutter">
        <Table tableClassName="home-table" columns={columns} rows={rows}/>
    </article>;
};