import {render} from '@testing-library/react';
import {Paths} from '@navigation';
import {TestApp} from '@__test_support/TestApp';
import {demosAt, demoTabs, pageFoot, partsIndex} from '@pages/Demos/__test_support';
import {explanation} from '@pages/Demos/Recipe/__test_support';
import {bannerAtTheEdge, zIndexTab} from '@pages/Demos/ZIndexDemo/__test_support';

const fixedBanner = 'z-index/why-a-fixed-banner-still-loses';
const title = 'Why a fixed banner still loses';

describe('why a fixed banner still loses, on its own page', () => {
  test('should say its place in the z-index book', async () => {
    render(<TestApp at={demosAt(fixedBanner)}/>);

    expect(await zIndexTab.place()).toHaveTextContent('Z-index · part 5 of 7');
  });

  test('should link why 9999 still loses, which it builds on, to its page with the raised card carried', async () => {
    render(<TestApp at={demosAt(fixedBanner, '?raised=second')}/>);

    const opener = explanation.opener(await explanation.part(title));

    expect(explanation.linkNamed(opener, 'Why 9999 still loses')).toHaveAttribute('href', demosAt('z-index/why-9999-still-loses', '?raised=second'));
  });

  test('should link what else forms a stacking context, which it builds on, to its page with the raised card carried', async () => {
    render(<TestApp at={demosAt(fixedBanner, '?raised=second')}/>);

    const opener = explanation.opener(await explanation.part(title));

    expect(explanation.linkNamed(opener, 'What else forms a stacking context'))
      .toHaveAttribute('href', demosAt('z-index/what-else-forms-a-stacking-context', '?raised=second'));
  });

  test('should link stacking context, at its first use, to the tab’s page, which defines it', async () => {
    render(<TestApp at={demosAt(fixedBanner)}/>);

    const part = await explanation.part(title);

    expect(explanation.linkNamed(part, 'stacking context')).toHaveAttribute('href', `${Paths.demos}z-index/`);
  });

  test('should say, with the banner written in a card, that card two is drawn over it', async () => {
    render(<TestApp at={demosAt(fixedBanner)}/>);

    expect(await bannerAtTheEdge.verdict()).toHaveTextContent(/^Card two is drawn over the banner\.$/);
  });

  test('should say, with the banner moved to the page, that it is drawn over card two and its dismiss button is the last stop', async () => {
    render(<TestApp at={demosAt(fixedBanner, '?banner=moved-to-the-page')}/>);

    expect(await bannerAtTheEdge.verdict()).toHaveTextContent(
      /^The banner is drawn over card two, and its dismiss button is now the last stop for the Tab key\.$/);
  });

  test('should say, with the banner written in a card, that it is compared with what else is inside card one', async () => {
    render(<TestApp at={demosAt(fixedBanner)}/>);

    expect(await bannerAtTheEdge.line('Compared with:')).toHaveTextContent(
      /^Compared with: what else is inside card one\. Card one, as one box, is then compared with card two\.$/);
  });

  test('should say, with the banner moved to the page, that it is compared with everything at the page’s level', async () => {
    render(<TestApp at={demosAt(fixedBanner, '?banner=moved-to-the-page')}/>);

    expect(await bannerAtTheEdge.line('Compared with:')).toHaveTextContent(
      /^Compared with: everything written at the page’s level, card two included\.$/);
  });

  test('should say, with the banner written in a card, that Tab reaches its dismiss button between Raise a banner and Open', async () => {
    render(<TestApp at={demosAt(fixedBanner)}/>);

    expect(await bannerAtTheEdge.line('Tab order:')).toHaveTextContent(
      /^Tab order: Raise a banner, then the banner’s dismiss button, then Open\./);
  });

  test('should say, with the banner moved to the page, that Tab reaches its dismiss button last', async () => {
    render(<TestApp at={demosAt(fixedBanner, '?banner=moved-to-the-page')}/>);

    expect(await bannerAtTheEdge.line('Tab order:')).toHaveTextContent(
      /^Tab order: Raise a banner, then Open, then the banner’s dismiss button, last on the page\./);
  });

  test('should say, once a bigger number arrives, that the help button is drawn over the banner’s end', async () => {
    render(<TestApp at={demosAt(fixedBanner, '?banner=a-bigger-number-arrives')}/>);

    expect(await bannerAtTheEdge.verdict()).toHaveTextContent(/^The help button is drawn over the banner’s end\.$/);
  });

  test('should say, once a bigger number arrives, that the banner is compared with the help button too', async () => {
    render(<TestApp at={demosAt(fixedBanner, '?banner=a-bigger-number-arrives')}/>);

    expect(await bannerAtTheEdge.line('Compared with:')).toHaveTextContent(
      /^Compared with: everything written at the page’s level, the help button included\.$/);
  });

  test('should say, once a bigger number arrives, that Tab reaches Help after the banner’s dismiss button', async () => {
    render(<TestApp at={demosAt(fixedBanner, '?banner=a-bigger-number-arrives')}/>);

    expect(await bannerAtTheEdge.line('Tab order:')).toHaveTextContent(
      /^Tab order: Raise a banner, then Open, then the banner’s dismiss button, then Help\./);
  });

  test('should say somewhere else we meet the banner once a bigger number arrives', async () => {
    render(<TestApp at={demosAt(fixedBanner, '?banner=moved-to-the-page')}/>);
    const onThePage = (await bannerAtTheEdge.whereWeMeetIt()).textContent;

    await bannerAtTheEdge.stepTo('3 · A bigger number arrives');

    expect(await bannerAtTheEdge.whereWeMeetIt()).not.toHaveTextContent(onThePage ?? '');
  });

  test('should say somewhere else we meet the banner once it moves to the page', async () => {
    render(<TestApp at={demosAt(fixedBanner)}/>);
    const inACard = (await bannerAtTheEdge.whereWeMeetIt()).textContent;

    await bannerAtTheEdge.stepTo('2 · Moved to the page');

    expect(await bannerAtTheEdge.whereWeMeetIt()).not.toHaveTextContent(inACard ?? '');
  });

  test('should open the banner exhibit on the step a copied address names', async () => {
    render(<TestApp at={demosAt(fixedBanner, '?banner=moved-to-the-page')}/>);

    expect(await bannerAtTheEdge.step('2 · Moved to the page')).toBeChecked();
  });

  test('should show the banner’s HTML written inside card one, after the button that raised it, and mark it', async () => {
    render(<TestApp at={demosAt(fixedBanner)}/>);

    expect(await bannerAtTheEdge.htmlLines()).toEqual([
      '<section class="little-card one">',
      '<button>Raise a banner</button>',
      '<p class="banner">… <button>×</button></p>',
      '</section>',
      '<p>text on the page</p>',
      '<section class="little-card two">',
      '<button>Open</button>',
      '</section>'
    ]);
    expect(await bannerAtTheEdge.markedHtml()).toEqual(['<p class="banner">… <button>×</button></p>']);
  });

  test('should show the help button’s HTML after the banner’s, and mark both', async () => {
    render(<TestApp at={demosAt(fixedBanner, '?banner=a-bigger-number-arrives')}/>);

    expect(await bannerAtTheEdge.htmlLines()).toEqual([
      '<section class="little-card one">',
      '<button>Raise a banner</button>',
      '</section>',
      '<p>text on the page</p>',
      '<section class="little-card two">',
      '<button>Open</button>',
      '</section>',
      '<p class="banner">… <button>×</button></p>',
      '<button class="help">Help</button>'
    ]);
    expect(await bannerAtTheEdge.markedHtml()).toEqual([
      '<p class="banner">… <button>×</button></p>',
      '<button class="help">Help</button>'
    ]);
  });

  test('should mark the help button’s 10000 in the CSS once a bigger number arrives', async () => {
    render(<TestApp at={demosAt(fixedBanner, '?banner=a-bigger-number-arrives')}/>);

    expect((await bannerAtTheEdge.markedCss()).join('\n')).toMatch(/^\.help \{[^}]*z-index: 10000;/);
  });

  test('should mark nothing in the CSS while the banner stays the only number at the page’s level', async () => {
    render(<TestApp at={demosAt(fixedBanner, '?banner=moved-to-the-page')}/>);

    expect(await bannerAtTheEdge.markedCss()).toEqual([]);
  });

  test('should show the banner’s HTML moved to the end of the page, and mark it', async () => {
    render(<TestApp at={demosAt(fixedBanner, '?banner=moved-to-the-page')}/>);

    expect(await bannerAtTheEdge.htmlLines()).toEqual([
      '<section class="little-card one">',
      '<button>Raise a banner</button>',
      '</section>',
      '<p>text on the page</p>',
      '<section class="little-card two">',
      '<button>Open</button>',
      '</section>',
      '<p class="banner">… <button>×</button></p>'
    ]);
    expect(await bannerAtTheEdge.markedHtml()).toEqual(['<p class="banner">… <button>×</button></p>']);
  });

  test('should ask which card is on top', async () => {
    render(<TestApp at={demosAt(fixedBanner)}/>);

    expect(await explanation.part('Which card is on top?')).toBeInTheDocument();
  });

  test('should title which card is on top as a section of the part, a level below the part’s title', async () => {
    render(<TestApp at={demosAt(fixedBanner)}/>);

    expect(explanation.sectionTitles(await explanation.part(title))).toContain('Which card is on top?');
  });

  test('should lead back to part four’s page and on to part six’s page, by number and title, with the raised card carried', async () => {
    render(<TestApp at={demosAt(fixedBanner, '?raised=second')}/>);

    expect(await pageFoot.leadsOn()).toEqual([
      ['Previous: 4. What else forms a stacking context', demosAt('z-index/what-else-forms-a-stacking-context', '?raised=second')],
      ['Next: 6. Why the popover wins', demosAt('z-index/why-the-popover-wins', '?raised=second')]
    ]);
  });

  test('should title the page with its tab', async () => {
    render(<TestApp at={demosAt(fixedBanner)}/>);

    expect(await demoTabs.title('Demos Z-index')).toBeInTheDocument();
  });

  test('should keep Z-index as the current tab', async () => {
    render(<TestApp at={demosAt(fixedBanner)}/>);

    expect(await demoTabs.currentButNotThePage()).toEqual(['Z-index']);
  });

  test('should link the old menu it compares itself with to that menu’s page, with the raised card carried', async () => {
    render(<TestApp at={demosAt(fixedBanner, '?raised=second')}/>);

    const part = await explanation.part(title);
    const run = explanation.saying(part, /^The banner in the exhibit is the old-way menu in/);

    expect(explanation.linkNamed(run, 'What else forms a stacking context')).toHaveAttribute('href', demosAt('z-index/what-else-forms-a-stacking-context', '?raised=second'));
  });
});

describe('why a fixed banner still loses, on the tab', () => {
  test('should link its title to its page, with the raised card carried', async () => {
    render(<TestApp at={demosAt('z-index', '?raised=second')}/>);

    const listing = partsIndex.entryOf(await partsIndex.find(), title);

    expect(explanation.linkNamed(listing, title)).toHaveAttribute('href', demosAt(fixedBanner, '?raised=second'));
  });
});
