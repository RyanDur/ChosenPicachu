import {FC} from 'react';

export const ChartsIntroduction: FC = () =>
  <header className="tab-introduction">
    <p className="paragraph">A live chart draws numbers that are still arriving. The charts on this page follow every
      trade of bitcoin for US dollars on Coinbase, an exchange where it is bought and sold, as the trades happen.</p>
    <p className="paragraph">Drawing is the easy part. The hard parts are in the data. Trades arrive faster than anyone can
      read them. The past has to be fetched and joined to what is arriving now. And two charts of the same trades must
      not disagree.</p>
    <p className="paragraph">This page’s view is that a chart is arithmetic over data the page already holds, so there is
      no chart library here. The page holds one live feed, a connection that delivers each trade as it happens, and the
      past, fetched for each period a chart shows. Each chart is worked out from those every time the page redraws. The layout is kept in the page’s
      address, so a reload or a shared link brings back the same charts in the same order.</p>
    <p className="paragraph">By the end you can draw a live line chart, candles, which show how the price opened, closed
      and reached in each span of time, and two charts of who is buying and who is selling, all from one feed. You can
      also let a reader add, sort and remove charts. The exhibit below starts with one chart, the price line. Press + to
      add another, and press a chart to open the steps that build it. The last part of this page builds the workspace
      the charts sit in.</p>
  </header>;
