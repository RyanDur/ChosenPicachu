import {Table} from '../Table';
import {columns, rows} from '../../__tests__/util';
import './Home.scss';

export const Home = () => {
    return <Table tableClassName="fancy-table home-table"
                  theadClassName="header"
                  trClassName="row"
                  tbodyClassName="body"
                  cellClassName="cell"
                  columns={columns} rows={rows}/>;
};