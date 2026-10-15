import {FC} from 'react';
import {plain, Snippet} from '../Recipe';
import {unit} from '../Recipe/carve';
import {ContextChooser} from './ContextChooser';
import {Worn} from './worn';
import zIndexCss from './ZIndexDemo.css?sample';
import surfaceCss from '../../../styles/surface.css?sample';
import '../Runs.css';

const gap = plain(' ');

const mdn = 'https://developer.mozilla.org/en-US/docs/Web/CSS/';

type Props = {
  worn: Worn;
  onWornChosen: (worn: Worn) => void;
};

export const FormsContextExplained: FC<Props> = ({worn, onWornChosen}) =>
  <section aria-labelledby="what-else-forms-heading" className="stacking-part">
    <h3 id="what-else-forms-heading" className="title bold">What else forms a stacking context</h3>
    <ContextChooser worn={worn} onWornChosen={onWornChosen}/>
    <ol className="runs card rounded-corners lifted padded">
      <li className="run">
        <p className="paragraph">A stacking context is formed by more properties than z-index. MDN, Mozilla’s web
          reference, keeps <a className="signpost" href={`${mdn}CSS_positioned_layout/Stacking_context`}>the whole
            list</a>; these are the ones a page meets most, and the three that form none are there because telling them
          apart is the lesson.</p>
      </li>
      <li className="run">
        <p className="paragraph">With nothing on it, card one is a plain grid item, a box laid out by a parent whose
          display is grid. Its list’s 9999 is compared with card two’s 1 in the page’s own context, so the list opens on
          top.</p>
        <Snippet label="CSS" lines={[
          ...unit(zIndexCss, '.old-way-cards {'), gap,
          ...unit(zIndexCss, '.menu-anchor {')
        ]}/>
      </li>
      <li className="run">
        <p className="paragraph"><a className="signpost" href={`${mdn}position`}><code>position: relative</code></a> is
          not enough on its own, and neither is absolute: an element positioned either way forms a context only together
          with a z-index other than auto. Fixed and sticky, which scrolls with the page until it reaches an edge and then
          stays there, are different and form one by themselves.</p>
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
          context on a positioned element, and on a grid item too, which card one is here, and on a flex item, a box laid
          out by a parent whose display is flex. The menu part’s card had position: relative as well, and either is
          enough. Card two, at 1 and later in the code, paints over card one.</p>
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
          side effect of opacity or a transform.</p>
        <Snippet label="CSS" lines={unit(zIndexCss, '.isolated {')}/>
      </li>
    </ol>
  </section>;
