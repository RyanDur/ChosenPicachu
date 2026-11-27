import {FC} from 'react';
import {Exhibit, ExhibitFoot} from '../Exhibit';
import {Aggregations} from './Aggregations';

export const KeptCurrentTable: FC = () =>
  <Exhibit name="The table, kept current by a store">
    <Aggregations/>
    <ExhibitFoot>
      <strong className="bold">The table, kept current by a store.</strong> A batch of trades becomes an action, the
      store holds the trades, and the table asks the store for its rows.
    </ExhibitFoot>
  </Exhibit>;
