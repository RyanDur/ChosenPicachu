import {TestApp} from '@__test_support/TestApp';
import {paragraphOpening} from '@__test_support/paragraph';
import {Paths} from '@navigation';
import {demoPage, demosAt, demoTabs} from '@pages/Demos/__test_support';
import {outOfReadingOrder} from '@__test_support/reading-order';
import {render} from '@testing-library/react';
import {seed} from '@components/fibs';
import {explanation, recipeFolds} from '@pages/Demos/Recipe/__test_support';
import {siteBanners, zIndexTab} from '@pages/Demos/ZIndexDemo/__test_support';

beforeEach(() => seed('top-layer'));

describe('the top layer', () => {
  test('the z-index tab opens on its five parts, in order, in the heading outline', async () => {
    render(<TestApp at={demosAt('accordions')}/>);
    await demoTabs.open('Z-index');

    const tab = await demoTabs.arrivedOn('Z-index');

    expect(explanation.partTitles(tab).slice(0, 5))
      .toEqual(['Why Third is on top', 'Why 9999 still loses', 'What else forms a stacking context', 'Why the popover wins', 'Why a fixed banner still loses']);
  });

  test('the user raises a banner from the demo', async () => {
    render(<TestApp at={demosAt('accordions')}/>);
    await demoTabs.open('Z-index');

    await siteBanners.raise();

    expect(siteBanners.standingIn(await siteBanners.pile())).toHaveLength(1);
  });

  test('every press stacks another banner', async () => {
    render(<TestApp at={demosAt('accordions')}/>);
    await demoTabs.open('Z-index');

    await siteBanners.raise();
    await siteBanners.raise();
    await siteBanners.raise();

    expect(siteBanners.standingIn(await siteBanners.pile())).toHaveLength(3);
  });

  test('should head a story The user can have multiple banners', async () => {
    render(<TestApp at={demosAt('accordions')}/>);
    await demoTabs.open('Z-index');

    expect(await demoPage.findTitle('The user can have multiple banners')).toBeVisible();
  });

  test('the dials explain themselves and say their url', async () => {
    render(<TestApp at={demosAt('accordions')}/>);
    await demoTabs.open('Z-index');
    const controls = await zIndexTab.findBannerControls();

    await zIndexTab.choose(controls, 'side', 'Bottom');
    await zIndexTab.choose(controls, 'align', 'Right');
    await zIndexTab.choose(controls, 'entrance', 'Below');
    await zIndexTab.choose(controls, 'stack', 'Left');

    expect(zIndexTab.readingOf(controls, 'side')).toHaveTextContent('The panel holds to the window’s bottom edge.');
    expect(explanation.saying(controls, '?side=bottom&align=right&enter=below&stack=left')).toBeVisible();
  });

  test('the tutorial follows the dials', async () => {
    render(<TestApp at={demosAt('accordions')}/>);
    await demoTabs.open('Z-index');
    const controls = await zIndexTab.findBannerControls();

    const many = recipeFolds.story(await zIndexTab.findFeatureStories(), 'The user can have multiple banners');
    expect(many).toHaveTextContent('the stack grows downward, so the track is a row.');

    await zIndexTab.choose(controls, 'stack', 'Left');

    expect(many).toHaveTextContent('the stack grows leftward, so the track is a column.');
  });

  test('the cards start stacked', async () => {
    render(<TestApp at={demosAt('accordions')}/>);
    await demoTabs.open('Z-index');

    expect(await zIndexTab.findExpand()).toBeInTheDocument();
  });

  test('the button spreads the cards and offers to collapse them', async () => {
    render(<TestApp at={demosAt('accordions')}/>);
    await demoTabs.open('Z-index');

    await zIndexTab.expandCards();

    expect(zIndexTab.collapseOnOffer()).toBeInTheDocument();
    expect(zIndexTab.expandOnOffer()).not.toBeInTheDocument();
  });
});

describe('the banner tutorial’s walked-through story', () => {
  const arriveAtTheTutorial = async (): Promise<HTMLElement> => {
    render(<TestApp at={demosAt('accordions')}/>);
    await demoTabs.open('Z-index');
    return zIndexTab.findFeatureStories();
  };

  test('should link the term user story where it is defined', async () => {
    await arriveAtTheTutorial();

    expect(explanation.linkNamed(paragraphOpening(/^A user story is a card, a conversation and a confirmation/), 'user story')).toHaveAttribute('href', 'https://initialcapacity.io/insights/user-story');
  });

  test('should put the dials before the first story', async () => {
    const tutorial = await arriveAtTheTutorial();

    expect(outOfReadingOrder([
      await zIndexTab.findBannerControls(),
      recipeFolds.story(tutorial, 'The user sees the news over the page')
    ])).toEqual([]);
  });
});

describe('the banner tutorial’s first story', () => {
  const story = 'The user sees the news over the page';

  test('should link the first story up to Why 9999 still loses, Why a fixed banner still loses and What else forms a stacking context', async () => {
    render(<TestApp at={demosAt('accordions')}/>);
    await demoTabs.open('Z-index');
    const news = recipeFolds.story(await zIndexTab.findFeatureStories(), story);

    expect(explanation.linkNamed(news, 'Why 9999 still loses')).toHaveAttribute('href', zIndexTab.fragmentOf('Why 9999 still loses'));
    expect(explanation.linkNamed(news, 'Why a fixed banner still loses')).toHaveAttribute('href', zIndexTab.fragmentOf('Why a fixed banner still loses'));
    expect(explanation.linkNamed(news, 'What else forms a stacking context')).toHaveAttribute('href', zIndexTab.fragmentOf('What else forms a stacking context'));
  });

  test('should head each step with what happens', async () => {
    render(<TestApp at={demosAt('accordions')}/>);
    await demoTabs.open('Z-index');
    const news = await recipeFolds.press(await zIndexTab.findFeatureStories(), story);

    expect(recipeFolds.stepTitles(news))
      .toEqual(['Write the panel last, at the page’s root', 'Show it when there is news', 'Place the panel with two class names', 'Style each banner']);
  });

});

describe('the banner tutorial’s second story', () => {
  const story = 'The user can have multiple banners';

  test('should head each step with what happens', async () => {
    render(<TestApp at={demosAt('z-index', '?stack=left')}/>);
    const many = await recipeFolds.press(await zIndexTab.findFeatureStories(), story);

    expect(recipeFolds.stepTitles(many)).toEqual([
      'Skip a message that is already up',
      'Open a gap in the stack first',
      'Slide in from off screen',
      'Slide out, then close the gap'
    ]);
  });

});

describe('the z-index tab’s introduction', () => {
  test('should say what it assumes from earlier tabs, linking each tab it names', async () => {
    render(<TestApp at={demosAt('z-index')}/>);

    expect(await demoTabs.assumedLinks('Z-index')).toEqual([
      ['accordions tab', `${Paths.demos}accordions/`]
    ]);
  });
});

describe('the banner dials’ readings', () => {
  test('should read, with side=top chosen, “The panel holds to the window’s top edge.”', async () => {
    render(<TestApp at={demosAt('z-index', '?side=top')}/>);

    expect(zIndexTab.readingOf(await zIndexTab.findBannerControls(), 'side')).toHaveTextContent('The panel holds to the window’s top edge.');
  });

  test('should read, with side=middle chosen, “The panel sits in the window’s middle.”', async () => {
    render(<TestApp at={demosAt('z-index', '?side=middle')}/>);

    expect(zIndexTab.readingOf(await zIndexTab.findBannerControls(), 'side')).toHaveTextContent('The panel sits in the window’s middle.');
  });

  test('should read, with side=bottom chosen, “The panel holds to the window’s bottom edge.”', async () => {
    render(<TestApp at={demosAt('z-index', '?side=bottom')}/>);

    expect(zIndexTab.readingOf(await zIndexTab.findBannerControls(), 'side')).toHaveTextContent('The panel holds to the window’s bottom edge.');
  });

  test('should read, with align=left chosen, “The panel holds to the window’s left edge.”', async () => {
    render(<TestApp at={demosAt('z-index', '?align=left')}/>);

    expect(zIndexTab.readingOf(await zIndexTab.findBannerControls(), 'align')).toHaveTextContent('The panel holds to the window’s left edge.');
  });

  test('should read, with align=center chosen, “The browser centers the panel across the window.”', async () => {
    render(<TestApp at={demosAt('z-index', '?align=center')}/>);

    expect(zIndexTab.readingOf(await zIndexTab.findBannerControls(), 'align')).toHaveTextContent('The browser centers the panel across the window.');
  });

  test('should read, with align=right chosen, “The panel holds to the window’s right edge.”', async () => {
    render(<TestApp at={demosAt('z-index', '?align=right')}/>);

    expect(zIndexTab.readingOf(await zIndexTab.findBannerControls(), 'align')).toHaveTextContent('The panel holds to the window’s right edge.');
  });

  test('should read, with enter=above chosen, “A new banner slides in from above the window’s top edge.”', async () => {
    render(<TestApp at={demosAt('z-index', '?enter=above')}/>);

    expect(zIndexTab.readingOf(await zIndexTab.findBannerControls(), 'entrance')).toHaveTextContent('A new banner slides in from above the window’s top edge.');
  });

  test('should read, with enter=below chosen, “A new banner slides in from below the window’s bottom edge.”', async () => {
    render(<TestApp at={demosAt('z-index', '?enter=below')}/>);

    expect(zIndexTab.readingOf(await zIndexTab.findBannerControls(), 'entrance')).toHaveTextContent('A new banner slides in from below the window’s bottom edge.');
  });

  test('should read, with enter=left chosen, “A new banner slides in from past the window’s left edge.”', async () => {
    render(<TestApp at={demosAt('z-index', '?enter=left')}/>);

    expect(zIndexTab.readingOf(await zIndexTab.findBannerControls(), 'entrance')).toHaveTextContent('A new banner slides in from past the window’s left edge.');
  });

  test('should read, with enter=right chosen, “A new banner slides in from past the window’s right edge.”', async () => {
    render(<TestApp at={demosAt('z-index', '?enter=right')}/>);

    expect(zIndexTab.readingOf(await zIndexTab.findBannerControls(), 'entrance')).toHaveTextContent('A new banner slides in from past the window’s right edge.');
  });

  test('should read, with stack=down chosen, “Each new banner goes below the ones already up.”', async () => {
    render(<TestApp at={demosAt('z-index', '?stack=down')}/>);

    expect(zIndexTab.readingOf(await zIndexTab.findBannerControls(), 'stack')).toHaveTextContent('Each new banner goes below the ones already up.');
  });

  test('should read, with stack=up chosen, “Each new banner goes above the ones already up.”', async () => {
    render(<TestApp at={demosAt('z-index', '?stack=up')}/>);

    expect(zIndexTab.readingOf(await zIndexTab.findBannerControls(), 'stack')).toHaveTextContent('Each new banner goes above the ones already up.');
  });

  test('should read, with stack=left chosen, “The stack grows leftward, with the newest banner at the left.”', async () => {
    render(<TestApp at={demosAt('z-index', '?stack=left')}/>);

    expect(zIndexTab.readingOf(await zIndexTab.findBannerControls(), 'stack')).toHaveTextContent('The stack grows leftward, with the newest banner at the left.');
  });

  test('should read, with stack=right chosen, “The stack grows rightward, with the newest banner at the right.”', async () => {
    render(<TestApp at={demosAt('z-index', '?stack=right')}/>);

    expect(zIndexTab.readingOf(await zIndexTab.findBannerControls(), 'stack')).toHaveTextContent('The stack grows rightward, with the newest banner at the right.');
  });
});

describe('the links to other tabs', () => {
  test('should link each term it glosses, and each tab it names, to that tab', async () => {
    render(<TestApp at={demosAt('z-index')}/>);

    const tab = await demoTabs.arrivedOn('Z-index');

    expect(demoPage.linksToTabsIn(tab)).toEqual([
      ['accordions tab', `${Paths.demos}accordions/`],
      ['accordions tab', `${Paths.demos}accordions/`],
      ['dials', `${Paths.demos}accordions/`],
      ['custom property', `${Paths.demos}accordions/`]
    ]);
  });
});
