import {FC} from 'react';
import {useControls} from '../Controls';
import {FoldType} from '../ReaderSettings';
import {carve, lines, Mdn, Snippet} from '../Recipe';
import {Fold} from './accordion-props';
import {OneJobTwoWays, SizedToTheText, ThreeBecomeTwo} from './Diagrams';
import {foldInput} from './fold-input';
import {looks} from './looks';
import {PlatformExhibit} from './PlatformExhibit';
import {platformBuilds} from './platform-builds';
import {PartLink} from './PartLink';
import {RemembersTheFoldLink} from './RemembersTheFoldLink';
import {HeadingLink} from './HeadingLink';
import accordionsCss from './Accordions.css?sample';
import surfaceCss from '../../../styles/surface.css?sample';
import '../Runs.css';
import './PartDepth.css';

type Props = {
  folds: Record<FoldType, Fold[]>;
};

export const PlatformGivesNow: FC<Props> = ({folds}) => {
  const {foldType, foldMotion} = useControls();
  const input = foldInput.of(foldType);
  const platform = platformBuilds[foldType];
  return <>
    <p className="paragraph">This part builds on two before it: “<HeadingLink heading="html-alone-heading"/>”, on the
      tab, for details and summary, and “<PartLink part="a-box-remembers-the-fold"/>”, for the {input} build it
      replaces.</p>
    <PlatformExhibit folds={folds}/>
    <ol className={looks.runs}>
      <li className="run">
        <p className="paragraph">This build uses details and summary, the two elements from the HTML-alone accordion.
          Each piece of <RemembersTheFoldLink>the {input} build</RemembersTheFoldLink> has a native
          piece in its place. Summary is the bar and the control at once, so nothing has to tie a label to a
          hidden {input}. Details remembers whether it is open, so there is no {input} to hide and no rule that reads
          it. The keyboard comes with it, and a screen reader announces the bar as a disclosure, collapsed or
          expanded.
        {foldType === 'inclusive' && <> With nothing more, each fold opens and closes on its own,
          as <RemembersTheFoldLink>the checkbox build’s folds</RemembersTheFoldLink> do.</>}
        {foldType === 'exclusive' && <> Every details here shares a name, as the HTML-alone accordion’s details do.
          Pressing the open one closes it, so the list needs no Close bar.</>} This build replaces the
          three old ways: the max-height guess, the height measured by script, and the known height.</p>
        <Snippet label="TS" lines={platform.sample}/>
        <OneJobTwoWays input={input}/>
        <ThreeBecomeTwo/>
      </li>
      <li className="part-depth">
        <details aria-labelledby="details-depth">
          <summary id="details-depth" className="fold-bar bold">How details works</summary>
          <ol className="runs">
            <li className="run">
              <p className="paragraph">The summary lays its name and arrow side by side in a flex row, as the label
                does in <RemembersTheFoldLink>the {input} build</RemembersTheFoldLink>. It wears the site’s
                own <RemembersTheFoldLink>classes</RemembersTheFoldLink>, names a rule picks an element out
                by: <code className="monospaced">inverse-filled</code> for its
                colors, <code className="monospaced">attentive</code> for
                the approach color, the ring and a glow while it is pressed,
                and <code className="monospaced">field-outlined</code> for the
                hairline that draws the line between one bar and the next. Summary takes focus, which marks the
                element the keyboard acts on, and hover itself, where the {input} build carried focus from the
                hidden {input} to the label.</p>
              <Snippet label="CSS" lines={[
                ...carve.unit(accordionsCss, '.info-label {\n      display: flex;\n      padding'), lines.blank,
                ...carve.unit(surfaceCss, '.inverse-filled {'), lines.blank,
                ...carve.unit(surfaceCss, '.attentive:where(:not(:disabled)) {'), lines.blank,
                ...carve.unit(surfaceCss, '.field-outlined {')
              ]}/>
            </li>
            <li className="run">
              <p className="paragraph">Summary also draws its own arrow, called a marker, where the {input} build
                drew one from two borders. The browser gives a summary the display of a list item, and draws a marker
                only on a list item. This bar’s display is flex, a row, so the browser draws no marker. The bar draws
                the same arrow as <RemembersTheFoldLink>the known-height build’s bars</RemembersTheFoldLink> in its
                place.</p>
            </li>
            <li className="run">
              <p className="paragraph">The arrow points right while the fold is closed. When the fold opens, the
                browser adds an open attribute to the details in the page it is showing, as if it were written in the
                opening tag. <code className="monospaced">[open]</code> is a piece of a CSS rule that picks an element
                with that attribute, and its rule turns the arrow down.</p>
              <Snippet label="CSS" lines={carve.unit(accordionsCss, '&[open] > .info-label::after {')}/>
            </li>
            <li className="run">
              <p className="paragraph">A pseudo-element is a part of an element
                that CSS can style as if it were an element of its
                own. <Mdn path="Web/CSS/::details-content">::details-content</Mdn> is the part a closed
                details hides. Here it is a grid, the CSS layout that sets a box out in rows and columns, with
                one row. The fr is a grid unit for a share of the space. In a grid sized to its content, a row of
                1fr is exactly as tall as its content needs, and a row of 0fr has no height. The row is 0fr while
                the fold is closed and 1fr while it is open. A row in fr is a number, so 0fr to 1fr is a number
                growing, which a transition can move. The row always ends at the text’s own height, so nothing is
                guessed, measured or fixed. The site’s reset gives every details’ hidden part a height of 0 while it
                is closed, so this one sets its height back to auto and leaves the closing to the row.
              {{
                reveal: ' With reveal, the row moves over 300 milliseconds with ease-in-out, a timing that starts slowly, speeds up and slows to a stop, and the text shows from its top down. Align-items: start, in the sample, keeps the text at the top of its row while the row shrinks. Without it, Safari snaps a closing fold shut instead of sliding it. Content-visibility hides the closed content, and it has no values between on and off. Allow-discrete lets a property like that switch at the end of a close and at the start of an open. That keeps the text visible for the whole slide.',
                drawer: ' With the drawer, the row moves on the same 300 milliseconds and sets the text at its bottom, so the text’s bottom edge stays on the fold’s edge as it slides down from under the bar. Content-visibility hides the closed content and has no values between on and off; allow-discrete lets it switch at the end of a close and at the start of an open, which keeps the text visible for the whole slide.',
                static: ' With static, the part a details hides has no transition, so the fold opens at once, in every browser.'
              }[foldMotion]}</p>
              <Snippet label="CSS" lines={[
                ...carve.unit(accordionsCss, '&::details-content {'), lines.blank,
                ...carve.unit(accordionsCss, '&[open]::details-content {'),
                ...{
                  reveal: [lines.blank, ...carve.unit(accordionsCss, ':is(.reveal, .drawer) &::details-content {'), lines.blank, ...carve.unit(accordionsCss, '.reveal &::details-content {')],
                  drawer: [lines.blank, ...carve.unit(accordionsCss, ':is(.reveal, .drawer) &::details-content {')],
                  static: []
                }[foldMotion],
                ...(foldMotion === 'drawer' ? [lines.blank, ...carve.unit(accordionsCss, '.drawer &::details-content {')] : [])
              ]}/>
              <SizedToTheText/>
            </li>
            <li className="run">
              <p className="paragraph">A row closes only as far as its item can. The text has a minimum height of 0,
                so the row can shrink to nothing, and its padding sits on a span inside it, where it cannot hold the
                row open. With the padding on the text itself, every fold jumped open by the padding’s height before
                it began to slide.</p>
              <Snippet label="CSS" lines={[
                ...carve.unit(accordionsCss, '.info {\n      min-block-size: 0;'), lines.blank,
                ...carve.unit(accordionsCss, '.fold-text {')
              ]}/>
            </li>
            <li className="run">
              <p className="paragraph">There is no script here either.</p>
            </li>
          </ol>
        </details>
      </li>
    </ol>
  </>;
};
