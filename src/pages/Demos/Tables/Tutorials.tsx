import {FC, useId} from 'react';
import {Link} from 'react-router';
import {useSearchParamsObject} from '@navigation/search-params';
import {FeaturesAskedFor} from './Recipe';
import {Station} from '../Recipe';
import {tableTutorials} from './tutorial-pages';
import {TablePart, tableParts} from './part-pages';
import {WorldGlider, WorldNote} from './World';
import {DemoLink} from '@pages/Demos/DemoLink';
import {ReadingTime} from './ReadingTime';
import {TablesMap} from './TablesMap';
import {featuresHeading} from './features-heading';
import '../Tutorials.css';
import './Tutorials.css';

const PartEntry: FC<{part: TablePart}> = ({part}) => {
  const {name, says, minutes, ordinal} = tableParts.told(part);
  const {to, search} = tableParts.whereIs(ordinal);
  return <>
    <h3 className="phase-title title">
      <DemoLink to={to} search={search}>{name}</DemoLink>
    </h3>
    <p className="paragraph">{says}</p>
    <ReadingTime minutes={minutes}/>
  </>;
};

export const Tutorials: FC = () => {
  const {searchFromShown} = useSearchParamsObject({});
  const titled = `tutorials${useId()}`;
  return <section aria-labelledby={titled} className="tutorials">
    <header className="tutorials-header">
      <h2 id={titled} className="title">let’s build this feature</h2>
      <WorldGlider/>
    </header>
    <WorldNote/>
    <TablesMap/>
    <ol className="spine" aria-label="the stations">
      {tableParts.inOrder.map((part, index) =>
        <Station key={part} at={index + 1}>
          <PartEntry part={part}/>
        </Station>)}
      <Station at={tableParts.featuresStation}>
        <h3 className="phase-title title">{featuresHeading.title}</h3>
        <FeaturesAskedFor/>
        <p className="paragraph">
          Drag sort builds the first two features, moving a column and moving a row. Sort menu builds the third,
          ranking by a measure, and Drag resize builds the fourth, widening a column.
        </p>
        <ol className="tutorial-links" aria-label="the tutorials">
          {tableTutorials.all().map(tutorial => <li key={tutorial}>
            <Link className="tutorial-link signpost reachable" to={`${tableTutorials.addressOf(tutorial)}${searchFromShown({})}`}>{tableTutorials.nameOf(tutorial)}</Link>
            <ReadingTime minutes={tableTutorials.minutesOf(tutorial)}/>
          </li>)}
        </ol>
      </Station>
    </ol>
  </section>;
};
