import {render} from '@testing-library/react';
import {TestApp} from '@__test_support/TestApp';
import {demosAt, demoTabs, pageFoot, partsIndex} from '@pages/Demos/__test_support';
import {explanation} from '@pages/Demos/Recipe/__test_support';
import {zIndexTab} from '@pages/Demos/ZIndexDemo/__test_support';

const buildThisFeature = 'z-index/lets-build-this-feature';
const title = 'Let’s build this feature';

describe('let’s build this feature, on its own page', () => {
  test('should say its place in the z-index book', async () => {
    render(<TestApp at={demosAt(buildThisFeature)}/>);

    expect(await zIndexTab.place()).toHaveTextContent('Z-index · part 7 of 7');
  });

  test('should link why Third is on top, the first part it assumes, to its page with the raised card carried', async () => {
    render(<TestApp at={demosAt(buildThisFeature, '?raised=second')}/>);

    const opener = explanation.opener(await explanation.part(title));

    expect(explanation.linkNamed(opener, 'Why Third is on top')).toHaveAttribute('href', demosAt('z-index/why-third-is-on-top', '?raised=second'));
  });

  test('should link why a fixed banner still loses, the last part it assumes, to its page with the raised card carried', async () => {
    render(<TestApp at={demosAt(buildThisFeature, '?raised=second')}/>);

    const opener = explanation.opener(await explanation.part(title));

    expect(explanation.linkNamed(opener, 'Why a fixed banner still loses'))
      .toHaveAttribute('href', demosAt('z-index/why-a-fixed-banner-still-loses', '?raised=second'));
  });

  test('should link why the popover wins, which explains the component, state and event it assumes, to its page with the raised card carried', async () => {
    render(<TestApp at={demosAt(buildThisFeature, '?raised=second')}/>);

    const opener = explanation.opener(await explanation.part(title));

    expect(explanation.linkNamed(opener, 'Why the popover wins')).toHaveAttribute('href', demosAt('z-index/why-the-popover-wins', '?raised=second'));
  });

  test('should show the banner dials it builds with', async () => {
    render(<TestApp at={demosAt(buildThisFeature)}/>);

    expect(await zIndexTab.findBannerControls()).toBeInTheDocument();
  });

  test('should lead back to why a fixed banner still loses and on to the drag sort tab, with the raised card carried', async () => {
    render(<TestApp at={demosAt(buildThisFeature, '?raised=second')}/>);

    expect(await pageFoot.leadsOn()).toEqual([
      ['Previous: 6. Why a fixed banner still loses', demosAt('z-index/why-a-fixed-banner-still-loses', '?raised=second')],
      ['Next tab: Drag sort', demosAt('drag-and-drop', '?raised=second')]
    ]);
  });

  test('should title the page with its tab', async () => {
    render(<TestApp at={demosAt(buildThisFeature)}/>);

    expect(await demoTabs.title('Demos Z-index')).toBeInTheDocument();
  });

  test('should keep Z-index as the current tab', async () => {
    render(<TestApp at={demosAt(buildThisFeature)}/>);

    expect(await demoTabs.currentButNotThePage()).toEqual(['Z-index']);
  });
});

describe('let’s build this feature, on the tab', () => {
  test('should link its title to its page, with the raised card carried', async () => {
    render(<TestApp at={demosAt('z-index', '?raised=second')}/>);

    const listing = partsIndex.entryOf(await partsIndex.find(), title);

    expect(explanation.linkNamed(listing, title)).toHaveAttribute('href', demosAt(buildThisFeature, '?raised=second'));
  });
});
