import {FC, useId} from 'react';
import {useSearchParamsObject} from '@components/search-params';
import {tutorialParam, World, worldParam} from './params';
import {PillGlider} from '@components/PillGlider';
import {TableControls} from './TableControls';
import {Picks} from './Picks';
import {Recipe} from './Recipe';
import {LayerMap} from './Recipe/LayerMap';
import {DialNote, Exercise, Station} from '../Recipe';
import {useArrival} from '@components/OpeningFragment';
import {StoryClues} from './Recipe/StoryClues';
import {DesignAsk} from './Recipe/DesignAsk';
import {StorySlices} from './Recipe/StorySlices';
import {FlowTableRecipe, StillTableRecipe} from './Recipe/LivingTableRecipe';
import {MenuRecipe} from './Recipe/MenuRecipe';
import {ResizeRecipe} from './Recipe/ResizeRecipe';
import '../Tutorials.css';

const worldCopy: Record<World, string> = {
  react: 'React builds and rebuilds this table; the page you read is its render.',
  vanilla: 'The table stands in its own document: markup, style sheet, and script, no framework.'
};

export const Tutorials: FC = () => {
  const {tut: shown = 'sort', world = 'react', updateSearchParams} = useSearchParamsObject({tut: tutorialParam, world: worldParam});
  useArrival();
  const titled = `tutorials${useId()}`;
  return <section aria-labelledby={titled} className="tutorials">
    <header className="tutorials-header">
      <h2 id={titled} className="title">let’s build this feature</h2>
      <PillGlider label="world"
        name="table-world"
        options={[
          {display: 'React', value: 'react'},
          {display: 'Vanilla', value: 'vanilla'}
        ]}
        chosen={world}
        onChosen={next => updateSearchParams({world: next})}/>
    </header>
    <p className="paragraph">{worldCopy[world]}</p>
    <ol className="spine" aria-label="the stations">
      <Station at={1}>
        <StoryClues/>
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
      <Station at={5}>
        <FlowTableRecipe/>
      </Station>
      <Station at={6}>
        <h3 className="phase-title title">Layer on functionality, in the order it was asked for</h3>
        <LayerMap/>
        <Picks label="tutorials"
          className="tutorial-picks"
          options={[
            {display: 'Drag sort', value: 'sort'},
            {display: 'Sort menu', value: 'menu'},
            {display: 'Drag resize', value: 'resize'}
          ]}
          chosen={shown}
          onPicked={next => updateSearchParams({tut: next})}/>
        {shown === 'sort' && <DialNote reads="table"/>}
        {shown === 'sort' && <TableControls world={world}/>}
        {shown === 'sort' && <Recipe/>}
        {shown === 'menu' && <MenuRecipe/>}
        {shown === 'resize' && <ResizeRecipe/>}
      </Station>
    </ol>
  </section>;
};
