import {FC} from 'react';
import {Quotation} from '@components/Quotation';
import {FromTheRecord} from './FromTheRecord';
import {HowIOrganizeIt} from './HowIOrganizeIt';
import {DynamicInteractionPractice} from '@pages/Development/DynamicInteractionPractice';
import {ConcernSection} from './ConcernSection';

export const DynamicInteraction: FC = () =>
  <ConcernSection concern="Dynamic Interaction">
    <Quotation voice="paragraph" source={<a className="signpost" href="https://www.computerworld.com/article/3458282/the-a-z-of-programming-languages-javascript.html">Brendan Eich, in Computerworld’s A-Z of Programming Languages</a>}>
      With a scripting language like JS that could touch elements of the page, change
      their properties, and respond to events, we envisioned a much livelier Web
      consisting of pages that acted more like applications.
    </Quotation>
    <p className="paragraph">
      JavaScript says how things respond. The state is what is true right now, an event is what just happened, and the
      page is drawn from the two.
    </p>
    <FromTheRecord/>
    <HowIOrganizeIt><DynamicInteractionPractice/></HowIOrganizeIt>
  </ConcernSection>;
