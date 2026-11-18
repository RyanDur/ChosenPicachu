import {FoldType} from '../ReaderSettings';
import {carve} from '../Recipe';
import {Build} from './build';
import {ExclusiveToggleAccordion} from './ExclusiveToggleAccordion';
import {InclusiveToggleAccordion} from './InclusiveToggleAccordion';
import exclusiveToggleAccordionSource from './ExclusiveToggleAccordion.tsx?sample';
import inclusiveToggleAccordionSource from './InclusiveToggleAccordion.tsx?sample';

export const platformBuilds: Record<FoldType, Build> = {
  inclusive: {
    Accordion: InclusiveToggleAccordion,
    sample: carve.between(inclusiveToggleAccordionSource, '<details className="fold">', '</details>')
  },
  exclusive: {
    Accordion: ExclusiveToggleAccordion,
    sample: carve.between(exclusiveToggleAccordionSource, '<details className="fold" name=', '</details>')
  }
};
