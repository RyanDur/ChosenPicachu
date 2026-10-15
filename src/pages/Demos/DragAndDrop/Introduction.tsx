import {FC} from 'react';

export const DragSortIntroduction: FC = () =>
  <header className="tab-introduction">
    <p className="paragraph">A sortable list is a list the reader reorders by picking an item up and putting it down
      somewhere else.</p>
    <p className="paragraph">The browser has shipped its own drag and drop for twenty years, and most of us have reached
      for a library anyway, because the native drag looked wrong, dropped in the wrong place, or could not be done with a
      keyboard.</p>
    <p className="paragraph">This page’s view is that the order belongs to the user and the list is the element built for
      it, so the drag should be the browser’s own, with script only for what the platform does not yet do: making room as
      you hover, or holding still until the drop; showing the item where it came from, or hiding it; sliding the
      neighbours, or not. Each of those is a dial on the exhibit, and the keyboard has the same moves as the pointer.</p>
    <p className="paragraph">By the end you can build a sortable list on the browser’s own drag and drop, choose each of
      those three behaviours and say what it costs, and give a keyboard user the same list. The exhibit below is three
      items; drag one, or focus it and use the arrow keys.</p>
  </header>;
