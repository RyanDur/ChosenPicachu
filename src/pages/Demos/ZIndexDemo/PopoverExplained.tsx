import {FC} from 'react';
import {Mdn, plain, Snippet} from '../Recipe';
import {span, unit} from '../Recipe/carve';
import {AboveThePage} from './Diagrams';
import topLayerSource from './TopLayerMenu.tsx?raw';
import menuCss from '../../../styles/menu.css?raw';
import '../Recipe/Runs.css';

const gap = plain(' ');

export const PopoverExplained: FC = () =>
  <section aria-labelledby="popover-wins-heading" className="stacking-part">
    <h3 id="popover-wins-heading" className="title bold">Why the popover wins</h3>
    <ol className="runs card rounded-corners lifted padded">
      <li className="run">
        <p className="paragraph">The list from Sort by, in the top layer, opens over card two every time, with the box
          checked or not. It is a popover, an element the browser shows on top and hides again by itself, and a
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
            API</Mdn> does all of it. The only script is a click on each choice, which keeps the pick so the button can name it. Each
          button carries a tabIndex, because by default Safari moves Tab only to text fields
          and to elements that ask for it.</p>
        <Snippet label="HTML" lines={span(topLayerSource, '<button type="button"', '</menu>')}/>
      </li>
      <li className="run">
        <p className="paragraph">With the old way, any card around the menu that forms a stacking context traps it, and
          script has to open it, close it and watch for clicks outside. The new way costs placement. A menu in the top
          layer is placed against the window, not its card, so it no longer sits under its button by itself. The site’s
          menu.css places it with <Mdn path="Web/CSS/position-area">position-area</Mdn>, beside the button that opened
          it, and where a browser has no position-area, it centres the menu on the screen.</p>
        <Snippet label="CSS" lines={[
          ...span(menuCss, '.menu {', 'width: var(--base-x-25);'), gap,
          ...unit(menuCss, '@supports not (position-area: block-end) {')
        ]}/>
      </li>
    </ol>
  </section>;
