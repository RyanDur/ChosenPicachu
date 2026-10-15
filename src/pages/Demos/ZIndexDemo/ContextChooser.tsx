import {FC, useState} from 'react';
import {Maybe, nothing, some} from '@ryandur/sand';
import {classNames} from '@components/class-names';
import {SortMenu} from './SortMenu';
import {Worn} from './worn';

const inOrder: readonly Worn[] = ['nothing', 'position', 'outline', 'z-index', 'opacity', 'transform', 'isolation'];

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

type Props = {
  worn: Worn;
  onWornChosen: (worn: Worn) => void;
};

export const ContextChooser: FC<Props> = ({worn, onWornChosen}) => {
  const [opened, updateOpened] = useState<Maybe<Worn>>(nothing());
  const openedAsWorn = opened.mBind(wearing => wearing === worn ? some(wearing) : nothing());

  return <figure className="context-chooser card rounded-corners lifted padded">
    <ol className="trap-steps">
      <li className="paragraph">Choose what card one wears.</li>
      <li className="paragraph">Press Sort by, built the old way, and look where its list opens.</li>
      <li className="paragraph">Choose another, and press Sort by again.</li>
    </ol>
    <fieldset className="wears">
      <legend className="paragraph">What card one wears</legend>
      {inOrder.map(choice =>
        <label key={choice} className="context-choice reachable">
          <input type="radio" name="card-one-wears" checked={worn === choice}
            onChange={() => {
              updateOpened(nothing());
              onWornChosen(choice);
            }}/>
          {choice === 'nothing' ? property[choice] : <code>{property[choice]}</code>}
        </label>)}
    </fieldset>
    <ol className="old-way-cards">
      <li className={classNames('old-way-card card rounded-corners floating', wornAs[worn])}>
        <p className="paragraph">Its list has z-index: 9999.</p>
        <div className="menu-anchor"><SortMenu onOpened={() => updateOpened(some(worn))}/></div>
      </li>
      <li className="old-way-card card rounded-corners floating positioned forms-context">
        <p className="paragraph">Card two has z-index: 1, and comes later in the code.</p>
      </li>
    </ol>
    <output aria-label="what card one formed" className="paragraph">{openedAsWorn.map(wearing => whatItFormed[wearing]).orElse('')}</output>
    <figcaption className="caption">What card one wears decides whether its list’s 9999 counts in the tab’s panel, against card two, or only inside the card.</figcaption>
  </figure>;
};
