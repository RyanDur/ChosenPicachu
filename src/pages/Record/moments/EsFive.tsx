import {FC} from 'react';
import {Moment} from './Moment';
import {moments} from './moments';

export const EsFive: FC = () =>
  <Moment of={moments.esFive}
    tells={<>Ten years after the third edition, the language’s standard moved. The fourth edition, ambitious with classes and
      types, was abandoned in 2008. The fifth, published on 3 December 2009, was the smaller step: strict mode, JSON,
      accessor properties. From 2015 the editions have come every June.</>}>
    <p className="paragraph muted-ink hyphenated">The fourth edition does not exist. Ecma’s list says so in those words: <a className="signpost" href="https://ecma-international.org/publications-and-standards/standards/ecma-262/">“Therefore "ECMA-262 Edition 4" as an Ecma International publication does not exist”</a>.
      The fifth edition’s own introduction records the work <a className="signpost" href="https://262.ecma-international.org/5.1/">“was not completed and not published as the fourth edition of ECMAScript”</a>.
      The reason was a split over how much to add: <a className="signpost" href="https://en.wikipedia.org/wiki/ECMAScript_version_history">“The 4th edition was abandoned due to political differences concerning language complexity”</a>,
      and <a className="signpost" href="https://en.wikipedia.org/wiki/ECMAScript_version_history">“By August 2008, the ECMAScript 4th edition proposal had been scaled back into a project code named ECMAScript Harmony”</a>,
      with the committee’s effort going to <a className="signpost" href="https://en.wikipedia.org/wiki/ECMAScript_version_history">“the ECMAScript 3.1 (later renamed to ECMAScript, 5th Edition) project”</a>.</p>
    <p className="paragraph muted-ink hyphenated">The fifth edition was modest and useful. <a className="signpost" href="https://en.wikipedia.org/wiki/ECMAScript_version_history">“On 3 December 2009, ECMA-262 5th edition was published”</a>.
      It added <a className="signpost" href="https://262.ecma-international.org/5.1/">“accessor properties, reflective creation and inspection of objects”</a>, <a className="signpost" href="https://262.ecma-international.org/5.1/">“support for the JSON object encoding format”</a> and <a className="signpost" href="https://262.ecma-international.org/5.1/">“a strict mode that provides enhanced error checking and program security”</a>.
      An accessor property is a property that runs a function when read or written; JSON is a format for sending
      objects as text; strict mode is a stricter dialect a script opts into with one line.</p>
    <p className="paragraph muted-ink hyphenated">What changed after was the pace. Ecma’s list runs <a className="signpost" href="https://ecma-international.org/publications-and-standards/standards/ecma-262/">6th edition, June 2015</a>,
      and then one edition every June since. A standard that had stalled for ten years over one large change became
      one that ships a small one every year.</p>
  </Moment>;
