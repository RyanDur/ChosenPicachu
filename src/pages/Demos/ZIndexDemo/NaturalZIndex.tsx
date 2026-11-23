import {FC, useState} from 'react';
import {not} from '@ryandur/sand';
import {PillGlider} from '@components/PillGlider';
import {classNames, useHydrated} from '@components';
import {useControls} from '../Controls';
import {inOrder, RaisedCard} from '../ReaderSettings';
import {Exhibit, ExhibitFoot} from '../Exhibit';
import './ZIndexDemo.css';

const words: Record<RaisedCard, string> = {none: 'None', first: 'First', second: 'Second', third: 'Third'};
const cardsToRaise = inOrder.raisedCards.map(value => ({words: words[value], value}));

export const NaturalZIndex: FC = () => {
  const {raised, change} = useControls();
  const [isCollapsed, updateCollapsed] = useState(true);
  const hydrated = useHydrated();
  const togglePile = () => updateCollapsed(not(isCollapsed));
  const pileCardClasses = (card: RaisedCard) => classNames('pile-card card rounded-corners floating', isCollapsed && 'closed', raised === card && 'raised');

  return <Exhibit name="The pile">
    <figure className="natural-z-index field">
      <button type="button" className="button primary" aria-expanded={not(isCollapsed)} aria-controls="z-index-pile"
        disabled={not(hydrated)} onClick={togglePile}>{isCollapsed ? 'Expand' : 'Collapse'}</button>
      <PillGlider label="card raised" name="card-raised" choices={cardsToRaise} chosen={raised} onChosen={next => change({raised: next})}/>
      <ol id="z-index-pile" className="demo-container">
        <li className={pileCardClasses('first')}>First</li>
        <li className={pileCardClasses('second')}>Second</li>
        <li className={pileCardClasses('third')}>Third</li>
      </ol>
    </figure>
    <ExhibitFoot lead="Three cards.">Raise a card over the others with the pills above it.</ExhibitFoot>
  </Exhibit>;
};
