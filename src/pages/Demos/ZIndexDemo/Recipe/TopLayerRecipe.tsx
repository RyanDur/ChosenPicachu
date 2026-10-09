import {FC} from 'react';
import {useSearchParamsObject} from '@components/search-params';
import {Align, Side, alignParam, sideParam} from '@components/Banners/params';
import {Codes, Mdn, Says, Snippet, Step, Steps, Story, Words, Tell, plain} from '../../Recipe';
import {span, unit} from '../../Recipe/carve';
import {AlignDial, SideDial} from '../../Controls';
import {popoverWinsHeading, stillLosesHeading} from '../part-headings';
import bannersSource from '@components/Banners/Banners.tsx?sample';
import bannersCss from '@components/Banners/Banners.css?sample';
import placementCss from '../../../../styles/placement.css?sample';
import surfaceCss from '../../../../styles/surface.css?sample';
import typographyCss from '../../../../styles/typography.css?sample';
import '../../Recipe/Recipe.css';

const gap = plain(' ');

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

export const topLayerStory = {param: 'news', id: 'top'} as const;

export const TopLayerRecipe: FC = () => {
  const {side = 'top', align = 'center'} = useSearchParamsObject({side: sideParam, align: alignParam});

  return <Story {...topLayerStory}
    can="The user sees the news above everything"
    soThat="no stacking context can bury the news">
    <Tell>We could give the banner a huge z-index. But a z-index counts only inside its own stacking context, the
      term taught above in <a className="signpost" href={`#${stillLosesHeading}`}><cite>Why 9999 still loses</cite></a>. An
      element around the banner starts a new one when its CSS gives it a transform or a filter. A z-index other than
      auto starts one too, but only on an element that is positioned, meaning its position is not static, or that is a
      child of a flex or grid container, the two CSS layouts that arrange their children along a line or in rows and
      columns. Inside a new one, the banner’s 9999 is compared with nothing outside it. So
      the panel is a popover, drawn in the top layer like the new menu
      above. <a className="signpost" href={`#${popoverWinsHeading}`}><cite>Why the popover wins</cite></a> says what
      both are.</Tell>
    <Steps>
      <Step title="Make the panel a popover">
        <Words want="A bigger number does not get the banner out of a stacking context. The news needs a layer above all of them.">
          <Says>The panel is a section with the popover attribute set to manual. The usual value, auto, gives a
            popover light dismiss: a click outside it or the Escape key closes it. A manual popover has no light
            dismiss, so the news stays through a stray click and goes when the code hides it. Its role
            is <Mdn path="Web/Accessibility/ARIA/Reference/Roles/alert_role">alert</Mdn>, so a screen reader, the
            program that reads a page aloud, announces what arrives without being asked.</Says>
        </Words>
        <Codes>
          <Snippet label="TS" lines={[
            ...span(bannersSource, 'return <section', '</section>;')
          ]}/>
        </Codes>
      </Step>
      <Step title="Show it when there is news">
        <Words want="A popover is in the top layer only while it is shown. The panel should be shown when news arrives and hidden when the last of it is dismissed.">
          <Says>A React effect, code that React runs after it has updated the page, runs when the number of banners
            changes. showPopover shows the panel when the first banner arrives, and hidePopover hides it when the last
            one has gone. matches(':popover-open') says whether the panel is shown, so neither call is made twice.</Says>
        </Words>
        <Codes>
          <Snippet label="TS" lines={[
            ...unit(bannersSource, 'useEffect(() => {')
          ]}/>
        </Codes>
      </Step>
      <Step title="Place the panel with two class names"
        dial={<><SideDial name="station-side"/><AlignDial name="station-align"/></>}>
        <Words want="Nine places, and no arithmetic: the browser already centres a popover.">
          <Says>The browser’s own stylesheet, the styles every page starts with, gives a popover a fixed position, a
            size that fits its content, inset: 0 and margin: auto. inset: 0 lets the panel reach each edge of the window.
            It takes only the room its content needs, and the auto margins share the rest, which centres it in the
            window. That stylesheet also gives a popover a border and a background; the panel wears borderless and
            unfilled, which take them off, so only the banners inside it show.</Says>
          <Says>A class for an edge sets the margin on that edge to a fixed gap, so the auto margin opposite takes the
            spare room and the panel holds to that edge. middle and center set auto again: they change nothing, and
            they are there so the choice shows in the class names.</Says>
          <Says>On this page margin-block is the margins above and below the panel, and margin-inline is the ones to
            its left and right. Here, {sideFact[side]} And {alignFact[align]}</Says>
          <Says>The sample is the component’s line: the two class names the dials choose arrive as side and align, and
            the browser’s element reads, for this page’s choice, {side} {align}.</Says>
        </Words>
        <Codes>
          <Snippet label="TS" lines={span(bannersSource, '<section id="banners"', "className={classNames('banners'")}/>
          <Snippet label="CSS" lines={[
            ...unit(bannersCss, `.${side} {`), gap,
            ...unit(align === 'center' ? placementCss : bannersCss, `.${align} {`)
          ]}/>
        </Codes>
      </Step>
      <Step title="Style each banner">
        <Words want="A banner is read at a glance, in the corner of an eye already busy with something else.">
          <Says>Each message sits in a paragraph with the class news. Its look comes from classes shared across this
            site: field for the background, rounded-corners, floating for the shadow, and hairline-outline for a thin
            border in the colour of the message’s text. The dismiss button is a square of fixed size that does not
            shrink when the message is long. Its look is shared classes too: borderless and unfilled take off the
            browser’s own button border and ground, glyph-icon sets the ✕ at the size the site’s icons are drawn, and
            muted-ink greys it.</Says>
        </Words>
        <Codes>
          <Snippet label="CSS" lines={[
            ...unit(bannersCss, '.news {'), gap,
            ...unit(surfaceCss, '.field {'), gap,
            ...unit(surfaceCss, '.rounded-corners {'), gap,
            ...unit(surfaceCss, '.floating {'), gap,
            ...unit(surfaceCss, '.hairline-outline {'), gap,
            ...unit(bannersCss, '.dismiss {'), gap,
            ...unit(surfaceCss, '.borderless {'), gap,
            ...unit(surfaceCss, '.unfilled {'), gap,
            ...unit(typographyCss, '.glyph-icon {'), gap,
            ...unit(surfaceCss, '.muted-ink {')
          ]}/>
        </Codes>
      </Step>
    </Steps>
  </Story>;
};
