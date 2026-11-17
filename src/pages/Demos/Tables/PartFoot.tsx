import {FC} from 'react';
import {PageFoot} from '@pages/Demos/PageFoot';
import {useCarriedAddress} from '@pages/Demos/useCarriedAddress';
import {PartPlace} from './part-pages';
import {tablesBook} from './tables-book';

export const PartFoot: FC<{address: string}> = ({address}) => {
  const carried = useCarriedAddress();
  const neighbor = ({title, to, heading, search}: PartPlace) => ({title, address: carried(to, heading, search)});
  return <PageFoot label="the tables parts"
    previous={tablesBook.previousOf(address).map(neighbor)}
    next={tablesBook.nextOf(address).map(neighbor)}/>;
};
