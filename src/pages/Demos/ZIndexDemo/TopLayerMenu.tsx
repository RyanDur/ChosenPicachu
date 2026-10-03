import {FC, useId} from 'react';

const choices = ['name', 'date', 'size'] as const;

export const TopLayerMenu: FC = () => {
  const menu = useId();

  return <>
    <button type="button" tabIndex={0} className="button primary reachable" popoverTarget={menu}>Sort by, in the top layer</button>
    <menu id={menu} popover="auto" className="menu card rounded-corners lifted" aria-label="Sort by, in the top layer">
      {choices.map(choice =>
        <li className="entry" key={choice}>
          <button type="button" tabIndex={0} className="item sub-title reachable" popoverTarget={menu} popoverTargetAction="hide">{choice}</button>
        </li>)}
    </menu>
  </>;
};
