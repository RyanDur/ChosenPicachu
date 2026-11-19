import {FC} from 'react';
import {PartsNavigation} from '@pages/Demos/PartsNavigation';
import {PartsNavigationEntry} from '@pages/Demos/PartsNavigationEntry';
import {ChartKind, chartKinds} from './chart-kinds';

const Entry: FC<{kind: ChartKind}> = ({kind}) => {
  const {minutes, says} = chartKinds.told[kind];
  return <PartsNavigationEntry to={chartKinds.address(kind)} name={chartKinds.names[kind]}>
    <time className="minutes caption muted-ink" dateTime={`PT${minutes}M`}>{`${minutes} min`}</time>
    <p className="says paragraph">{says}</p>
  </PartsNavigationEntry>;
};

export const PartsIndex: FC = () =>
  <PartsNavigation>
    <ol className="parts-index-list numbered">
      {chartKinds.all.map(kind => <Entry key={kind} kind={kind}/>)}
    </ol>
  </PartsNavigation>;
