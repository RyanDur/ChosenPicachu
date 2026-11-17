import {render} from '@testing-library/react';
import {TestApp} from '@__test_support/TestApp';
import {demosAt, demoTabs, pageFoot} from '@pages/Demos/__test_support';
import {explanation} from '@pages/Demos/Recipe/__test_support';
import {bannerExhibit, zIndexTab} from '@pages/Demos/ZIndexDemo/__test_support';

const fixedBanner = 'z-index/why-a-fixed-banner-still-loses';
const title = 'Why a fixed banner still loses';
const opening = /^A banner pinned to the window with a z-index of 9999/;

describe('why a fixed banner still loses, on its own page', () => {
  test('should say its place in the z-index book', async () => {
    render(<TestApp at={demosAt(fixedBanner)}/>);

    expect(await zIndexTab.place()).toHaveTextContent('Z-index · part 5 of 6');
  });

  test('should link part two, which it builds on, to its page with the raised card carried', async () => {
    render(<TestApp at={demosAt(fixedBanner, '?raised=second')}/>);

    const opener = explanation.saying(await explanation.part(title), opening);

    expect(explanation.linkNamed(opener, 'Why 9999 still loses')).toHaveAttribute('href', demosAt('z-index/why-9999-still-loses', '?raised=second'));
  });

  test('should link part three, which it builds on, to its page with the raised card carried', async () => {
    render(<TestApp at={demosAt(fixedBanner, '?raised=second')}/>);

    const opener = explanation.saying(await explanation.part(title), opening);

    expect(explanation.linkNamed(opener, 'What else forms a stacking context'))
      .toHaveAttribute('href', demosAt('z-index/what-else-forms-a-stacking-context', '?raised=second'));
  });

  test('should show the two Raise a banner buttons it explains', async () => {
    render(<TestApp at={demosAt(fixedBanner)}/>);

    expect(await bannerExhibit.find()).toBeInTheDocument();
  });

  test('should ask which card is on top', async () => {
    render(<TestApp at={demosAt(fixedBanner)}/>);

    expect(await explanation.part('Which card is on top?')).toBeInTheDocument();
  });

  test('should title which card is on top as a section of the part, a level below the part’s title', async () => {
    render(<TestApp at={demosAt(fixedBanner)}/>);

    expect(explanation.sectionTitles(await explanation.part(title))).toContain('Which card is on top?');
  });

  test('should lead back to part four’s page and on to part six on the tab, by number and title, with the raised card carried', async () => {
    render(<TestApp at={demosAt(fixedBanner, '?raised=second')}/>);

    expect(await pageFoot.leadsOn('the z-index parts')).toEqual([
      ['Previous: 4. Why the popover wins', demosAt('z-index/why-the-popover-wins', '?raised=second')],
      ['Next: 6. Let’s build this feature', `${demosAt('z-index', '?raised=second')}#build-this-feature-heading`]
    ]);
  });

  test('should title the page with the tab and the part', async () => {
    render(<TestApp at={demosAt(fixedBanner)}/>);

    expect(await demoTabs.title('Demos Z-index · Why a fixed banner still loses')).toBeInTheDocument();
  });

  test('should keep Z-index as the current tab', async () => {
    render(<TestApp at={demosAt(fixedBanner)}/>);

    expect(await demoTabs.current()).toEqual(['Z-index']);
  });
});

describe('why a fixed banner still loses, on the tab', () => {
  test('should link its title to its page, with the raised card carried', async () => {
    render(<TestApp at={demosAt('z-index', '?raised=second')}/>);

    const listing = await explanation.part(title);

    expect(explanation.linkNamed(listing, title)).toHaveAttribute('href', demosAt(fixedBanner, '?raised=second'));
  });
});
