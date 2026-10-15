import {useState} from 'react';
import {randParagraph, wordDeck} from '@components/fibs';
import {useSearchParamsObject} from '@components/search-params';
import './DemosPage.css';
import './Tutorials.css';
import {Tabs} from '@components/Tabs';
import {
  EagerHideAnimatedList,
  EagerHideStaticList,
  EagerKeepAnimatedList,
  EagerKeepStaticList,
  LazyHideAnimatedList,
  LazyHideStaticList,
  LazyKeepAnimatedList,
  LazyKeepStaticList
} from './DragAndDrop';
import {demoTopicParam, DemoTopics} from './types';
import {BannerExplained, cardOneParam, FormsContextExplained, MenuExplained, PopoverExplained, raisedParam, StackingExplained, wornParam} from './ZIndexDemo';
import {Tutorials} from './Tables/Tutorials';
import {ListTutorials} from './DragAndDrop/Tutorials';
import {ChartsTutorial} from './Charts/Tutorial';
import {TopLayerTutorial} from './ZIndexDemo/Tutorial';
import {ZIndexIntroduction} from './ZIndexDemo/Introduction';
import {AccordionsExplained, foldMotionParam, foldTypeParam} from './Accordions';
import {motionParam, originParam, paceParam} from './Controls';
import {Aggregations, trackParam, tutorialParam, worldParam} from './Tables';
import {Workspace} from './Charts/Workspace';
import {ChartsIntroduction} from './Charts/Introduction';
import {DragSortIntroduction} from './DragAndDrop/Introduction';
import {TablesIntroduction} from './Tables/Introduction';
import {useEnv} from '@components/Env';

const paragraphs = (count: number, dealt: () => string) => Array.from({length: count}, () => ({
  key: dealt(),
  value: Array.from({length: Math.floor(Math.random() * 6) + 1}, () => randParagraph()).join(' ')
}));

const topics = [
  {display: 'Accordions', param: DemoTopics.accordions},
  {display: 'Z-index', param: DemoTopics.zIndex},
  {display: 'Drag sort', param: DemoTopics.dragAndDrop},
  {display: 'Charts', param: DemoTopics.charts},
  {display: 'Tables', param: DemoTopics.tables}
];

export const DemosPage = () => {
  const {tab, pace = 'eager', origin = 'hide', motion = 'animated', tut = 'sort', track = 'pointer', world = 'react', type = 'inclusive', style: foldMotion = 'reveal', raised = 'none', 'card-one': cardOne = 'contained', wears = 'nothing', updateSearchParams} =
    useSearchParamsObject(
      {tab: demoTopicParam, pace: paceParam, origin: originParam, motion: motionParam, tut: tutorialParam, track: trackParam, world: worldParam, type: foldTypeParam, style: foldMotionParam, raised: raisedParam, 'card-one': cardOneParam, wears: wornParam},
      {tab: DemoTopics.accordions});
  const [accordionContents] = useState(() => {
    const dealt = wordDeck();
    return {
      measuredCheckbox: paragraphs(5, dealt),
      measuredRadio: paragraphs(5, dealt),
      knownCheckbox: paragraphs(5, dealt),
      knownRadio: paragraphs(5, dealt),
      inclusiveDetails: paragraphs(5, dealt),
      exclusiveDetails: paragraphs(5, dealt),
      inclusiveCheckboxes: paragraphs(5, dealt),
      exclusiveRadios: paragraphs(5, dealt)
    };
  });
  const {tradeProduct} = useEnv();

  return <>
    <p className="demos-opening paragraph">
      Each tab below is one feature a page needs, built here and explained. The tabs run from simple to expert: an
      accordion, a menu that opens under a card, a list you sort by dragging, a live chart, and a table whose columns
      and rows you drag while trades keep landing. A tab shows the thing first, with dials wherever the build has a
      choice; then the explanation, with what the platform gives now beside the tricks we used before it; then the
      steps that build it, each beside the code that runs on this page. Start with the accordions if HTML, CSS and
      JavaScript are new to you, or go to the tab whose bug you came with.
    </p>
    <Tabs label="demos" defaultTab={DemoTopics.accordions} values={topics}/>
    <section id="about" aria-label={topics.find(({param}) => param === tab)?.display} className="about">
      {({
        [DemoTopics.accordions]:
              <>
                <AccordionsExplained contents={accordionContents} type={type} onTypeChosen={next => updateSearchParams({type: next})}
                  motion={foldMotion} onMotionChosen={next => updateSearchParams({style: next})}/>
              </>,
        [DemoTopics.zIndex]: <>
          <ZIndexIntroduction/>
          <StackingExplained raised={raised} onRaised={next => updateSearchParams({raised: next})}/>
          <MenuExplained cardOne={cardOne} onCardOneChosen={next => updateSearchParams({'card-one': next})}/>
          <PopoverExplained/>
          <BannerExplained/>
          <FormsContextExplained worn={wears} onWornChosen={next => updateSearchParams({wears: next})}/>
          <TopLayerTutorial/>
        </>,
        [DemoTopics.charts]: <>
          <ChartsIntroduction/>
          <Workspace product={tradeProduct}/>
          <ChartsTutorial/>
        </>,
        [DemoTopics.tables]: <>
          <TablesIntroduction/>
          <Aggregations pace={pace} origin={origin} motion={motion} world={world}/>
          <Tutorials shown={tut} onShown={next => updateSearchParams({tut: next})}
            track={track} onTrackChosen={next => updateSearchParams({track: next})}/>
        </>,
        [DemoTopics.dragAndDrop]: <>
          <DragSortIntroduction/>
          {(() => {
            const lists = {
              eager: {
                keep: {animated: EagerKeepAnimatedList, static: EagerKeepStaticList},
                hide: {animated: EagerHideAnimatedList, static: EagerHideStaticList}
              },
              lazy: {
                keep: {animated: LazyKeepAnimatedList, static: LazyKeepStaticList},
                hide: {animated: LazyHideAnimatedList, static: LazyHideStaticList}
              }
            };
            const List = lists[pace][origin][motion];
            return <List list={new Set(['A', 'B', 'C'])}/>;
          })()}
          <ListTutorials/>
        </>
      })[tab]}
    </section>
  </>;
};
