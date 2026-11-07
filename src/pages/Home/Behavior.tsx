import {FC} from 'react';
import {Quotation} from '@components/Quotation';
import {ConcernSection} from './ConcernSection';

export const Behavior: FC = () =>
  <ConcernSection concern="Behavior">
    <Quotation voice="paragraph" source={<a className="signpost"
      href="https://web.archive.org/web/20191215100745/https://www.computerworld.com/article/3458282/the-a-z-of-programming-languages-javascript.html">Brendan
      Eich, in Computerworld’s A-Z of Programming Languages</a>}>
      With a scripting language like JS that could touch elements of the page, change
      their properties, and respond to events, we envisioned a much livelier Web
      consisting of pages that acted more like applications.
    </Quotation>
    <p className="paragraph">JavaScript says how things respond. It does what no element and no rule can, and adds
      only what the platform lacks.</p>
  </ConcernSection>;
