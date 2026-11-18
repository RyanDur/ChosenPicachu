import {FC} from 'react';
import {NavLink} from 'react-router';
import {useCarriedAddress} from '@pages/Demos/useCarriedAddress';
import {zIndexParts} from './part-pages';
import {ZIndexSize} from './ZIndexSize';
import './ZIndexMap.css';

const mapEntry = ({isActive}: {isActive: boolean}): string =>
  isActive ? 'map-entry reachable' : 'map-entry signpost reachable';

export const ZIndexMap: FC = () => {
  const carried = useCarriedAddress();
  return <nav aria-label="the z-index map">
    <ZIndexSize/>
    <ol className="paragraph">
      {zIndexParts.inOrder.map(part => <li key={part}>
        <NavLink className={mapEntry} to={carried(zIndexParts.addressOf(part))} end>
          {zIndexParts.numbered(part)}
        </NavLink>
      </li>)}
    </ol>
  </nav>;
};
