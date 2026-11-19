import {FC} from 'react';
import {PartsNav} from '@pages/Demos/PartsNav';
import {PartsNavEntry} from '@pages/Demos/PartsNavEntry';
import {ZIndexPart, zIndexParts} from './part-pages';

const Entry: FC<{part: ZIndexPart}> = ({part}) => {
  const {name, minutes, says} = zIndexParts.told(part);
  return <PartsNavEntry to={zIndexParts.addressOf(part)} title={name} minutes={minutes} says={says}/>;
};

export const PartsIndex: FC = () =>
  <PartsNav>
    <ol className="parts-index-list numbered">
      {zIndexParts.inOrder.map(part => <Entry key={part} part={part}/>)}
    </ol>
  </PartsNav>;
