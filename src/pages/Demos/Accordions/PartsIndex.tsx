import {FC} from 'react';
import {DemoLink} from '@pages/Demos/DemoLink';
import {BookPart, accordionParts} from './part-pages';
import './PartsIndex.css';

const ordinalOf = (heading: BookPart): number => accordionParts.inOrder.indexOf(heading) + 1;

const Entry: FC<{heading: BookPart}> = ({heading}) => {
  const {to, heading: fragment, title, minutes, says} = accordionParts.listed(heading);
  return <li className="parts-index-entry muted-rule-below">
    <DemoLink className="parts-index-link" to={to} heading={fragment}>{title}</DemoLink>
    <time className="minutes caption muted-ink" dateTime={`PT${minutes}M`}>{`${minutes} min`}</time>
    <p className="says paragraph">{says}</p>
  </li>;
};

const Era: FC<{label: string; headings: readonly BookPart[]}> = ({label, headings}) => <>
  <p id={`${headings[0]}-era`} className="era-label caption uppercase muted-ink">{label}</p>
  <ol aria-labelledby={`${headings[0]}-era`} className="parts-index-list numbered" start={ordinalOf(headings[0])}>
    {headings.map(heading => <Entry key={heading} heading={heading}/>)}
  </ol>
</>;

export const PartsIndex: FC = () =>
  <nav aria-labelledby="parts-index-heading" className="parts-index">
    <h2 id="parts-index-heading" className="off-screen">Parts</h2>
    <ol className="parts-index-list numbered">
      <Entry heading="html-alone-heading"/>
    </ol>
    <Era label="How we used to build a fold"
      headings={['remembers-heading', 'max-height-guess-heading', 'measured-heading']}/>
    <Era label="What the platform gives now" headings={['platform-way-heading', 'motion-heading']}/>
  </nav>;
