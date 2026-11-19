import {FC} from 'react';
import {DemoLink} from '@pages/Demos/DemoLink';
import {BookPart, accordionParts} from './part-pages';
import './Contents.css';

const ordinalOf = (heading: BookPart): number => accordionParts.inOrder.indexOf(heading) + 1;

const Entry: FC<{heading: BookPart}> = ({heading}) => {
  const {to, heading: fragment, title, minutes, says} = accordionParts.listed(heading);
  return <li className="contents-entry muted-rule-below">
    <DemoLink className="contents-link" to={to} heading={fragment}>{title}</DemoLink>
    <time className="minutes caption muted-ink" dateTime={`PT${minutes}M`}>{`${minutes} min`}</time>
    <p className="says paragraph">{says}</p>
  </li>;
};

const Group: FC<{label: string; headings: readonly BookPart[]}> = ({label, headings}) => <>
  <p id={`${headings[0]}-group`} className="group-label caption uppercase muted-ink">{label}</p>
  <ol aria-labelledby={`${headings[0]}-group`} className="contents-list numbered" start={ordinalOf(headings[0])}>
    {headings.map(heading => <Entry key={heading} heading={heading}/>)}
  </ol>
</>;

export const Contents: FC = () =>
  <nav aria-labelledby="contents-heading" className="contents">
    <h2 id="contents-heading" className="off-screen">Parts</h2>
    <ol className="contents-list numbered">
      <Entry heading="html-alone-heading"/>
    </ol>
    <Group label="How we used to build a fold"
      headings={['remembers-heading', 'max-height-guess-heading', 'measured-heading']}/>
    <Group label="What the platform gives now" headings={['platform-way-heading', 'motion-heading']}/>
  </nav>;
