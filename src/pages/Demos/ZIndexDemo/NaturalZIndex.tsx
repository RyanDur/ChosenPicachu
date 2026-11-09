import {FC, useState} from 'react';
import {not} from '@ryandur/sand';
import {PillGlider} from '@components/PillGlider';
import {PropsWithClassName} from '../props-with-class-name';
import {classNames} from '@components';
import {useSearchParamsObject} from '@navigation/search-params';
import {RaisedCard, raisedParam} from './raised';
import './ZIndexDemo.css';

const cardsToRaise = [
  {words: 'None', value: 'none'},
  {words: 'First', value: 'first'},
  {words: 'Second', value: 'second'},
  {words: 'Third', value: 'third'}
] as const;

export const NaturalZIndex: FC<PropsWithClassName> = ({className}) => {
  const {raised, updateSearchParams} = useSearchParamsObject({raised: raisedParam}, {raised: 'none'});
  const [isCollapsed, updateCollapsed] = useState(true);
  const onClick = () => updateCollapsed(not(isCollapsed));
  const pileCard = (card: RaisedCard) => classNames('pile-card card rounded-corners floating', isCollapsed && 'closed', raised === card && 'raised');

  return <figure className={classNames('natural-z-index', className)}>
    <button type="button" className="button primary" aria-expanded={not(isCollapsed)} aria-controls="z-index-pile"
      onClick={onClick}>{isCollapsed ? 'Expand' : 'Collapse'}</button>
    <PillGlider label="card raised" name="card-raised" choices={cardsToRaise} chosen={raised} onChosen={next => updateSearchParams({raised: next})}/>
    <ol id="z-index-pile" className="demo-container">
      <li className={pileCard('first')}>First</li>
      <li className={pileCard('second')}>Second</li>
      <li className={pileCard('third')}>Third</li>
    </ol>
    <figcaption className="caption"><strong className="bold">The pile.</strong> Raise a card over the others with the
      pills above it.</figcaption>
  </figure>;
};
