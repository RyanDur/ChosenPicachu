import {FC} from 'react';
import {useSearchParamsObject} from '@components/search-params';
import {alignParam, enterParam, sideParam, stackParam} from '@components/Banners/params';
import {Stories} from '../Recipe';
import {BannerControls} from './BannerControls';
import {TopLayerRecipe} from './Recipe/TopLayerRecipe';
import {MultipleRecipe} from './Recipe/MultipleRecipe';
import '../Recipe/Recipe.css';

export const TopLayerTutorial: FC = () => {
  const {side = 'top', align = 'center', enter = 'above', stack = 'down', updateSearchParams} =
    useSearchParamsObject({side: sideParam, align: alignParam, enter: enterParam, stack: stackParam});

  return <section className="tutorials">
    <h2 className="tutorials-title">let’s build this feature</h2>
    <p className="overview paragraph">
      We are going to build this site’s banner: the panel that carries the news, whatever
      the news is. Elsewhere on this site it reports real trouble; on this page the button
      raises random nonsense so you can watch the mechanics. Here is how to use this page:
      every card below is a feature, told as a <a
        className="signpost"
        href="https://initialcapacity.io/insights/user-story"
        target="_blank"
        rel="noreferrer">user story</a>. Open a card and you get the plan for that feature
      and the steps that build it, with the real code from this site, so what you read is
      what runs. The cards at the top of this page fight for the front with z-index; the
      banner does not fight at all. The dials below place the stack, choose its entrance,
      and pick how it grows, and where a step depends on a dial, that dial sits on the
      step. The links
      go to MDN if you want more.
    </p>
    <figure className="feedback">
      <blockquote className="quote paragraph italic">
        When something breaks, tell me. Do not make me guess why the chart went quiet,
        and do not hide the note under the thing that broke.
      </blockquote>
      <figcaption className="attribution">a user</figcaption>
    </figure>
    <BannerControls side={side} align={align} enter={enter} stack={stack}
                    onSide={next => updateSearchParams({side: next})}
                    onAlign={next => updateSearchParams({align: next})}
                    onEnter={next => updateSearchParams({enter: next})}
                    onStack={next => updateSearchParams({stack: next})}/>
    <section aria-label="build the banners yourself" className="build-steps">
      <Stories>
        <TopLayerRecipe/>
        <MultipleRecipe/>
      </Stories>
    </section>
  </section>;
};
