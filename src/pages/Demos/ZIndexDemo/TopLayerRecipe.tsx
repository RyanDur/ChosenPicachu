import {FC} from 'react';
import {Align, Side} from '@banners';
import {
  carve,
  Codes,
  DialStep,
  lines,
  Mdn,
  Sample,
  Says,
  Snippet,
  Step,
  StepHeading,
  Steps,
  Story,
  Tell,
  Want,
  Words
} from '../Recipe';
import {AlignDial, SideDial, useControls} from '../Controls';
import {PartLink} from './PartLink';
import {PartTermLink} from './PartTermLink';
import {topLayerStoryTitleId} from './top-layer-story-title-id';
import bannersSource from '@banners/Banners.tsx?sample';
import providerSource from '@banners/BannerProvider.tsx?sample';
import bannersCss from '@banners/Banners.css?sample';
import placementCss from '../../../styles/placement.css?sample';
import surfaceCss from '../../../styles/surface.css?sample';
import typographyCss from '../../../styles/typography.css?sample';
import '../Recipe/Recipe.css';

const sideFact: Record<Side, string> = {
  top: 'top sets the margin above the panel to a gap and the one below to auto.',
  middle: 'middle sets the margins above and below to auto.',
  bottom: 'bottom sets the margin below the panel to a gap and the one above to auto.'
};

const alignFact: Record<Align, string> = {
  left: 'left sets the margin to the panel’s left to a gap and the one to its right to auto.',
  center: 'center sets the margins to the left and right to auto.',
  right: 'right sets the margin to the panel’s right to a gap and the one to its left to auto.'
};

const alignSheet: Record<Align, Sample> = {
  left: bannersCss,
  center: placementCss,
  right: bannersCss
};

export const TopLayerRecipe: FC = () => {
  const {side, align} = useControls();

  return <Story titleId={topLayerStoryTitleId}
    can="The user sees the news over the page"
    soThat="no stacking context can bury the news">
    <Tell>I could give the banner a huge z-index. But a z-index counts only inside its own stacking context, the term
      taught in <PartLink part="why-9999-still-loses"/>. An element around the banner forms a stacking context by the
      ways <PartLink part="what-else-forms-a-stacking-context"/> shows. <code className="monospaced">position:
        fixed</code>, which pins the banner to the window, does not lift it out of that context,
      as <PartLink part="why-a-fixed-banner-still-loses"/> shows. Inside that context, the banner’s 9999 is compared
      with nothing outside it. So I make the panel a popover. The browser shows a popover in the top layer, above
      every stacking context on the page, so no z-index on the page is ever compared with it. The top layer stacks in
      the order things are shown, so a dialog or menu opened after the banner goes over it.</Tell>
    <Steps>
      <Step>
        <StepHeading title="Make the panel a popover"/>
        <Words>
          <Want>A bigger number does not get the banner out of a stacking context. The banner has to sit above every
            context on the page, in the top layer.</Want>
          <Says>The panel is a section written once, at the root of the site. Its role
            is <Mdn path="Web/Accessibility/ARIA/Reference/Roles/alert_role">alert</Mdn>, so a screen reader
            announces what arrives without being asked. <code className="monospaced">popover="manual"</code> makes it
            a popover that stays open until we close it. Showing it closes no other popover, so a menu the reader has
            open stays open. A plain popover closes on the next click anywhere, and a banner has to wait for its
            reader.</Says>
          <Says>A modal dialog shown after the banner goes over it, and makes the rest of the page take no clicks, the
            banner included. So while a modal is open, the panel is hidden, and it shows again when the dialog
            closes. <code className="monospaced">:modal</code> matches a dialog shown as a modal,
            and <code className="monospaced">:root:has(:modal)</code> matches the page while it holds one.</Says>
        </Words>
        <Codes>
          <Snippet label="HTML" lines={[
            ...carve.between(bannersSource, '<section id="banners"', '</section>;')
          ]}/>
          <Snippet label="CSS" lines={carve.unit(bannersCss, ':root:has(:modal) .banners {')}/>
        </Codes>
      </Step>
      <Step>
        <StepHeading title="Show it when there is news"/>
        <Words>
          <Want>The panel should be there when news arrives, and gone when the last of it is dismissed.</Want>
          <Says>The site keeps its banners in a <PartTermLink part="why-the-popover-wins">React</PartTermLink> context,
            a value React hands to every component inside it. It has nothing to do with the stacking contexts above; the
            two only share the word.</Says>
          <Says>To dispatch is to hand the context an action, a record of what happened. A component raises a banner by
            dispatching one that says a message arrived. The dismiss button dispatches one that marks the banner
            leaving, and the panel lowers it once it has slid away and the gap it left has closed. The panel reads the
            banners from the context and is written only while there is at least one. No button opens this popover,
            so script shows it. The panel’s ref is a function React calls with the element once it is written, and it
            shows the panel with <code className="monospaced">showPopover()</code>.</Says>
          <Says><code className="monospaced">has</code> comes from sand, a small library of helpers the site uses for
            values that may be missing. Given the list of banners, it answers whether the list holds any.</Says>
        </Words>
        <Codes>
          <Snippet label="TS" lines={[
            ...carve.unit(providerSource, 'export const BannerProvider'), lines.blank,
            ...carve.unit(bannersSource, 'const raisedOverThePage'), lines.blank,
            ...carve.between(bannersSource, 'return has(banners)', "className={classNames('banners unfilled'")
          ]}/>
        </Codes>
      </Step>
      <DialStep>
        <StepHeading title="Place the panel with two class names">
          <SideDial name="station-side"/>
          <AlignDial name="station-align"/>
        </StepHeading>
        <Words>
          <Want>Nine places, and no arithmetic: auto margins center the panel.</Want>
          <Says>The browser’s own rule for a popover gives it a fixed position, inset: 0 and a size that fits its
            content. inset: 0 lets the panel reach each edge of the window, and it takes only the room its content
            needs. The site’s reset sets every section’s margins to 0, so the banner’s own classes place it: one
            class chooses the side and one the alignment.</Says>
          <Says>A class for an edge sets the margin on that edge to a fixed gap and the margin opposite to auto, so
            the auto margin takes the spare room and the panel holds to that
            edge. <code className="monospaced">middle</code> and <code className="monospaced">center</code> set both
            margins on their axis to auto, so the two share the spare room and the panel sits in the center.</Says>
          <Says>On this page margin-block is the margins above and below the panel, and margin-inline is the ones to
            its left and right. Here, {sideFact[side]} And {alignFact[align]}</Says>
          <Says>The sample is the component’s line: the two class names the dials choose arrive as side and align, and
            the browser’s element reads, for this page’s choice, {side} {align}. The class unfilled clears the
            background the browser gives a popover. overflow: visible undoes the popover’s own overflow: auto, so a
            banner can slide in from past the panel’s edge.</Says>
        </Words>
        <Codes>
          <Snippet label="HTML"
            lines={carve.between(bannersSource, '<section id="banners"', "className={classNames('banners unfilled'")}/>
          <Snippet label="CSS" lines={[
            lines.plain('/* the browser’s own rule */'),
            lines.plain('[popover] {'),
            lines.plain('  position: fixed;'),
            lines.plain('  inset: 0;'),
            lines.plain('}'), lines.blank,
            ...carve.between(bannersCss, '.banners {', 'max-inline-size: min(60ch'), lines.blank,
            ...carve.unit(bannersCss, `.${side} {`), lines.blank,
            ...carve.unit(alignSheet[align], `.${align} {`)
          ]}/>
        </Codes>
      </DialStep>
      <Step>
        <StepHeading title="Style each banner"/>
        <Words>
          <Want>A banner is read at a glance, by someone busy with something else.</Want>
          <Says>Each message sits in a paragraph with the class news. Its look comes from classes shared across this
            site: field for the background, rounded-corners, floating for the shadow, alarm-ink for the message’s color,
            and hairline-outline for a thin border in that color. The dismiss button is a square of fixed size that does
            not shrink when the message is long. Its look is shared classes too: borderless and unfilled take off the
            browser’s own button border and ground, glyph-icon sets the × at the size the site’s icons are drawn, and
            muted-ink grays it.</Says>
        </Words>
        <Codes>
          <Snippet label="CSS" lines={[
            ...carve.unit(bannersCss, '.news {'), lines.blank,
            ...carve.unit(surfaceCss, '.field {'), lines.blank,
            ...carve.unit(surfaceCss, '.rounded-corners {'), lines.blank,
            ...carve.unit(surfaceCss, '.floating {'), lines.blank,
            ...carve.unit(surfaceCss, '.alarm-ink {'), lines.blank,
            ...carve.unit(surfaceCss, '.hairline-outline {'), lines.blank,
            ...carve.unit(bannersCss, '.dismiss {'), lines.blank,
            ...carve.unit(surfaceCss, '.borderless {'), lines.blank,
            ...carve.unit(surfaceCss, '.unfilled {'), lines.blank,
            ...carve.unit(typographyCss, '.glyph-icon {'), lines.blank,
            ...carve.unit(surfaceCss, '.muted-ink {')
          ]}/>
        </Codes>
      </Step>
    </Steps>
  </Story>;
};
