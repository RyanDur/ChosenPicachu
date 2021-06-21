import {Table} from '../Table';
import {columns, rows} from '../../__tests__/util';
import './Home.css';

export const Home = () => {
    return <article id="home" className="card gutter">
        <Table tableClassName="fancy-table home-table"
               theadClassName="header"
               trClassName="row"
               tbodyClassName="body"
               thClassName="cell"
               tdClassName="cell"
               columns={columns} rows={rows}/>
    </article>;
};