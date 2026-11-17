import {FC} from 'react';
import {DemoLink} from '@pages/Demos/DemoLink';
import {carve, lines, Snippet} from '../Recipe';
import {ContextChooser} from './ContextChooser';
import zIndexCss from './ZIndexDemo.css?sample';
import surfaceCss from '../../../styles/surface.css?sample';
import tabsCss from '@navigation/Tabs/Tabs.css?sample';
import '../Runs.css';
import {zIndexParts} from './part-pages';
import {PartLink} from './PartLink';

const mdn = 'https://developer.mozilla.org/en-US/docs/Web/CSS/';

export const WhatElseFormsAStackingContext: FC = () => <>
  <p className="paragraph">A card with no z-index at all can still trap the list inside it. This part shows which
    properties form a stacking context, and three common ones that do not. It assumes what <PartLink
    part="why-third-is-on-top"/> and <PartLink part="why-9999-still-loses"/> give: positioned and auto, a stacking context, and a z-index compared only inside its own.</p>
  <ContextChooser/>
  <ol className="runs card rounded-corners lifted padded">
    <li className="run">
      <p className="paragraph">More properties than z-index form a stacking context. MDN, Mozilla’s web reference,
        keeps <a className="signpost" href={`${mdn}CSS_positioned_layout/Stacking_context`}>the whole
          list</a>, and these are the ones a page meets most. I put the three that form none beside them because
        telling them apart is the lesson.</p>
    </li>
    <li className="run">
      <p className="paragraph">With nothing on it, card one is a plain grid item, a box laid out by a parent whose
        display is grid. Its list’s 9999 is compared with card two’s 1 in the context the tab’s content forms, so the
        list opens on top.</p>
      <Snippet label="CSS" lines={lines.fromTheExhibit(carve.unit(zIndexCss, '.old-way-cards {'))}/>
    </li>
    <li className="run">
      <p className="paragraph">The list is placed
        by <a className="signpost" href={`${mdn}CSS_anchor_positioning`}>anchor
          positioning</a>. The Sort by button names itself <code className="monospaced">--sort-by</code>,
        and <code className="monospaced">position-anchor</code> on the list
        picks that button. <code className="monospaced">anchor(end)</code> puts the list’s top at the button’s
        bottom. <code className="monospaced">anchor(start)</code> lines
        the list’s start edge up with the button’s; the start edge is the side a line of text begins on. Nothing
        between the list and the card is positioned.</p>
      <Snippet label="CSS" lines={lines.fromTheExhibit([
        ...carve.unit(zIndexCss, '.old-way-card .button {'), lines.blank,
        ...carve.unit(zIndexCss, '.sort-choices {\n        position-anchor')
      ])}/>
    </li>
    <li className="run">
      <p className="paragraph"><a className="signpost" href={`${mdn}position`}><code className="monospaced">position:
        relative</code></a> is
        not enough on its own, and neither is absolute: an element positioned either way forms a context only together
        with a z-index other than auto. Fixed, which pins an element to the window, and sticky are
        different. Each forms a context by itself. Sticky
        scrolls with the page until it reaches an edge and then stays there.</p>
      <Snippet label="CSS" lines={lines.fromTheExhibit(carve.unit(zIndexCss, '.positioned {'))}/>
    </li>
    <li className="run">
      <p className="paragraph"><a className="signpost" href={`${mdn}outline`}><code className="monospaced">outline</code></a> is paint. An
        outline, a border, a background or a shadow changes how a box looks and not how it stacks, so none of them
        forms a context.</p>
      <Snippet label="CSS" lines={carve.unit(surfaceCss, '.outlined {')}/>
    </li>
    <li className="run">
      <p className="paragraph"><a className="signpost" href={`${mdn}z-index`}><code className="monospaced">z-index:
        1</code></a> forms a
        context on a positioned element. It forms one on a grid item too, which card one is here, and on a flex item,
        a box laid out by a parent whose display is
        flex. <DemoLink to={zIndexParts.addressOf('why-9999-still-loses')}>The menu part’s card</DemoLink> had
        position: relative as well, and either is enough. Card two, at 1 and later in the code, is painted over
        card one.</p>
      <Snippet label="CSS" lines={lines.fromTheExhibit(carve.unit(zIndexCss, '.forms-context {'))}/>
    </li>
    <li className="run">
      <p className="paragraph"><a className="signpost" href={`${mdn}opacity`}><code className="monospaced">opacity:
        0.9</code></a>, like any
        opacity below 1, forms a context because the card is drawn as one layer and then faded. A card that fades in
        traps its menu, and nothing in the style sheet says z-index.</p>
      <Snippet label="CSS" lines={lines.fromTheExhibit(carve.unit(zIndexCss, '.faded {'))}/>
    </li>
    <li className="run">
      <p className="paragraph"><a className="signpost" href={`${mdn}transform`}><code className="monospaced">transform: rotate(-1deg)</code></a> forms
        a context, as any transform does, even translate(0), for the same reason: the card becomes one layer. A card
        that slides in traps what it holds.</p>
      <Snippet label="CSS" lines={lines.fromTheExhibit(carve.unit(zIndexCss, '.turned {'))}/>
    </li>
    <li className="run">
      <p className="paragraph"><a className="signpost" href={`${mdn}isolation`}><code className="monospaced">isolation: isolate</code></a> forms
        a context and does nothing more. Use it to keep the z-indexes of one part of the page inside it on purpose,
        instead of as a side effect of opacity or a transform. I use it that way here: the tab’s content wears it, in
        Tabs.css, so no z-index inside a tab is ever compared with one outside it.</p>
      <Snippet label="CSS" lines={lines.fromTheExhibit(carve.unit(zIndexCss, '.isolated {'))}/>
      <Snippet label="CSS" lines={carve.unit(tabsCss, '.tabs ~ * {')}/>
    </li>
  </ol>
</>;
