import React from 'react';
import './App.css';
import {Table} from './Table';
import {Column, Row} from './Table/types';

const columns: Column[] = [
  {name: 'column1', display: <h2 className="column-name">{'Column 1'}</h2>},
  {name: 'column2', display: <h2 className="column-name">{'Column 2'}</h2>},
  {name: 'column3', display: <h2 className="column-name">{'Column 3'}</h2>},
  {name: 'column4', display: <h2 className="column-name">{'Column 3'}</h2>},
];

const rows: Row<string>[] = [{
  column1: {
    value: 'foo1',
    display: <h3>{'Foo 1'}</h3>
  },
  column2: {
    value: 'bar2',
    display: <h3>{'Bar 2'}</h3>
  },
  column3: {
    value: 'baz3',
    display: 'Baz 3'
  },
  column4: {
    value: 'bop4',
    display: 'Bop 4'
  }
}, {
  column1: {
    value: 'foo5',
  },
  column2: {
    value: 'bar6',
    display: <h3>{'Bar 6'}</h3>
  },
  column3: {
    value: 'baz7',
    display: <h3>{'Baz 7'}</h3>
  },
  column4: {
    value: 'bop8',
    display: 'Bop 8'
  }
}, {
  column1: {
    value: 'bar9',
    display: <h3>{'Bar 9'}</h3>
  },
  column2: {
    value: 'bar10',
    display: <h3>{'Bar 10'}</h3>
  },
  column3: {
    value: 'baz11',
    display: <h3>{'Baz 11'}</h3>
  },
  column4: {
    value: 'bop12',
    display: <h3>{'Bop 12'}</h3>
  }
}, {
  column1: {
    value: 'bar13',
    display: <h3>{'Bar 13'}</h3>
  },
  column2: {
    value: 'bar14',
    display: <h3>{'Bar 14'}</h3>
  },
  column3: {
    value: 'baz15',
    display: <h3>{'Baz 15'}</h3>
  },
  column4: {
    value: 'bop16',
    display: <h3>{'Bop 16'}</h3>
  }
}];

function App() {
  return (
    <div className="App">
      <main className="container center">
        <Table columns={columns} rows={rows} />
      </main>
    </div>
  );
}

export default App;
