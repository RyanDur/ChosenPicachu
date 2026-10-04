import {FC, useEffect, useId, useState} from 'react';
import {Maybe, maybe, nothing, some} from '@ryandur/sand';
import {classNames} from '@components/class-names';
import {SortMenu} from './SortMenu';
import {TopLayerMenu} from './TopLayerMenu';
import {CardOne} from './card-one';

const opened: Record<CardOne | 'top layer', string> = {
  contained: 'The list opened under card two. Its 9999 counts only inside card one.',
  free: 'The list opened over card two. Card one has no z-index now, so the 9999 is compared with card two’s 1.',
  'top layer': 'The list opened in the top layer, over both cards. No z-index is compared there.'
};

type Props = {
  cardOne: CardOne;
  onCardOneChosen: (cardOne: CardOne) => void;
};

export const TrappedMenu: FC<Props> = ({cardOne, onCardOneChosen}) => {
  const [said, updateSaid] = useState<Maybe<string>>(nothing());
  const trap = useId();

  useEffect(() => {
    const topLayerOpened = ({target}: Event): void => {
      if (target instanceof HTMLElement && target.matches(':popover-open')) {
        updateSaid(some(opened['top layer']));
      }
    };
    const figure = maybe(document.getElementById(trap));
    figure.map(element => element.addEventListener('toggle', topLayerOpened, true));
    return () => {
      figure.map(element => element.removeEventListener('toggle', topLayerOpened, true));
    };
  }, [trap]);

  return <figure id={trap} className="trapped-menu card rounded-corners lifted padded">
    <ol className="trap-steps">
      <li className="paragraph">Press Sort by, built the old way, and look where its list opens.</li>
      <li className="paragraph">Uncheck “Card one has z-index: 1”, and press Sort by again.</li>
      <li className="paragraph">Press Sort by, in the top layer, with the box checked or not.</li>
    </ol>
    <ol className="old-way-cards">
      <li className={classNames('old-way-card card rounded-corners floating', cardOne === 'contained' && 'forms-context')}>
        <label className="context-choice reachable">
          <input type="checkbox" checked={cardOne === 'contained'}
            onChange={({currentTarget}) => {
              updateSaid(nothing());
              onCardOneChosen(currentTarget.checked ? 'contained' : 'free');
            }}/>
          Card one has z-index: 1
        </label>
        <p className="paragraph">Its list has z-index: 9999.</p>
        <SortMenu onOpened={() => updateSaid(some(opened[cardOne]))}/>
        <TopLayerMenu/>
      </li>
      <li className="old-way-card card rounded-corners floating forms-context">
        <p className="paragraph">Card two has z-index: 1, and comes later in the code.</p>
      </li>
    </ol>
    <output aria-label="where the list opened" className="paragraph">{said.orElse('')}</output>
    <figcaption className="caption"><strong>The trap.</strong> A list with z-index: 9999 opens under a card with z-index: 1.</figcaption>
  </figure>;
};
