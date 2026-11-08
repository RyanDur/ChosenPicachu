import {TabLink} from '@pages/Demos/TabLink';
import {DemoTopics} from '../types';
import {FC, useId} from 'react';
import {Stories} from '../Recipe';
import {useControls} from '../Controls';
import {useArrival} from '@frame/navigation/arrival';
import {BannerControls} from './BannerControls';
import {TopLayerRecipe} from './Recipe/TopLayerRecipe';
import {MultipleRecipe} from './Recipe/MultipleRecipe';
import '../Recipe/Recipe.css';

export const TopLayerTutorial: FC = () => {
  const {side, align, enter, stack, change} = useControls();
  useArrival();

  const titled = `tutorials${useId()}`;
  return <section aria-labelledby={titled} className="tutorials">
    <h2 id={titled} className="title">let’s build this feature</h2>
    <p className="overview paragraph">
      We are going to build this site’s banner: the panel that carries the news, whatever
      the news is. Elsewhere on this site it reports real trouble. On this page the button raises random nonsense so you
      can watch the mechanics.
    </p>
    <p className="overview paragraph">The parts above show what a z-index does and where it stops counting. The banner
      uses both: it sets a z-index, and where it sits decides what that number is compared with.</p>
    <figure className="feedback">
      <blockquote className="quote paragraph italic trim-bar-beside">
        When something breaks, tell me. Do not make me guess why the chart went quiet,
        and do not hide the note under the thing that broke.
      </blockquote>
      <figcaption className="attribution caption muted-ink">a user</figcaption>
    </figure>
    <p className="overview paragraph">
      A <a
        className="signpost"
        href="https://initialcapacity.io/insights/user-story"
        target="_blank"
        rel="noreferrer">user story</a> is a card, a conversation and a confirmation. The card names who wants what
      and why. The conversation settles what the card leaves open. The confirmation says what a reader meets when the
      story is done. Here is the banner’s, walked through once.
    </p>
    <p className="story walked-through card rounded-corners lifted">
      <span className="can paragraph bold">As a reader who missed the news, I want the banner to raise it,</span>{' '}
      <span className="so-that paragraph italic muted-ink">so that I do not go looking.</span>
    </p>
    <p className="overview paragraph">
      The user’s words above settled two things. ‘Tell me’ means the banner speaks up on its own: it is an alert, so a
      screen reader, the program that reads a page aloud, announces a new note without the reader going to look. ‘Do not
      hide the note under the thing that broke’ means the banner is written last on the page, outside the tab’s
      content, where every card sits, with a z-index that puts it over that content, so no card is drawn over it.
    </p>
    <p className="overview paragraph">
      Each phrase read that way is a clue: a line of what the user said, and what it commits the build to.
    </p>
    <p className="overview paragraph">
      The user’s words left open where on the window the note sits, how it arrives, and how several stand at once. The
      dials below are those answers, and the cards below settle them one at a time.
    </p>
    <p className="overview paragraph">The confirmation is two lines a reader can check against the page.</p>
    <ul className="confirmation" aria-label="the confirmation">
      <li className="paragraph">Given a page with the news raised, when a card with a z-index of its own scrolls past,
        then the note stays on top.
      </li>
      <li className="paragraph">Given a reader with a screen reader, when news is raised, then it is read out without
        the reader going to look.
      </li>
    </ul>
    <p className="overview paragraph">
      Every card below is one of those stories, shortened. Its headline says who gets what and its second line says why;
      the steps inside say what each conversation settled, with the real code from this site, so what you read is what
      runs. Its confirmation is a journey this site runs. The <TabLink to={DemoTopics.accordions}>dials</TabLink> below
      place the stack, choose its entrance and pick how it grows. Where a step depends on a dial, that dial sits on the
      step. The links go to MDN, if you want more.
    </p>
    <BannerControls side={side} align={align} enter={enter} stack={stack}
      onSideChosen={next => change({side: next})}
      onAlignChosen={next => change({align: next})}
      onEnterChosen={next => change({enter: next})}
      onStackChosen={next => change({stack: next})}/>
    <section aria-label="build the banners yourself" className="build-steps">
      <Stories>
        <TopLayerRecipe/>
        <MultipleRecipe/>
      </Stories>
    </section>
  </section>;
};
