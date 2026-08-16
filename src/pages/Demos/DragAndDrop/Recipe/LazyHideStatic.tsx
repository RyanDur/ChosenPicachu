import {FC} from 'react';
import {MotionDial, OriginDial, PaceDial} from '../../Controls';
import {Codes, Mdn, Says, Snippet, Step, Steps, Story, Tell, Words, aside} from '../../Recipe';
import {span, unit} from '../../Recipe/carve';
import {acceptTheDrop, armTheDrag, gap, holdTheAloft, innerHalf, neverOurs, platformCurrency, roadEnd, straightToOrder} from './shared-steps';
import listSource from '../LazyHideStaticList/LazyHideStaticList.tsx?raw';
import itemSource from '../LazyHideStaticList/Item.tsx?raw';
import cssSource from '../LazyHideStaticList/LazyHideStaticList.css?raw';

export const LazyHideStaticRecipe: FC = () => <>
  <Story param="native" id="sort"
         can="The user can sort the list"
         soThat="it reads in the order they mean">
    {platformCurrency}
    <Tell>This particular list keeps three more promises. The list holds calm and settles on the
      drop, so only the destination matters. One card rides the pointer, so no duplicate
      muddies the carry. And the settle lands instantly, so nothing competes with the drag
      session.</Tell>
    {neverOurs}
    <Steps>
      {armTheDrag(itemSource)}
      {holdTheAloft(listSource)}
      {acceptTheDrop(listSource)}
      {innerHalf}
      <Step title="Stash the landing, settle after the drag" dial={<PaceDial name="native-pace"/>}>
        <Words want="You want the list calm while the platform drags, which means the reorder must wait for a session that is still alive when the drop lands.">
          <Says>Each dragover only remembers where the pointer last hovered, and
            a <Mdn path="Web/API/HTMLElement/dragleave_event">dragleave</Mdn> forgets it. The commit runs from the release: the session has to finish before the list moves,
            because the platform is still animating its own end of the bargain.</Says>
        </Words>
        <Codes>
          <Snippet label="TS" lines={[
            ...span(listSource, 'onDragOver={() => setLanding(maybe(index))}', 'onDragOver={() => setLanding(maybe(index))}'), gap,
            ...unit(listSource, 'const release')
          ]}/>
        </Codes>
      </Step>
      <Step title="Fade the origin to a whisper" dial={<OriginDial name="native-origin"/>}>
        <Words want="With the snapshot in hand, the origin card reads as a duplicate, but truly vanishing it can kill the drag: some engines end the session when its source disappears.">
          <Says>So the origin does not vanish; it fades to a whisper. This is the hide list, so
            its own Item dresses itself on its own lift and undresses on its own release. The CSS behind the class is
            an <Mdn path="Web/CSS/opacity">opacity</Mdn> of nearly nothing: the node stays alive, the
            session keeps its source, and the eye reads a single card riding the pointer.</Says>
        </Words>
        <Codes>
          <Snippet label="TS" lines={[
            ...span(itemSource, 'updateHide(true);', 'updateHide(true);'), gap,
            ...span(itemSource, 'updateHide(false);', 'updateHide(false);')
          ]}/>
          <Snippet label="CSS" lines={[
            ...unit(cssSource, '.sortable-list .hide {'),
            aside('/* not visibility; the session dies with its source */')
          ]}/>
        </Codes>
      </Step>
      <Step title="Apply the state update directly" dial={<MotionDial name="native-motion"/>}>
        <Words want="Motion is not free: it competes with the drag session, costs a frame budget, and some users ask for none at all.">
          <Says>This is the static list; no marking code exists in it. The order applies and React
            paints next frame; a keyboard walk is applied as plainly as everything else.</Says>
        </Words>
        <Codes>
          <Snippet label="TS" lines={[
            ...span(listSource, 'onArranged={setOrder}', 'onArranged={setOrder}'),
            aside('// nothing marked, nothing competing with the session')
          ]}/>
        </Codes>
      </Step>
      {roadEnd}
    </Steps>
  </Story>
  {straightToOrder(itemSource)}
</>;
