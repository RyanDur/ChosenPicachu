import {FC} from 'react';

export const ZIndexIntroduction: FC = () =>
  <header className="tab-introduction">
    <p className="paragraph">Where two boxes on a page overlap, the browser draws one over the other. z-index is the CSS
      property for changing which.</p>
    <p className="paragraph">It reads like one ranking for the whole page, where the biggest number wins. So when a menu
      opens under a card, or a banner is covered by something scrolling past, the usual fix is a bigger number. Then 9999
      loses too.</p>
    <p className="paragraph">This page’s view is that a bigger number is the wrong fix. A z-index is compared only inside a
      group of boxes, called a stacking context, and most of this page is about that group: what makes one, what it traps,
      and the browser’s own way out of it, the top layer.</p>
    <p className="paragraph">By the end you can say why one box is drawn over another, why a z-index of 9999 can still
      lose, and how a popover, an element the browser itself shows and hides, is drawn over everything on the
      page. The last part builds this site’s banner that
      way. The first exhibit below is a pile of three cards with no z-index at all. Raise First with the pills and watch
      it come to the top.</p>
  </header>;
