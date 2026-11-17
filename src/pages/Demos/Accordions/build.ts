import {FC} from 'react';
import {Line} from '../Recipe';
import {AccordionProps} from './accordion-props';

export type Build = {
  readonly Accordion: FC<AccordionProps>;
  readonly sample: Line[];
};
