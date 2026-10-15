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
  'z-index': 'layered',
  opacity: 'faded',
  transform: 'turned',
  isolation: 'isolated'
};

const whatItFormed: Record<Worn, string> = {
  nothing: 'The list opened over card two. Card one wears nothing and forms no stacking context, so its list’s 9999 is compared with card two’s 1.',
  position: 'The list opened over card two. Position alone forms no stacking context; a positioned element forms one only with a z-index other than auto.',
  outline: 'The list opened over card two. An outline is paint, and paint forms no stacking context.',
  'z-index': 'The list opened under card two. A z-index other than auto forms a stacking context on a positioned element, and on a flex or grid item too, which card one is; the 9999 counts only inside it.',
  opacity: 'The list opened under card two. An opacity below 1 forms a stacking context, so a card that fades traps what it holds.',
  transform: 'The list opened under card two. Any transform forms a stacking context, even one that moves nothing, so a card that slides in traps what it holds.',
  isolation: 'The list opened under card two. isolation: isolate forms a stacking context and changes nothing else; it exists to form one on purpose.'
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
    <fieldset className="wears borderless">
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
    <figcaption className="caption">The menu part’s two cards again, with card one wearing one thing at a time.</figcaption>
  </figure>;
};
