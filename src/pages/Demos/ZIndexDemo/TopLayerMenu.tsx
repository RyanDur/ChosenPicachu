import {Entry, Item, Menu} from '@components/Menu';
import {FC, useId, useState} from 'react';
import {Maybe, nothing, some} from '@ryandur/sand';
import {SortChoice, sortChoices, sortByWords} from './sort-choices';

export const TopLayerMenu: FC<{onOpened: () => void}> = ({onOpened}) => {
  const menu = useId();
  const [chosen, updateChosen] = useState<Maybe<SortChoice>>(nothing());
  const words = sortByWords(chosen);

  return <>
    <button type="button" tabIndex={0} className="button primary reachable" popoverTarget={menu} aria-label={`${words}, in the top layer`}>{words}</button>
    <Menu id={menu} popover="auto" className="card rounded-corners lifted" aria-label="Sort by, in the top layer"
      onToggle={({newState}) => {
        if (newState === 'open') {
          onOpened();
        }
      }}>
      {sortChoices.map(choice =>
        <Entry key={choice}>
          <Item tabIndex={0} className="sub-title reachable" popoverTarget={menu} popoverTargetAction="hide"
            aria-current={chosen.map(picked => picked === choice).orElse(false)}
            onClick={() => updateChosen(some(choice))}>{choice}</Item>
        </Entry>)}
    </Menu>
  </>;
};
