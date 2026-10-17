import {FC} from 'react';
import {plain, Snippet} from '../Recipe';
import {unit} from '../Recipe/carve';
import {ContextChooser} from './ContextChooser';
import {Worn} from './worn';
import {whatElseFormsHeading} from './part-headings';
import zIndexCss from './ZIndexDemo.css?sample';
import surfaceCss from '../../../styles/surface.css?sample';
import tabsCss from '@components/Tabs/Tabs.css?sample';
import '../Runs.css';

const gap = plain(' ');

const mdn = 'https://developer.mozilla.org/en-US/docs/Web/CSS/';

type Props = {
  worn: Worn;
  onWornChosen: (worn: Worn) => void;
};

export const FormsContextExplained: FC<Props> = ({worn, onWornChosen}) =>
  <section aria-labelledby={whatElseFormsHeading} className="stacking-part">
    <h2 id={whatElseFormsHeading} className="title bold">What else forms a stacking context</h2>
    <ContextChooser worn={worn} onWornChosen={onWornChosen}/>
    <ol className="runs card rounded-corners lifted padded">
      <li className="run">
        <p className="paragraph">More properties than z-index form a stacking context. MDN, Mozilla’s web reference,
          keeps <a className="signpost" href={`${mdn}CSS_positioned_layout/Stacking_context`}>the whole
            list</a>, and these are the ones a page meets most. I put the three that form none beside them because telling
          them apart is the lesson.</p>
      </li>
      <li className="run">
        <p className="paragraph">With nothing on it, card one is a plain grid item, a box laid out by a parent whose
          display is grid. Its list’s 9999 is compared with card two’s 1 in the tab panel’s context, so the list opens on
          top.</p>
        <Snippet label="CSS" lines={unit(zIndexCss, '.old-way-cards {')}/>
      </li>
      <li className="run">
        <p className="paragraph">The list is placed by <a className="signpost" href={`${mdn}CSS_anchor_positioning`}>anchor
          positioning</a>. The Sort by button names itself <code>--sort-by</code>, and <code>position-anchor</code> on the list
          picks that button. <code>anchor(end)</code> puts the list’s top at the button’s bottom. <code>anchor(start)</code> lines
          the list’s start edge up with the button’s; the start edge is the side a line of text begins on. Nothing between the list and the card is positioned.</p>
        <Snippet label="CSS" lines={[
          ...unit(zIndexCss, '.old-way-card .button {'), gap,
          ...unit(zIndexCss, '.sort-choices {\n        position-anchor')
        ]}/>
      </li>
      <li className="run">
        <p className="paragraph"><a className="signpost" href={`${mdn}position`}><code>position: relative</code></a> is
          not enough on its own, and neither is absolute: an element positioned either way forms a context only together
          with a z-index other than auto. Fixed and sticky are different. Each forms a context by itself. Sticky
          scrolls with the page until it reaches an edge and then stays there.</p>
        <Snippet label="CSS" lines={unit(zIndexCss, '.positioned {')}/>
      </li>
      <li className="run">
        <p className="paragraph"><a className="signpost" href={`${mdn}outline`}><code>outline</code></a> is paint. An
          outline, a border, a background or a shadow changes how a box looks and not how it stacks, so none of them forms
          a context.</p>
        <Snippet label="CSS" lines={unit(surfaceCss, '.outlined {')}/>
      </li>
      <li className="run">
        <p className="paragraph"><a className="signpost" href={`${mdn}z-index`}><code>z-index: 1</code></a> forms a
          context on a positioned element. It forms one on a grid item too, which card one is here, and on a flex item, a box laid
          out by a parent whose display is flex. The menu part’s card had position: relative as well, and either is
          enough. Card two, at 1 and later in the code, is painted over card one.</p>
        <Snippet label="CSS" lines={unit(zIndexCss, '.forms-context {')}/>
      </li>
      <li className="run">
        <p className="paragraph"><a className="signpost" href={`${mdn}opacity`}><code>opacity: 0.9</code></a>, like any
          opacity below 1, forms a context because the card is drawn as one layer and then faded. A card that fades in
          traps its menu, and nothing in the stylesheet says z-index.</p>
        <Snippet label="CSS" lines={unit(zIndexCss, '.faded {')}/>
      </li>
      <li className="run">
        <p className="paragraph"><a className="signpost" href={`${mdn}transform`}><code>transform: rotate(-1deg)</code></a> forms
          a context, as any transform does, even translate(0), for the same reason: the card becomes one layer. A card
          that slides in traps what it holds.</p>
        <Snippet label="CSS" lines={unit(zIndexCss, '.turned {')}/>
      </li>
      <li className="run">
        <p className="paragraph"><a className="signpost" href={`${mdn}isolation`}><code>isolation: isolate</code></a> forms
          a context and does nothing more. Use it to keep a component’s z-indexes inside it on purpose, instead of as a
          side effect of opacity or a transform. I use it that way here: the tab’s panel wears it, in Tabs.css, so no z-index inside a
          tab is ever compared with one outside it.</p>
        <Snippet label="CSS" lines={[
          ...unit(zIndexCss, '.isolated {'), gap,
          ...unit(tabsCss, '.tabs ~ * {')
        ]}/>
      </li>
    </ol>
  </section>;
