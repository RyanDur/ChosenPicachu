import {FC} from 'react';
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

export const TrappedMenu: FC<Props> = ({cardOne, onCardOne}) =>
  <figure className="trapped-menu card rounded-corners lifted padded">
    <label className="context-choice">
      <input type="checkbox" checked={cardOne === 'contained'} onChange={({currentTarget}) => onCardOne(currentTarget.checked ? 'contained' : 'free')}/>
      Card one has z-index: 1
    </label>
    <output aria-label="what card one does" className="paragraph">{says[cardOne]}</output>
    <ol className="old-way-cards">
      <li className={classNames('old-way-card card rounded-corners floating', cardOne === 'contained' && 'forms-context')}>
        <p className="paragraph"><code>.card {'{'} position: relative; z-index: {cardOne === 'contained' ? 1 : 'auto'} {'}'}</code><br/>
          <code>.list {'{'} position: absolute; z-index: 9999 {'}'}</code></p>
        <SortMenu/>
      </li>
      <li className="old-way-card card rounded-corners floating forms-context">
        <p className="paragraph">Card two. <code>z-index: 1</code></p>
      </li>
    </ol>
    <figcaption className="caption"><strong>The trap.</strong> Open Sort by, then change the checkbox and open Sort by again.</figcaption>
  </figure>;
