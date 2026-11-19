import {FC} from 'react';
import {PartsNavigation} from '@pages/Demos/PartsNavigation';
import {PartsNavigationEntry} from '@pages/Demos/PartsNavigationEntry';
import {ZIndexPart, zIndexParts} from './part-pages';

const Entry: FC<{part: ZIndexPart}> = ({part}) => {
  const {name, minutes, says} = zIndexParts.told(part);
  return <PartsNavigationEntry to={zIndexParts.addressOf(part)} name={name}>
    <time className="minutes caption muted-ink" dateTime={`PT${minutes}M`}>{`${minutes} min`}</time>
    <p className="says paragraph">{says}</p>
  </PartsNavigationEntry>;
};

export const PartsIndex: FC = () =>
  <PartsNavigation>
    <ol className="parts-index-list numbered">
      {zIndexParts.inOrder.map(part => <Entry key={part} part={part}/>)}
    </ol>
  </PartsNavigation>;
