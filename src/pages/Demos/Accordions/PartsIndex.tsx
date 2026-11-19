import {FC} from 'react';
import {PartsNav} from '@pages/Demos/PartsNav';
import {PartsNavEntry} from '@pages/Demos/PartsNavEntry';
import {BookPart, accordionParts} from './part-pages';
import './PartsIndex.css';

const ordinalOf = (heading: BookPart): number => accordionParts.inOrder.indexOf(heading) + 1;

const Entry: FC<{heading: BookPart}> = ({heading}) => {
  const {to, heading: fragment, title, minutes, says} = accordionParts.listed(heading);
  return <PartsNavEntry to={to} heading={fragment} title={title} minutes={minutes} says={says}/>;
};

const Era: FC<{label: string; headings: readonly BookPart[]}> = ({label, headings}) => <>
  <p id={`${headings[0]}-era`} className="era-label caption uppercase muted-ink">{label}</p>
  <ol aria-labelledby={`${headings[0]}-era`} className="parts-index-list numbered" start={ordinalOf(headings[0])}>
    {headings.map(heading => <Entry key={heading} heading={heading}/>)}
  </ol>
</>;

export const PartsIndex: FC = () =>
  <PartsNav>
    <ol className="parts-index-list numbered">
      <Entry heading="html-alone-heading"/>
    </ol>
    <Era label="How we used to build a fold"
      headings={['remembers-heading', 'max-height-guess-heading', 'measured-heading']}/>
    <Era label="What the platform gives now" headings={['platform-way-heading', 'motion-heading']}/>
  </PartsNav>;
