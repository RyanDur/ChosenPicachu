import {FC} from 'react';
import {PageFoot} from '@pages/Demos/PageFoot';
import {useCarriedAddress} from '@pages/Demos/useCarriedAddress';
import {ZIndexPart, zIndexParts} from './part-pages';

export const PartFoot: FC<{part: ZIndexPart}> = ({part}) => {
  const carried = useCarriedAddress();
  const neighbor = (beside: ZIndexPart) => ({
    title: zIndexParts.numbered(beside),
    address: carried(zIndexParts.addressOf(beside))
  });
  return <PageFoot label="the z-index parts"
    previous={zIndexParts.previousOf(part).map(neighbor)}
    next={zIndexParts.nextOf(part).map(neighbor)}/>;
};
