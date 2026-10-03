import {FC, useId} from 'react';
import {sortChoices} from './sort-choices';

export const TopLayerMenu: FC = () => {
  const menu = useId();

  return <>
    <button type="button" tabIndex={0} className="button primary reachable" popoverTarget={menu}>Sort by, in the top layer</button>
    <menu id={menu} popover="auto" className="menu card rounded-corners lifted" aria-label="Sort by, in the top layer">
      {sortChoices.map(choice =>
        <li className="entry" key={choice}>
          <button type="button" tabIndex={0} className="item sub-title reachable" popoverTarget={menu} popoverTargetAction="hide">{choice}</button>
        </li>)}
    </menu>
  </>;
};
