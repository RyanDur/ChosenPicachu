import {Table} from '../Table';
import {columns, rows} from '../../dummyData';
import './Home.css';

export const HomePage = () =>
  <>
    <header id="app-header" data-testid="header">
      <h1 className="title ellipsis">Home</h1>
    </header>

    <main data-testid="main">
      <Table tableClassName="fancy-table home-table"
             theadClassName="header"
             trClassName="row"
             tbodyClassName="body"
             cellClassName="cell"
             columns={columns} rows={rows}/>
    </main>
  </>;
