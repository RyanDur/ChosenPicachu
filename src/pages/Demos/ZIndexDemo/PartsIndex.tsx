import {FC} from 'react';
import {PartsNavigation} from '@pages/Demos/PartsNavigation';
import {PartsNavigationEntry} from '@pages/Demos/PartsNavigationEntry';
import {ZIndexPart, zIndexParts} from './part-pages';

const Entry: FC<{part: ZIndexPart}> = ({part}) => {
  const {name, minutes, says} = zIndexParts.told(part);
  return <PartsNavigationEntry to={zIndexParts.addressOf(part)} name={name} minutes={minutes} says={says}/>;
};

export const PartsIndex: FC<{readonly level: 2 | 3}> = ({level}) =>
  <PartsNavigation level={level}>
    <ol className="parts-index-list numbered">
      {zIndexParts.inOrder.map(part => <Entry key={part} part={part}/>)}
    </ol>
  </PartsNavigation>;
