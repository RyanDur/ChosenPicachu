import {Table} from '../Table';
import {columns, rows} from '../../__tests__/dummyData';
import './Home.css';

export const Home = () => {
    return <section id="home" className="gutter">
        <Table tableClassName="home-table" columns={columns} rows={rows}/>
    </section>;
};