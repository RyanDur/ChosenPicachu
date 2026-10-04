import {FC, useId, useState} from 'react';
import {Maybe, nothing, some} from '@ryandur/sand';
import {SortChoice, sortChoices} from './sort-choices';

export const TopLayerMenu: FC<{onOpened: () => void}> = ({onOpened}) => {
  const menu = useId();
  const [chosen, updateChosen] = useState<Maybe<SortChoice>>(nothing());

  return <>
    <button type="button" tabIndex={0} className="button primary reachable" popoverTarget={menu}>
      {chosen.map(choice => `Sort by, in the top layer: ${choice}`).orElse('Sort by, in the top layer')}
    </button>
    <menu id={menu} popover="auto" className="menu card rounded-corners lifted" aria-label="Sort by, in the top layer"
      onToggle={({newState}) => {
        if (newState === 'open') {
          onOpened();
        }
      }}>
      {sortChoices.map(choice =>
        <li className="entry" key={choice}>
          <button type="button" tabIndex={0} className="item sub-title reachable" popoverTarget={menu} popoverTargetAction="hide"
            aria-current={chosen.map(picked => picked === choice).orElse(false)}
            onClick={() => updateChosen(some(choice))}>{choice}</button>
        </li>)}
    </menu>
  </>;
};
