import {FC, PropsWithChildren, useId, useState} from 'react';
import {not} from '@ryandur/sand';
import {classNames, useHydrated} from '@components';
import {useControls} from './Controls';
import {PartsCount} from './PartsCount';
import {PartsIndex} from './PartsIndex';
import {PartsList} from './PartsList';
import './PartsBeside.css';

export const PartsBeside: FC<PropsWithChildren> = ({children}) => {
  const listId = `parts${useId()}`;
  const {parts, change} = useControls();
  const shown = parts === 'shown';
  const hydrated = useHydrated();
  const [movedByHand, moveByHand] = useState(false);
  const fold = (): void => {
    moveByHand(true);
    change({parts: shown ? 'hidden' : 'shown'});
  };
  return <>
    <header className={classNames('parts-head', not(shown) && 'parts-away', movedByHand && 'moved-by-hand')}>
      <PartsCount/>
      {/* Safari's plain Tab skips a button with no tabindex written, as the Tables part on focus teaches. */}
      <button type="button" tabIndex={0}
        className="parts-fold caption attentive field hairline-outline reachable smoked-while-disabled"
        disabled={not(hydrated)}
        aria-expanded={shown}
        aria-controls={listId}
        onClick={fold}>{shown ? 'Hide parts' : 'Show parts'}</button>
    </header>
    <nav aria-label="Parts" className="parts-panel">
      <PartsIndex id={listId}><PartsList/></PartsIndex>
    </nav>
    <section className="beside-the-parts">{children}</section>
  </>;
};
