import {FC} from 'react';
import {PartsNavigation} from '@pages/Demos/PartsNavigation';
import {PartsNavigationEntry} from '@pages/Demos/PartsNavigationEntry';
import {PartsNavigationGroup} from '@pages/Demos/PartsNavigationGroup';
import {TablePart, tableParts} from './part-pages';
import {Tutorial, tableTutorials} from './tutorial-pages';

type Told = {to: string; name: string; minutes: number; says: string};

const Entry: FC<Told> = ({to, name, minutes, says}) =>
  <PartsNavigationEntry to={to} name={name}>
    <time className="minutes caption muted-ink" dateTime={`PT${minutes}M`}>{`${minutes} min`}</time>
    <p className="says paragraph">{says}</p>
  </PartsNavigationEntry>;

const BuildEntry: FC<{part: TablePart}> = ({part}) => {
  const {name, minutes, says} = tableParts.told(part);
  return <Entry to={tableParts.addressOf(part)} name={name} minutes={minutes} says={says}/>;
};

const FeatureEntry: FC<{tutorial: Tutorial}> = ({tutorial}) =>
  <Entry to={tableTutorials.addressOf(tutorial)} name={tableTutorials.nameOf(tutorial)}
    minutes={tableTutorials.minutesOf(tutorial)} says={tableTutorials.saysOf(tutorial)}/>;

export const PartsIndex: FC = () =>
  <PartsNavigation>
    <PartsNavigationGroup label="Build the live table" start={1}>
      {tableParts.inOrder.map(part => <BuildEntry key={part} part={part}/>)}
    </PartsNavigationGroup>
    <PartsNavigationGroup label="Add what the trader asked for" start={tableParts.count + 1}>
      {tableTutorials.all().map(tutorial => <FeatureEntry key={tutorial} tutorial={tutorial}/>)}
    </PartsNavigationGroup>
  </PartsNavigation>;
