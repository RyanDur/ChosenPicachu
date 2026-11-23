import {FC} from 'react';
import {useListedParts} from './useListedParts';
import {partsListed} from './parts-listed';

export const PartsCount: FC = () =>
  <p className="parts-count paragraph field ink-underline">{partsListed.counted(useListedParts())}</p>;
