import {FC} from 'react';
import {useListedParts} from './useListedParts';
import {partsListed} from './parts-listed';

export const PartsCount: FC = () => {
  const groups = useListedParts();
  const full = partsListed.counted(groups);
  const brief = partsListed.countedBriefly(groups);
  return <p className="parts-count paragraph field ink-underline unbroken">
    <span className="parts-count-in-full">{full}</span> <span className="parts-count-in-brief">{brief}</span>
  </p>;
};
