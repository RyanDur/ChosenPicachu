import {FC} from 'react';
import {Codes, Mdn, Says, Snippet, Step, Steps, Story, Words, Tell, aside, plain} from '../../Recipe';
import {span, unit} from '../../Recipe/carve';
import {AlignDial, SideDial} from '../../Controls';
import bannersSource from '@components/Banners/Banners.tsx?raw';
import bannersCss from '@components/Banners/Banners.css?raw';
import '../../Recipe/Recipe.css';

const gap = plain(' ');

export const TopLayerRecipe: FC = () =>
  <Story param="news" id="top"
         can="The user sees the news above everything"
         soThat="no stacking context can bury the news">
    <Tell>We could give the banner a huge z-index, but z-index only ranks siblings inside
      one stacking context, and any ancestor with a transform, a filter, or a z-index of
      its own starts a new one; your 9999 is local the moment that happens. So the panel
      is a <Mdn path="Web/API/Popover_API">popover</Mdn>, and the platform lifts it to
      the <Mdn path="Glossary/Top_layer">top layer</Mdn>, a place the cascade of stacking
      contexts cannot reach.</Tell>
    <Steps>
      <Step title="Claim the top layer">
        <Words want="A bigger number cannot win an argument with a stacking context. The news needs a layer that sits above all of them.">
          <Says>The panel is a section with popover set to manual: manual keeps light
            dismiss out of it, so the news does not vanish on a stray click. Its role
            is <Mdn path="Web/Accessibility/ARIA/Reference/Roles/alert_role">alert</Mdn>,
            so a screen reader announces what arrives without being asked to look.</Says>
        </Words>
        <Codes>
          <Snippet label="CSS" foil lines={[
            plain('.banners {'),
            plain('  position: fixed;'),
            plain('  z-index: 9999;'),
            plain('}'),
            aside('/* an ancestor with a transform starts a new stacking context; 9999 is now local */')
          ]}/>
          <Snippet label="JS" lines={[
            ...span(bannersSource, 'return <section', '</section>;')
          ]}/>
        </Codes>
      </Step>
      <Step title="Show it when there is news">
        <Words want="The top layer is not a place you sit; it is a place you enter. The panel should rise when news arrives and leave when the last of it is dismissed.">
          <Says>An effect watches the count. showPopover lifts the panel when the first
            banner arrives, hidePopover returns it when the wall is clear, and
            matches(':popover-open') keeps both calls honest so neither runs twice.</Says>
        </Words>
        <Codes>
          <Snippet label="JS" lines={[
            ...unit(bannersSource, 'useEffect(() => {')
          ]}/>
        </Codes>
      </Step>
      <Step title="Stand at your station"
            dial={<><SideDial name="station-side"/><AlignDial name="station-align"/></>}>
        <Words want="Nine stations, and no arithmetic: the platform already centers a popover.">
          <Says>The UA stylesheet gives every popover inset 0 and margin auto, which is
            centering. Each station just turns one auto margin into a gap, so top
            center costs one line and so does every other station.</Says>
        </Words>
        <Codes>
          <Snippet label="CSS" lines={[
            ...span(bannersCss, '&.top {', '&.right { margin-inline: auto var(--base-x-2); }')
          ]}/>
        </Codes>
      </Step>
      <Step title="Dress the news">
        <Words want="A banner is read at a glance, in the corner of an eye already busy with something else.">
          <Says>The card is the news element inside each trouble, dressed in the house
            style, and the dismiss button gives the whole target height so a hurried
            pointer still lands.</Says>
        </Words>
        <Codes>
          <Snippet label="CSS" lines={[
            ...unit(bannersCss, '.news {'), gap,
            ...unit(bannersCss, '.dismiss {')
          ]}/>
        </Codes>
      </Step>
    </Steps>
  </Story>;
