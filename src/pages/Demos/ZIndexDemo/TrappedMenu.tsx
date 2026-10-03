import {FC, useState} from 'react';
import {classNames} from '@components/class-names';
import {SortMenu} from './SortMenu';
import {CardOne} from './card-one';

const says: Record<CardOne, string> = {
  contained: 'Card one forms a stacking context. Its menu opens under card two.',
  free: 'Card one forms no stacking context. Its menu opens over card two.'
};

type Props = {
  cardOne: CardOne;
  onCardOne: (cardOne: CardOne) => void;
};

export const TrappedMenu: FC<Props> = ({cardOne, onCardOne}) => {
  const [changed, updateChanged] = useState(false);

  return <figure className="trapped-menu card rounded-corners lifted padded">
    <label className="context-choice reachable">
      <input type="checkbox" checked={cardOne === 'contained'} onChange={({currentTarget}) => {
        updateChanged(true);
        onCardOne(currentTarget.checked ? 'contained' : 'free');
      }}/>
      Card one has z-index: 1
    </label>
    <output aria-label="what card one does" className="paragraph">{changed && says[cardOne]}</output>
    <ol className="old-way-cards">
      <li className={classNames('old-way-card card rounded-corners floating', cardOne === 'contained' && 'forms-context')}>
        <p className="paragraph"><code>.old-way-card {'{'} position: relative {'}'}</code><br/>
          {cardOne === 'contained' && <><code>.forms-context {'{'} z-index: 1 {'}'}</code><br/></>}
          <code>.sort-choices {'{'} position: absolute; z-index: 9999 {'}'}</code></p>
        <SortMenu/>
      </li>
      <li className="old-way-card card rounded-corners floating forms-context">
        <p className="paragraph">Card two. <code>.forms-context {'{'} z-index: 1 {'}'}</code></p>
      </li>
    </ol>
    <figcaption className="caption"><strong>The trap.</strong> Open Sort by, then change the checkbox and open Sort by again.</figcaption>
  </figure>;
};
