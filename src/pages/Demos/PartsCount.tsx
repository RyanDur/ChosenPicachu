import {FC} from 'react';
import {useListedParts} from './useListedParts';
import {partsListed} from './parts-listed';

export const PartsCount: FC = () => {
  const groups = useListedParts();
  return <p className="parts-count paragraph field ink-underline">
    <span className="parts-count-in-full">{partsListed.counted(groups)}</span>
    <span className="parts-count-in-brief">{partsListed.countedBriefly(groups)}</span>
  </p>;
};
