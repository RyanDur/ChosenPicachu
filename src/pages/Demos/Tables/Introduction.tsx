import {FC} from 'react';

export const TablesIntroduction: FC = () =>
  <header className="tab-introduction">
    <p className="paragraph">A table of live trades is the hardest thing on this site: its rows change while you read
      them, and this one also lets you drag a column or a row to a new place, resize a column, and sort by one.</p>
    <p className="paragraph">The bug most of us have met is the fight between the drag and the data: a column that jumps
      back when a row updates, a drag that stutters because the page is measured on every move, a sort that undoes a move
      or a move that undoes a sort.</p>
    <p className="paragraph">This page’s view is that the columns and the seats are the state and the data never moves: a
      trade rewrites a row’s values under its key, the arrangement is a separate thing the reader owns, and everything a
      drag needs is measured once, at the grab. Every pixel of the drag is drawn from pointer events, with no library,
      and the table is built twice, once with the three languages raw and once in React, with the same stores
      underneath.</p>
    <p className="paragraph">By the end you can drag a column or a row with the pointer or the arrow keys while trades keep
      landing, resize a column by drag or by keyboard, sort and end a sort by moving a row, and say why the table never
      fights the data. The exhibit below is live; grab a column’s header, or a row’s grip, and move it.</p>
  </header>;
