import {FC} from 'react';
import {demoTab, DemoTopics} from '@pages/Demos';
import {PageFoot} from '@pages/Demos/PageFoot';
import {useCarriedAddress} from '@pages/Demos/useCarriedAddress';
import {BookPart, ZIndexPart, zIndexParts} from './part-pages';

export const PartFoot: FC<{part: ZIndexPart}> = ({part}) => {
  const carried = useCarriedAddress();
  const neighbor = (book: BookPart) => ({
    numbered: zIndexParts.numbered(book),
    address: carried(demoTab.address(DemoTopics.zIndex), zIndexParts.tabHeadingOf(book))
  });
  return <PageFoot label="the z-index parts"
    previous={zIndexParts.previousOf(part).map(neighbor)}
    next={zIndexParts.nextOf(part).map(neighbor)}/>;
};
