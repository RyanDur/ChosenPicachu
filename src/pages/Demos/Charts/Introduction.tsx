import {FC} from 'react';

export const ChartsIntroduction: FC = () =>
  <header className="tab-introduction">
    <p className="paragraph">A live chart draws numbers that are still arriving. The charts on this page follow every
      trade of bitcoin for US dollars on Coinbase, an exchange where it is bought and sold, as the trades happen.</p>
    <p className="paragraph">Drawing is the easy part. The hard parts are in the data. Trades arrive faster than anyone can
      read them. The past has to be fetched and joined to what is arriving now. And two charts of the same trades must
      not disagree.</p>
    <p className="paragraph">I take a chart to be arithmetic over data the page already holds, so there is no chart
      library here. The page holds one live feed, a connection that delivers each trade as it happens, and the
      past, fetched for each period a chart shows. Each chart is worked out from those every time the page redraws.</p>
    <p className="paragraph">By the end you can draw four charts from one feed. The first is a live line.
      The second is candles, which show where the price opened and closed and how far it reached in each span of time.
      The last two show who is buying and who is selling. You can
      also let a reader add, sort and remove charts. The exhibit below starts with one chart, the price line. Press + to add another. The last part of this page builds the workspace
      the charts sit in.</p>
  </header>;
