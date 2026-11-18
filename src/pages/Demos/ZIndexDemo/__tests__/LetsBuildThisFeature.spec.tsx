import {render} from '@testing-library/react';
import {TestApp} from '@__test_support/TestApp';
import {demosAt, demoTabs, pageFoot} from '@pages/Demos/__test_support';
import {explanation} from '@pages/Demos/Recipe/__test_support';
import {zIndexTab} from '@pages/Demos/ZIndexDemo/__test_support';

const buildThisFeature = 'z-index/lets-build-this-feature';
const title = 'Let’s build this feature';

describe('let’s build this feature, on its own page', () => {
  test('should say its place in the z-index book', async () => {
    render(<TestApp at={demosAt(buildThisFeature)}/>);

    expect(await zIndexTab.place()).toHaveTextContent('Z-index · part 6 of 6');
  });

  test('should link part two, where the z-index it assumes stops counting, to its page with the raised card carried', async () => {
    render(<TestApp at={demosAt(buildThisFeature, '?raised=second')}/>);

    const opener = explanation.opener(await explanation.part(title));

    expect(explanation.linkNamed(opener, 'Why 9999 still loses')).toHaveAttribute('href', demosAt('z-index/why-9999-still-loses', '?raised=second'));
  });

  test('should link part five, the last part it assumes, to its page with the raised card carried', async () => {
    render(<TestApp at={demosAt(buildThisFeature, '?raised=second')}/>);

    const opener = explanation.opener(await explanation.part(title));

    expect(explanation.linkNamed(opener, 'Why a fixed banner still loses'))
      .toHaveAttribute('href', demosAt('z-index/why-a-fixed-banner-still-loses', '?raised=second'));
  });

  test('should link part four, which explains the component, state and event it assumes, to its page with the raised card carried', async () => {
    render(<TestApp at={demosAt(buildThisFeature, '?raised=second')}/>);

    const opener = explanation.opener(await explanation.part(title));

    expect(explanation.linkNamed(opener, 'Why the popover wins')).toHaveAttribute('href', demosAt('z-index/why-the-popover-wins', '?raised=second'));
  });

  test('should show the banner dials it builds with', async () => {
    render(<TestApp at={demosAt(buildThisFeature)}/>);

    expect(await zIndexTab.findBannerControls()).toBeInTheDocument();
  });

  test('should lead back to part five’s page, with the raised card carried', async () => {
    render(<TestApp at={demosAt(buildThisFeature, '?raised=second')}/>);

    expect(await pageFoot.leadsOn('the z-index parts')).toEqual([
      ['Previous: 5. Why a fixed banner still loses', demosAt('z-index/why-a-fixed-banner-still-loses', '?raised=second')]
    ]);
  });

  test('should title the page with the tab and the part', async () => {
    render(<TestApp at={demosAt(buildThisFeature)}/>);

    expect(await demoTabs.title('Demos Z-index · Let’s build this feature')).toBeInTheDocument();
  });

  test('should keep Z-index as the current tab', async () => {
    render(<TestApp at={demosAt(buildThisFeature)}/>);

    expect(await demoTabs.current()).toEqual(['Z-index']);
  });
});

describe('let’s build this feature, on the tab', () => {
  test('should link its title to its page, with the raised card carried', async () => {
    render(<TestApp at={demosAt('z-index', '?raised=second')}/>);

    const listing = await explanation.part(title);

    expect(explanation.linkNamed(listing, title)).toHaveAttribute('href', demosAt(buildThisFeature, '?raised=second'));
  });
});
