import {FC} from 'react';
import {AccordionsExplained} from './Explained';
import {PartPage} from './PartPage';
import {useShownPart} from './useShownPart';

export const Room: FC = () => useShownPart().either(
  part => <PartPage part={part}/>,
  () => <AccordionsExplained/>);
