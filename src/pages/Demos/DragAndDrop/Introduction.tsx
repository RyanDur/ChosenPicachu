import {TabLink} from '@pages/Demos/TabLink';
import {FC} from 'react';
import {DemoTopics} from '../types';

export const DragSortIntroduction: FC = () =>
  <header className="tab-introduction">
    <p className="paragraph">A sortable list is a list the reader reorders by picking an item up and putting it down
      somewhere else.</p>
    <p className="paragraph">This tab assumes the details element, a class, a dial and a custom property from the{' '}
      <TabLink to={DemoTopics.accordions}>accordions tab</TabLink>, and React, its state, an event, a reducer, a context
      and dispatch, which the <TabLink to={DemoTopics.zIndex}>z-index tab</TabLink> explains. The rest is new here.</p>
    <p className="paragraph">The browser has shipped its own drag and drop for twenty years, and most of us have reached
      for a library anyway, because the native drag looked wrong, dropped in the wrong place, or could not be done with
      a keyboard.</p>
    <p className="paragraph">The order belongs to the user, and the list is the element built for it. So I use the
      browser’s own drag, and write script only for what the platform does not yet do: making room as you hover,
      or holding still until the drop; showing the item where it came from, or hiding it; sliding the neighbors, or
      not.</p>
    <p className="paragraph">Each of those is a dial. A dial is a control that sets how a build behaves, as the{' '}
      <TabLink to={DemoTopics.accordions}>accordions tab</TabLink> says. The dials sit in the last part of the tutorial
      below, and the exhibit above them changes to match.</p>
    <p className="paragraph">By the end you can build a sortable list on the browser’s own drag and drop, choose each of
      those three behaviors and say what it costs, and give a keyboard user the same list, since the keyboard has the
      same moves as the pointer. The exhibit below is three items; drag one by its grip, or focus the grip and use the
      left and right arrows.</p>
  </header>;
