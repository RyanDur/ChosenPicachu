import {FC} from 'react';
import {Mdn, Snippet, lines, carve} from '../Recipe';
import {MenuInTheTopLayer} from './MenuInTheTopLayer';
import exhibitSource from './MenuInTheTopLayer.tsx?sample';
import menuCss from '@components/Menu/Menu.css?sample';
import itemSource from '@components/Menu/Item.tsx?sample';
import {PartLink} from './PartLink';
import {PartTermLink} from './PartTermLink';
import '../Runs.css';

export const WhyThePopoverWins: FC = () => <>
  <MenuInTheTopLayer/>
  <ol className="runs card rounded-corners lifted padded">
    <li className="run">
      <p className="paragraph">React is the library this site’s script is written in. A component is a function that
        writes a piece of the page from what it is given, and writes it again when what it holds changes; what it
        holds and renders from is its state.</p>
    </li>
    <li className="run">
      <p className="paragraph">What a component writes is still an element: a button it renders is a button, with the
        keys and the role that come with it, and its look still comes from the style sheet.</p>
    </li>
    <li className="run">
      <p className="paragraph">The button names its list with popovertarget, and the list is
        marked <Mdn path="Web/HTML/Global_attributes/popover">popover</Mdn>, both part of
        the <Mdn path="Web/API/Popover_API">Popover API</Mdn>. With that, the browser opens and closes it with
        no script, closes it on Escape or a click outside it, and gives focus back to the button when focus was in the
        list. Each choice is a button that closes the list with popovertargetaction set to hide.</p>
      <Snippet label="HTML" lines={carve.between(exhibitSource, '<button type="button"', '</ul>')}/>
    </li>
    <li className="run">
      <p className="paragraph">The site’s other menus are built from three components: Menu, Entry and Item. They
        write one element each: a menu, an li, which is one item of a list, and a button. This list is not a Menu,
        because Menu places its list under the button, and this exhibit shows a list with no placement.</p>
      <p className="paragraph"><code className="monospaced">Item</code> gives its button the site’s shared classes
        that set its look. I leave a menu’s look to the page that uses it, so the page
        passes <code className="monospaced">Menu</code> those classes, as the sample shows.</p>
      <Snippet label="TS" lines={carve.unit(itemSource, 'export const Item')}/>
    </li>
    <li className="run">
      <p className="paragraph">The button that opens the menu carries a tabIndex of 0, as its sample shows, and so
        does each choice in the menu. That is the HTML
        attribute <Mdn path="Web/HTML/Global_attributes/tabindex">tabindex</Mdn>, spelled the way
        React spells it. A tabindex of 0 asks the browser to stop on the element when
        Tab moves focus. A button stops Tab by itself in most browsers, but by default Safari moves Tab only to text
        fields and to elements that ask for it.</p>
      <Snippet label="HTML" lines={carve.between(exhibitSource, '<button type="button" tabIndex={0} className="button primary', '</button>')}/>
    </li>
    <li className="run">
      <p className="paragraph">Script adds one thing, and it waits for an event. An event is the browser telling the
        page that something happened, such as a click, a key or a popover opening, and script can ask to hear it. When
        the reader ticks or clears the checkbox, the browser sends a change event. Script writes card-one-z into the
        address, and the exhibit reads its words from there, so a copied link opens the same way.</p>
    </li>
    <li className="run">
      <p className="paragraph">With the old way, any card around the menu that forms a stacking context traps it, and
        script has to open it, close it and watch for clicks outside, as card one’s list
        in <PartLink part="what-else-forms-a-stacking-context"/> shows. The new way costs placement. A list in the top
        layer is placed against the window, not its card, so it no longer sits under its button by itself.</p>
    </li>
    <li className="run">
      <p className="paragraph">The site’s Menu component places a menu
        with <Mdn path="Web/CSS/position-area">position-area</Mdn>, below the button that opened it or above it when
        there is no room below, and where a browser has no position-area, it centers the menu on the screen.
        In the style sheet the placement sits under <code className="monospaced">&amp;[popover]</code>, which reads as
        a menu that is also a popover. The placement is measured from an anchor, and a popover’s anchor is the button
        that opened it. A menu that is not a popover gets no anchor from the button that opens it, so
        the <PartTermLink part="why-third-is-on-top">rule</PartTermLink> leaves
        that menu out. Card one’s list in <PartLink part="what-else-forms-a-stacking-context"/> names
        its own anchor.</p>
      <Snippet label="CSS" lines={[
        ...carve.between(menuCss, '.menu {', 'position-try-fallbacks: flip-block;'), lines.blank,
        ...carve.unit(menuCss, '@supports not (position-area: block-end) {')
      ]}/>
    </li>
  </ol>
</>;
