import {FC} from 'react';
import {PageFoot} from '@pages/Demos/PageFoot';
import {useCarriedAddress} from '@pages/Demos/useCarriedAddress';
import {PartPlace} from './part-pages';
import {BookPart, tablesBook} from './tables-book';

export const PartFoot: FC<{part: BookPart}> = ({part}) => {
  const carried = useCarriedAddress();
  const neighbor = ({title, to, heading, search}: PartPlace) => ({title, address: carried(to, heading, search)});
  return <PageFoot label="the tables parts"
    previous={tablesBook.previousOf(part).map(neighbor)}
    next={tablesBook.nextOf(part).map(neighbor)}/>;
};
