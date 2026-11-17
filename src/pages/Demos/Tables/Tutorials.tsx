import {FC, useId} from 'react';
import {Link} from 'react-router';
import {useSearchParamsObject} from '@navigation/search-params';
import {DesignAsk, FlowTableRecipe, FeaturesAskedFor, StillTableRecipe, StorySlices} from './Recipe';
import {Exercise, Station} from '../Recipe';
import {tableTutorials} from './tutorial-pages';
import {TablePart, tableParts} from './part-pages';
import {WorldGlider, WorldNote} from './World';
import {DemoLink} from '@pages/Demos/DemoLink';
import '../Tutorials.css';
import './Tutorials.css';

const PartEntry: FC<{part: TablePart}> = ({part}) => {
  const {name, says, minutes} = tableParts.told(part);
  return <>
    <h3 className="phase-title title">
      <DemoLink to={tableParts.addressOf(part)}>{name}</DemoLink>
    </h3>
    <p className="paragraph">{says}</p>
    <p className="caption muted-ink"><time dateTime={`PT${minutes}M`}>{`${minutes} minutes to read`}</time></p>
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
    <ol className="spine" aria-label="the stations">
      <Station at={1}>
        <PartEntry part="the-need-and-its-clues"/>
      </Station>
      <Station at={2}>
        <DesignAsk/>
      </Station>
      <Station at={3}>
        <StorySlices/>
        <Exercise/>
      </Station>
      <Station at={4}>
        <StillTableRecipe/>
      </Station>
      <Station at={tableTutorials.startingStation}>
        <FlowTableRecipe/>
      </Station>
      <Station at={6}>
        <h3 className="phase-title title">Add features, in the order they were asked for</h3>
        <FeaturesAskedFor/>
        <p className="paragraph">
          Drag sort builds the first two features, moving a column and moving a row. Sort menu builds the third,
          ranking by a measure, and Drag resize builds the fourth, widening a column.
        </p>
        <ol className="tutorial-links" aria-label="the tutorials">
          {tableTutorials.all().map(tutorial => <li key={tutorial}>
            <Link className="tutorial-link signpost reachable" to={`${tableTutorials.addressOf(tutorial)}${searchFromShown({})}`}>{tableTutorials.nameOf(tutorial)}</Link>
          </li>)}
        </ol>
      </Station>
    </ol>
  </section>;
};
