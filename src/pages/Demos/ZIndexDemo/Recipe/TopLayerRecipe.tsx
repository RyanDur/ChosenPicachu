import {FC} from 'react';
import {Align, Side} from '@frame/notices/Banners';
import {Codes, Mdn, Says, Snippet, Step, Steps, Story, Words, Tell, lines, carve} from '../../Recipe';
import {Sample} from '../../Recipe/sample';
import {AlignDial, SideDial, useControls} from '../../Controls';
import {fixedBannerLosesHeading, stillLosesHeading, whatElseFormsHeading} from '../part-headings';
import bannersSource from '@frame/notices/Banners/Banners.tsx?sample';
import providerSource from '@frame/notices/Banners/BannerProvider.tsx?sample';
import bannersCss from '@frame/notices/Banners/Banners.css?sample';
import placementCss from '../../../../styles/placement.css?sample';
import surfaceCss from '../../../../styles/surface.css?sample';
import typographyCss from '../../../../styles/typography.css?sample';
import '../../Recipe/Recipe.css';

const gap = lines.plain(' ');

const sideFact: Record<Side, string> = {
  top: 'top sets the margin above the panel and leaves the one below at auto.',
  middle: 'middle sets the margins above and below to auto again.',
  bottom: 'bottom sets the margin below the panel and leaves the one above at auto.'
};

const alignFact: Record<Align, string> = {
  left: 'left sets the margin to the panel’s left and leaves the one to its right at auto.',
  center: 'center sets the margins to the left and right to auto again.',
  right: 'right sets the margin to the panel’s right and leaves the one to its left at auto.'
};

const alignSheet: Record<Align, Sample> = {
  left: bannersCss,
  center: placementCss,
  right: bannersCss
};

export const topLayerStory = {param: 'news', id: 'top'} as const;

export const TopLayerRecipe: FC = () => {
  const {side, align} = useControls();

  return <Story {...topLayerStory}
    can="The user sees the news over the page"
    soThat="no stacking context can bury the news">
    <Tell>I could give the banner a huge z-index. But a z-index counts only inside its own stacking context, the
      term taught above in <a className="signpost" href={`#${stillLosesHeading}`}><cite>Why 9999 still loses</cite></a>.
      An element around the banner forms a stacking context by the ways{' '}
    <a className="signpost" href={`#${whatElseFormsHeading}`}><cite>What else forms a stacking
      context</cite></a> shows. <code className="monospaced">position: fixed</code>, which pins the banner to the
      window, does not lift it out of that context,
      as <a className="signpost" href={`#${fixedBannerLosesHeading}`}><cite>Why a fixed banner still
        loses</cite></a> shows. Inside that context, the banner’s 9999 is compared with nothing outside it. So
      I write the panel last on the page, outside the tab’s content, where its z-index is compared with that content as
      a whole and with the frame around it, never with a card.</Tell>
    <Steps>
      <Step title="Write the panel last, at the page’s root">
        <Words want="A bigger number does not get the banner out of a stacking context. The banner has to sit in the page’s own context, beside the tab’s content, not inside it.">
          <Says>The panel is a section written once, at the root of the site, after the page itself. Its role
            is <Mdn path="Web/Accessibility/ARIA/Reference/Roles/alert_role">alert</Mdn>, so a screen reader
            announces what arrives without being asked.</Says>
        </Words>
        <Codes>
          <Snippet label="TS" lines={[
            ...carve.span(bannersSource, 'return banners.length > 0', '</section>;')
          ]}/>
        </Codes>
      </Step>
      <Step title="Show it when there is news">
        <Words want="The panel should be there when news arrives, and gone when the last of it is dismissed.">
          <Says>The site keeps its banners in a React context, a value React hands to every component inside it. It has
            nothing to do with the stacking contexts above; the two only share the word.</Says>
          <Says>To dispatch is to hand the context an action, a record of what happened. A component raises a banner by
            dispatching one that says a message arrived. The dismiss button dispatches one that marks the banner
            leaving, and the panel lowers it once it has slid away and the gap it left has closed. The panel reads the
            banners from the context and is written only while there is at least one, so no code shows or hides
            it.</Says>
        </Words>
        <Codes>
          <Snippet label="TS" lines={[
            ...carve.unit(providerSource, 'export const BannerProvider'), gap,
            ...carve.span(bannersSource, 'return banners.length > 0', "className={classNames('banners'")
          ]}/>
        </Codes>
      </Step>
      <Step title="Place the panel with two class names"
        dial={<><SideDial name="station-side"/><AlignDial name="station-align"/></>}>
        <Words want="Nine places, and no arithmetic: auto margins center the panel.">
          <Says>The panel’s own rule gives it a fixed position, inset: 0, margin: auto and a size that fits its content.
            inset: 0 lets the panel reach each edge of the window. It takes only the room its content needs, and the
            auto margins share the rest, which centers it in the window.</Says>
          <Says>A class for an edge sets the margin on that edge to a fixed gap, so the auto margin opposite takes the
            spare room and the panel holds to that
            edge. <code className="monospaced">middle</code> and <code className="monospaced">center</code> set auto
            again. They change nothing. I keep them so the choice shows in the class names.</Says>
          <Says>On this page margin-block is the margins above and below the panel, and margin-inline is the ones to
            its left and right. Here, {sideFact[side]} And {alignFact[align]}</Says>
          <Says>The sample is the component’s line: the two class names the dials choose arrive as side and align, and
            the browser’s element reads, for this page’s choice, {side} {align}.</Says>
        </Words>
        <Codes>
          <Snippet label="TS" lines={carve.span(bannersSource, '<section id="banners"', "className={classNames('banners'")}/>
          <Snippet label="CSS" lines={[
            ...carve.span(bannersCss, '.banners {', 'z-index: 3;'), gap,
            ...carve.unit(bannersCss, `.${side} {`), gap,
            ...carve.unit(alignSheet[align], `.${align} {`)
          ]}/>
        </Codes>
      </Step>
      <Step title="Style each banner">
        <Words want="A banner is read at a glance, by someone busy with something else.">
          <Says>Each message sits in a paragraph with the class news. Its look comes from classes shared across this
            site: field for the background, rounded-corners, floating for the shadow, alarm-ink for the message’s color,
            and hairline-outline for a thin border in that color. The dismiss button is a square of fixed size that does
            not shrink when the message is long. Its look is shared classes too: borderless and unfilled take off the
            browser’s own button border and ground, glyph-icon sets the × at the size the site’s icons are drawn, and
            muted-ink grays it.</Says>
        </Words>
        <Codes>
          <Snippet label="CSS" lines={[
            ...carve.unit(bannersCss, '.news {'), gap,
            ...carve.unit(surfaceCss, '.field {'), gap,
            ...carve.unit(surfaceCss, '.rounded-corners {'), gap,
            ...carve.unit(surfaceCss, '.floating {'), gap,
            ...carve.unit(surfaceCss, '.alarm-ink {'), gap,
            ...carve.unit(surfaceCss, '.hairline-outline {'), gap,
            ...carve.unit(bannersCss, '.dismiss {'), gap,
            ...carve.unit(surfaceCss, '.borderless {'), gap,
            ...carve.unit(surfaceCss, '.unfilled {'), gap,
            ...carve.unit(typographyCss, '.glyph-icon {'), gap,
            ...carve.unit(surfaceCss, '.muted-ink {')
          ]}/>
        </Codes>
      </Step>
    </Steps>
  </Story>;
};
