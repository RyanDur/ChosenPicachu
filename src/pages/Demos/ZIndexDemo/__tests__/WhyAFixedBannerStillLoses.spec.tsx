import {render} from '@testing-library/react';
import {TestApp} from '@__test_support/TestApp';
import {demosAt, demoTabs, pageFoot, partsIndex} from '@pages/Demos/__test_support';
import {explanation} from '@pages/Demos/Recipe/__test_support';
import {bannerExhibit, zIndexTab} from '@pages/Demos/ZIndexDemo/__test_support';

const fixedBanner = 'z-index/why-a-fixed-banner-still-loses';
const title = 'Why a fixed banner still loses';

describe('why a fixed banner still loses, on its own page', () => {
  test('should say its place in the z-index book', async () => {
    render(<TestApp at={demosAt(fixedBanner)}/>);

    expect(await zIndexTab.place()).toHaveTextContent('Z-index · part 6 of 7');
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

  test('should show the two Raise a banner buttons it explains', async () => {
    render(<TestApp at={demosAt(fixedBanner)}/>);
    const banners = await bannerExhibit.find();

    expect(bannerExhibit.button(banners, 'Raise a banner, the old way')).toBeInTheDocument();
    expect(bannerExhibit.button(banners, 'Raise a banner, the site’s own')).toBeInTheDocument();
  });

  test('should ask which card is on top', async () => {
    render(<TestApp at={demosAt(fixedBanner)}/>);

    expect(await explanation.part('Which card is on top?')).toBeInTheDocument();
  });

  test('should title which card is on top as a section of the part, a level below the part’s title', async () => {
    render(<TestApp at={demosAt(fixedBanner)}/>);

    expect(explanation.sectionTitles(await explanation.part(title))).toContain('Which card is on top?');
  });

  test('should lead back to part five’s page and on to part seven’s page, by number and title, with the raised card carried', async () => {
    render(<TestApp at={demosAt(fixedBanner, '?raised=second')}/>);

    expect(await pageFoot.leadsOn()).toEqual([
      ['Previous: 5. Why the popover wins', demosAt('z-index/why-the-popover-wins', '?raised=second')],
      ['Next: 7. Let’s build this feature', demosAt('z-index/lets-build-this-feature', '?raised=second')]
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
});

describe('why a fixed banner still loses, on the tab', () => {
  test('should link its title to its page, with the raised card carried', async () => {
    render(<TestApp at={demosAt('z-index', '?raised=second')}/>);

    const listing = partsIndex.entryOf(await partsIndex.find(), title);

    expect(explanation.linkNamed(listing, title)).toHaveAttribute('href', demosAt(fixedBanner, '?raised=second'));
  });
});
