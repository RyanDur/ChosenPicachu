import {FC, useState} from 'react';
import {useHydrated} from '@components';
import {Maybe, nothing, some, not} from '@ryandur/sand';
import {classNames} from '@components';
import {SortMenu} from './SortMenu';
import {useControls} from '../Controls';
import {inOrder, Worn} from '../ReaderSettings';
import {Exhibit, ExhibitFoot} from '../Exhibit';

const property: Record<Worn, string> = {
  nothing: 'nothing',
  position: 'position: relative',
  outline: 'outline',
  'z-index': 'z-index: 1',
  opacity: 'opacity: 0.9',
  transform: 'transform: rotate(-1deg)',
  isolation: 'isolation: isolate'
};

const wornAs: Partial<Record<Worn, string>> = {
  position: 'positioned',
  outline: 'outlined',
  'z-index': 'forms-context',
  opacity: 'faded',
  transform: 'turned',
  isolation: 'isolated'
};

const whatItFormed: Record<Worn, string> = {
  nothing: 'The list opened over card two. Card one wears nothing, so it forms no stacking context.',
  position: 'The list opened over card two. position: relative alone forms no stacking context.',
  outline: 'The list opened over card two. An outline forms no stacking context.',
  'z-index': 'The list opened under card two. z-index: 1 formed a stacking context, so the 9999 counts only inside card one.',
  opacity: 'The list opened under card two. opacity: 0.9 formed a stacking context.',
  transform: 'The list opened under card two. The transform formed a stacking context.',
  isolation: 'The list opened under card two. isolation: isolate formed a stacking context.'
};

export const ContextChooser: FC = () => {
  const {wears: worn, change} = useControls();
  const hydrated = useHydrated();
  const [opened, updateOpened] = useState<Maybe<Worn>>(nothing());
  const openedAsWorn = opened.mBind(wearing => wearing === worn ? some(wearing) : nothing());

  return <Exhibit name="What card one wears">
    <fieldset className="wears veiled-rule-below">
      <legend className="paragraph">What card one wears</legend>
      {inOrder.worn.map(choice =>
        <label key={choice} className="context-choice reachable">
          <input type="radio" name="card-one-wears" checked={worn === choice} disabled={not(hydrated)}
            onChange={() => {
              updateOpened(nothing());
              change({wears: choice});
            }}/>
          {choice === 'nothing' ? property[choice] : <code className="monospaced">{property[choice]}</code>}
        </label>)}
    </fieldset>
    <ol className="trap-steps field">
      <li className="paragraph">Choose what card one wears.</li>
      <li className="paragraph">Press Sort by, and look where its list opens.</li>
      <li className="paragraph">Choose another, and press Sort by again.</li>
    </ol>
    <figure className="context-chooser field">
      <ol className="old-way-cards">
        <li className={classNames('old-way-card drawn-piece', wornAs[worn])}>
          <p className="paragraph">Its list has z-index: 9999.</p>
          <SortMenu onOpened={() => updateOpened(some(worn))}/>
        </li>
        <li className="old-way-card drawn-piece positioned forms-context">
          <p className="paragraph">Card two has z-index: 1, and comes later in the code.</p>
        </li>
      </ol>
      <output aria-label="what card one formed" className="paragraph">{openedAsWorn.map(wearing => whatItFormed[wearing]).orElse('')}</output>
    </figure>
    <ExhibitFoot lead="What card one wears.">Start with nothing, then give card one a property and see where its list
      opens.</ExhibitFoot>
  </Exhibit>;
};
