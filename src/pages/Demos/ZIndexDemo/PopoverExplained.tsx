import {FC} from 'react';
import {Mdn, plain, Snippet} from '../Recipe';
import {span, unit} from '../Recipe/carve';
import {AboveThePage} from './Diagrams';
import {popoverWinsHeading} from './part-headings';
import topLayerSource from './TopLayerMenu.tsx?sample';
import menuCss from '@components/Menu/Menu.css?sample';
import menuSource from '@components/Menu/Menu.tsx?sample';
import '../Runs.css';

const gap = plain(' ');

export const PopoverExplained: FC = () =>
  <section aria-labelledby={popoverWinsHeading} className="stacking-part">
    <h3 id={popoverWinsHeading} className="title bold">Why the popover wins</h3>
    <ol className="runs card rounded-corners lifted padded">
      <li className="run">
        <p className="paragraph">The list from Sort by, in the top layer, opens over everything around it every time, with
          the box checked or not. It is a popover, an element the browser shows on top and hides again by itself, and a
          popover is shown in the <Mdn path="Glossary/Top_layer">top layer</Mdn>, a layer the browser keeps above the
          whole page for popovers, dialogs and elements shown full screen. Whatever the page stacks, the top layer sits
          over it.</p>
      </li>
      <li className="run">
        <p className="paragraph">The top layer is not inside any stacking context, not even the root one, so no z-index
          on the page is ever compared with it. Card one’s z-index of 1 still forms a layer around the old list, but the
          new list, though it is written inside the card, is painted in the top layer. The browser draws the top layer
          last, so the new menu is drawn over both cards.</p>
        <AboveThePage/>
      </li>
      <li className="run">
        <p className="paragraph">The button names its menu with popovertarget, and the menu is marked{' '}
          <Mdn path="Web/HTML/Global_attributes/popover">popover</Mdn>. With that, the browser opens and closes it with
          no script, closes it on Escape or a click outside it, and gives focus back to the button when focus was in the
          menu. Each choice is a
          button that closes the menu with popovertargetaction set to hide. The <Mdn path="Web/API/Popover_API">Popover
            API</Mdn> does all of it. Menu, Entry and Item are this site’s components for a menu: each writes one
          element, a menu, an li and a button, and dresses it.</p>
        <Snippet label="HTML" lines={[
          ...span(topLayerSource, '<button type="button"', '</Menu>'), gap,
          ...unit(menuSource, 'export const Item')
        ]}/>
      </li>
      <li className="run">
        <p className="paragraph">The button that opens the menu carries a tabIndex of 0, and so does each choice in the
          sample above. That is the HTML attribute <Mdn path="Web/HTML/Global_attributes/tabindex">tabindex</Mdn>, spelled the way
          React spells it, and React is the JavaScript library this site is built with. A tabindex of 0 asks the browser to stop on the element when
          Tab moves focus. A button stops Tab by itself in most browsers, but by default Safari moves Tab only to text
          fields and to elements that ask for it.</p>
        <Snippet label="HTML" lines={span(topLayerSource, '<button type="button" tabIndex={0} className="button primary', '</button>')}/>
      </li>
      <li className="run">
        <p className="paragraph">Script adds two things, and both wait for an event. An event is the browser telling the
          page that something happened, such as a click, a key or a popover opening, and script can ask to hear it. A click
          on each choice keeps the pick, so the button can name it. A toggle on the menu, the event for a popover opening or
          closing, lets the trap above say where the list opened.</p>
      </li>
      <li className="run">
        <p className="paragraph">With the old way, any card around the menu that forms a stacking context traps it, and
          script has to open it, close it and watch for clicks outside. The new way costs placement. A menu in the top
          layer is placed against the window, not its card, so it no longer sits under its button by itself.</p>
      </li>
      <li className="run">
        <p className="paragraph">The menu’s own sheet places it
          with <Mdn path="Web/CSS/position-area">position-area</Mdn>, beside the button that opened it, and where a
          browser has no position-area, it centres the menu on the screen.
          In the sheet the placement sits under <code>&amp;[popover]</code>, which reads as a menu that is also a popover.
          The placement is measured from an anchor, and a popover’s anchor is the button that opened it. A menu that is
          not a popover, like the old list above, has no anchor, so it is left out.</p>
        <Snippet label="CSS" lines={[
          ...span(menuCss, '.menu {', 'position-try-fallbacks: flip-block;'), gap,
          ...unit(menuCss, '@supports not (position-area: block-end) {')
        ]}/>
      </li>
    </ol>
  </section>;
