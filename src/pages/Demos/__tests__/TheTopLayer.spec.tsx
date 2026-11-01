import {TestApp} from '@__test_support/TestApp';
import {paragraphOpening, paragraphReading} from '@__test_support/paragraph';
import {Paths} from '@pages/Paths';
import {demoPage, demosAt, demoTabs} from '@pages/Demos/__test_support';
import {outOfReadingOrder} from '@__test_support/reading-order';
import {render} from '@testing-library/react';
import {seed} from '@components/fibs';
import {explanation, recipeFolds} from '@pages/Demos/Recipe/__test_support';
import {topLayerBanners, zIndexTab} from '@pages/Demos/ZIndexDemo/__test_support';

beforeEach(() => seed('top-layer'));

describe('the top layer', () => {
  test('the z-index tab opens on its five parts, in order, in the heading outline', async () => {
    render(<TestApp at={demosAt('accordions')}/>);
    await demoTabs.open('Z-index');

    const tab = await demoTabs.arrivedOn('Z-index');

    expect(explanation.partTitles(tab).slice(0, 5))
      .toEqual(['Why Third is on top', 'Why 9999 still loses', 'What else forms a stacking context', 'Why the popover wins', 'Why a fixed banner still loses']);
  });

  test('should give the tutorial’s overview a paragraph of its own for the parts above and a banner that sets none, between what it builds and how to use it', async () => {
    render(<TestApp at={demosAt('accordions')}/>);
    await demoTabs.open('Z-index');

    expect(outOfReadingOrder([
      await demoPage.findSays(/^We are going to build this site’s banner/),
      demoPage.says('The parts above show what a z-index does and where it stops counting; the banner sets none.'),
      paragraphOpening(/^Every card below is one of those stories, shortened/)
    ])).toEqual([]);
  });

  test('the user raises a banner from the demo', async () => {
    render(<TestApp at={demosAt('accordions')}/>);
    await demoTabs.open('Z-index');
    const alert = topLayerBanners.pile();
    const alreadyStanding = topLayerBanners.standingIn(alert).length;

    await topLayerBanners.raise();

    expect(topLayerBanners.standingIn(alert)).toHaveLength(alreadyStanding + 1);
  });

  test('every press stacks another banner', async () => {
    render(<TestApp at={demosAt('accordions')}/>);
    await demoTabs.open('Z-index');
    const alert = topLayerBanners.pile();
    const alreadyStanding = topLayerBanners.standingIn(alert).length;

    await topLayerBanners.raise();
    await topLayerBanners.raise();
    await topLayerBanners.raise();

    expect(topLayerBanners.standingIn(alert)).toHaveLength(alreadyStanding + 3);
  });

  test('the tutorial tells the story of the news', async () => {
    render(<TestApp at={demosAt('accordions')}/>);
    await demoTabs.open('Z-index');

    expect(await demoPage.findSays('let’s build this feature')).toBeVisible();
    expect(demoPage.says('The user sees the news above everything')).toBeVisible();
    expect(demoPage.title('The user can have multiple banners')).toBeVisible();
    expect(demoPage.saidAnywhere('Any component can raise a banner')).not.toBeInTheDocument();
    expect(demoPage.saidAnywhere('The news travels, and the pile makes room')).not.toBeInTheDocument();
  });

  test('the dials explain themselves and say their url', async () => {
    render(<TestApp at={demosAt('accordions')}/>);
    await demoTabs.open('Z-index');
    const controls = await zIndexTab.findBannerControls();

    await zIndexTab.choose(controls, 'side', 'Bottom');
    await zIndexTab.choose(controls, 'align', 'Right');
    await zIndexTab.choose(controls, 'entrance', 'Below');
    await zIndexTab.choose(controls, 'stack', 'Left');

    expect(explanation.saying(controls, 'The panel holds to the window’s bottom edge.')).toBeVisible();
    expect(explanation.saying(controls, '?side=bottom&align=right&enter=below&stack=left')).toBeVisible();
  });

  test('the tutorial follows the dials', async () => {
    render(<TestApp at={demosAt('accordions')}/>);
    await demoTabs.open('Z-index');
    const controls = await zIndexTab.findBannerControls();

    expect(demoPage.says(/the stack grows downward, so the track is a row\./)).toBeInTheDocument();

    await zIndexTab.choose(controls, 'stack', 'Left');

    expect(demoPage.says(/the stack grows leftward, so the track is a column\./)).toBeInTheDocument();
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
  const definition = /^A user story is a card, a conversation and a confirmation/;
  const settled = /^The user’s words above settled two things/;
  const clue = /^Each phrase read that way is a clue/;
  const leftOpen = /^The user’s words left open/;
  const leadIn = /^The confirmation is two lines a reader can check/;
  const shortened = /^Every card below is one of those stories, shortened/;

  const arriveAtTheTutorial = async (): Promise<HTMLElement> => {
    render(<TestApp at={demosAt('accordions')}/>);
    await demoTabs.open('Z-index');
    return zIndexTab.findFeatureStories();
  };

  test('should say what a user story is where the tutorial first names one, and that the banner’s is walked through once', async () => {
    await arriveAtTheTutorial();

    expect(paragraphOpening(definition)).toHaveTextContent('A user story is a card, a conversation and a confirmation. The card names who wants what and why. The conversation settles what the card leaves open. The confirmation says what a reader meets when the story is done. Here is the banner’s, walked through once.');
  });

  test('should link the term user story where it is defined', async () => {
    await arriveAtTheTutorial();

    expect(explanation.linkNamed(paragraphOpening(definition), 'user story')).toHaveAttribute('href', 'https://initialcapacity.io/insights/user-story');
  });

  test('should give the banner’s card', async () => {
    await arriveAtTheTutorial();

    expect(paragraphOpening(/^As a reader who missed the news/)).toHaveTextContent('As a reader who missed the news, I want the banner to raise it, so that I do not go looking.');
  });

  test('should read the two settled lines from the user’s words, and say what a screen reader is where it first names one', async () => {
    const tutorial = await arriveAtTheTutorial();

    expect(explanation.saying(tutorial, settled)).toHaveTextContent('The user’s words above settled two things. ‘Tell me’ means the banner speaks up on its own: it is an alert, so a screen reader, the program that reads a page aloud, announces a new note without the reader going to look. ‘Do not hide the note under the thing that broke’ means the banner sits in the top layer, where nothing on the page is drawn over it.');
  });

  test('should say what a clue is in a run of its own', async () => {
    const tutorial = await arriveAtTheTutorial();

    expect(explanation.saying(tutorial, clue)).toHaveTextContent('Each phrase read that way is a clue: a line of what the user said, and what it commits the build to.');
  });

  test('should say what the user’s words left open, and that the dials and the cards answer it', async () => {
    const tutorial = await arriveAtTheTutorial();

    expect(explanation.saying(tutorial, leftOpen)).toHaveTextContent('The user’s words left open where on the window the note sits, how it arrives, and how several stand at once. The dials below are those answers, and the cards below settle them one at a time.');
  });

  test('should say what the confirmation is before its lines', async () => {
    const tutorial = await arriveAtTheTutorial();

    expect(explanation.saying(tutorial, leadIn)).toHaveTextContent('The confirmation is two lines a reader can check against the page.');
  });

  test('should quote each settled phrase from the ask on the page', async () => {
    const tutorial = await arriveAtTheTutorial();
    const ask = explanation.saying(tutorial, /^When something breaks/).textContent;

    expect(ask).toContain('tell me');
    expect(ask).toContain('do not hide the note under the thing that broke');
  });

  test('should give the confirmation as two given-when-then lines', async () => {
    const tutorial = await arriveAtTheTutorial();

    expect(zIndexTab.confirmationIn(tutorial)).toEqual([
      'Given a page with the news raised, when a card with a z-index of its own scrolls past, then the note stays on top.',
      'Given a reader with a screen reader, when news is raised, then it is read out without the reader going to look.'
    ]);
  });

  test('should say what the cards below keep of a story, then how to use the dials and the links', async () => {
    await arriveAtTheTutorial();

    expect(paragraphOpening(shortened)).toHaveTextContent('Every card below is one of those stories, shortened. Its headline says who gets what and its second line says why; the steps inside say what each conversation settled, with the real code from this site, so what you read is what runs. Its confirmation is a journey this site runs. The dials below place the stack, choose its entrance and pick how it grows. Where a step depends on a dial, that dial sits on the step. The links go to MDN, if you want more.');
  });

  test('should walk the ask, the user story, its card, conversation and confirmation, and how every card is told, before the dials and the first card', async () => {
    const tutorial = await arriveAtTheTutorial();

    expect(outOfReadingOrder([
      explanation.saying(tutorial, /^When something breaks/),
      paragraphOpening(definition),
      paragraphOpening(/^As a reader who missed the news/),
      explanation.saying(tutorial, settled),
      explanation.saying(tutorial, clue),
      explanation.saying(tutorial, leftOpen),
      explanation.saying(tutorial, leadIn),
      explanation.saying(tutorial, /^Given a page with the news raised/),
      paragraphOpening(shortened),
      await zIndexTab.findBannerControls(),
      recipeFolds.story(tutorial, 'The user sees the news above everything')
    ])).toEqual([]);
  });
});

describe('the banner tutorial’s first story', () => {
  const story = 'The user sees the news above everything';

  test('should point up to where a stacking context is taught and to the part that shows what forms one, without teaching either again', async () => {
    render(<TestApp at={demosAt('accordions')}/>);
    await demoTabs.open('Z-index');
    const news = recipeFolds.story(await zIndexTab.findFeatureStories(), story);

    expect(news).toHaveTextContent('An element around the banner forms a stacking context by the ways What else forms a stacking context shows. position: fixed, which pins the banner to the window, does not lift it out of that context, as Why a fixed banner still loses shows. Inside that context, the banner’s 9999 is compared with nothing outside it.');
    expect(news).not.toHaveTextContent('the two CSS layouts that arrange their children');
    expect(explanation.linkNamed(news, 'Why 9999 still loses')).toHaveAttribute('href', zIndexTab.fragmentOf('Why 9999 still loses'));
    expect(explanation.linkNamed(news, 'Why a fixed banner still loses')).toHaveAttribute('href', zIndexTab.fragmentOf('Why a fixed banner still loses'));
    expect(explanation.linkNamed(news, 'What else forms a stacking context')).toHaveAttribute('href', zIndexTab.fragmentOf('What else forms a stacking context'));
  });

  test('should say what inset: 0 does where step 3 first names it', async () => {
    render(<TestApp at={demosAt('accordions')}/>);
    await demoTabs.open('Z-index');

    expect(recipeFolds.story(await zIndexTab.findFeatureStories(), story)).toHaveTextContent('inset: 0 and margin: auto. inset: 0 lets the panel reach each edge of the window. It takes only the room its content needs, and the auto margins share the rest, which centers it in the window.');
  });

  test('should not call stacking contexts a cascade', async () => {
    render(<TestApp at={demosAt('accordions')}/>);
    await demoTabs.open('Z-index');

    expect(recipeFolds.story(await zIndexTab.findFeatureStories(), story)).not.toHaveTextContent(/cascade/);
  });

  test('should call the panel a popover drawn in the top layer, and point up to Why the popover wins instead of defining both again', async () => {
    render(<TestApp at={demosAt('accordions')}/>);
    await demoTabs.open('Z-index');
    const news = recipeFolds.story(await zIndexTab.findFeatureStories(), story);

    expect(news).toHaveTextContent('So I made the panel a popover, drawn in the top layer like the new menu above. Why the popover wins says what both are.');
    expect(explanation.linkNamed(news, 'Why the popover wins')).toHaveAttribute('href', zIndexTab.fragmentOf('Why the popover wins'));
    expect(news).not.toHaveTextContent(/hidden until the code shows it|No z-index on the page can put anything over the top layer/);
  });

  test('should head each step with what happens', async () => {
    render(<TestApp at={demosAt('accordions')}/>);
    await demoTabs.open('Z-index');
    const news = await recipeFolds.press(await zIndexTab.findFeatureStories(), story);

    expect(recipeFolds.stepTitles(news))
      .toEqual(['Make the panel a popover', 'Show it when there is news', 'Place the panel with two class names', 'Style each banner']);
  });

  test('should name a screen reader in the first story without defining it again', async () => {
    render(<TestApp at={demosAt('accordions')}/>);
    await demoTabs.open('Z-index');
    const news = recipeFolds.story(await zIndexTab.findFeatureStories(), story);

    expect(news).toHaveTextContent('so a screen reader announces what arrives without being asked.');
    expect(news).not.toHaveTextContent('the program that reads a page aloud');
  });

  test.each([
    ['light dismiss', 'The usual value, auto, gives a popover light dismiss: a click outside it or the Escape key closes it.'],
    ['a React effect', 'A React effect, code that React runs after it has updated the page, runs when the number of banners changes.'],
    ['the browser’s own stylesheet', 'The browser’s own stylesheet, the styles every page starts with, gives a popover a fixed position, a size that fits its content, inset: 0 and margin: auto.'],
    ['margin-block and margin-inline', 'On this page margin-block is the margins above and below the panel, and margin-inline is the ones to its left and right.']
  ])('should define %s in the first story', async (_term, sentence) => {
    render(<TestApp at={demosAt('accordions')}/>);
    await demoTabs.open('Z-index');

    expect(recipeFolds.story(await zIndexTab.findFeatureStories(), story)).toHaveTextContent(sentence);
  });

  test('should say where the placement classes put the panel with no dials set', async () => {
    render(<TestApp at={demosAt('accordions')}/>);
    await demoTabs.open('Z-index');

    expect(recipeFolds.story(await zIndexTab.findFeatureStories(), story))
      .toHaveTextContent('Here, top sets the margin above the panel and leaves the one below at auto. And center sets the margins to the left and right to auto again.');
  });

  test('should say where each placement class puts the panel, for the dials chosen', async () => {
    render(<TestApp at={demosAt('z-index', '?side=bottom&align=right')}/>);

    expect(recipeFolds.story(await zIndexTab.findFeatureStories(), story))
      .toHaveTextContent('Here, bottom sets the margin below the panel and leaves the one above at auto. And right sets the margin to the panel’s right and leaves the one to its left at auto.');
  });

  test('should tell step 3 in five paragraphs after its want: the centering, where overflow is explained, the classes, the margins for the dials chosen, then the sample', async () => {
    render(<TestApp at={demosAt('accordions')}/>);
    await demoTabs.open('Z-index');
    const news = recipeFolds.story(await zIndexTab.findFeatureStories(), story);
    const placing = recipeFolds.steps(news)[2];

    expect(explanation.saying(placing, /^The browser’s own stylesheet/)).toHaveTextContent(/which centers it in the window\. That stylesheet also gives a popover a border, a background and padding; the panel wears borderless and unfilled, which take off the first two, and padding: 0, so only the banners inside it show\.$/);
    expect(explanation.saying(placing, /^The \.banners rule’s overflow: visible/)).toHaveTextContent('The .banners rule’s overflow: visible is for the banners’ entrance, a slide in from off screen that The user can have multiple banners explains in its step Slide in from off screen.');
    expect(explanation.saying(placing, /^A class for an edge/)).toHaveTextContent(/so the choice shows in the class names\.$/);
    expect(explanation.saying(placing, /^On this page margin-block/)).toHaveTextContent(/And center sets the margins to the left and right to auto again\.$/);
    expect(explanation.saying(placing, /^The sample is the component’s line/)).toBeInTheDocument();
    expect(outOfReadingOrder([
      explanation.saying(placing, /^The browser’s own stylesheet/),
      explanation.saying(placing, /^The \.banners rule’s overflow: visible/),
      explanation.saying(placing, /^A class for an edge/),
      explanation.saying(placing, /^On this page margin-block/),
      explanation.saying(placing, /^The sample is the component’s line/)
    ])).toEqual([]);
    expect(explanation.paragraphsIn(placing)).toHaveLength(6);
  });

  test('should carve the rules for the side and align the dials chose', async () => {
    render(<TestApp at={demosAt('z-index', '?side=bottom&align=right')}/>);
    const news = recipeFolds.story(await zIndexTab.findFeatureStories(), story);
    const placing = recipeFolds.steps(news)[2];

    expect(placing).toHaveTextContent(/\.bottom \{[^]*\.right \{/);
  });

  test('should carve the panel’s own line, and say the class names the dials chose', async () => {
    render(<TestApp at={demosAt('z-index', '?side=bottom&align=right')}/>);
    const news = recipeFolds.story(await zIndexTab.findFeatureStories(), story);
    const placing = recipeFolds.steps(news)[2];

    expect(placing).toHaveTextContent("className={classNames('banners', 'borderless', 'unfilled', side, align");
    expect(placing).toHaveTextContent('The sample is the component’s line: the two class names the dials choose arrive as side and align, and the browser’s element reads, for this page’s choice, bottom right.');
  });

  test('should label the panel’s carved line TS, in the step and in the explanation', async () => {
    render(<TestApp at={demosAt('z-index', '?side=bottom&align=right')}/>);
    const news = recipeFolds.story(await zIndexTab.findFeatureStories(), story);
    const placing = recipeFolds.steps(news)[2];
    const explained = demoPage.part('Why a fixed banner still loses');

    expect(zIndexTab.labelOnSample(placing, 'Banners/Banners.tsx on GitHub', 'TS')).toBeInTheDocument();
    expect(zIndexTab.labelOnSample(explained, 'Banners/Banners.tsx on GitHub', 'TS')).toBeInTheDocument();
  });

  test('should carve the panel’s padding: 0 beside the step that says it takes the popover’s padding off', async () => {
    render(<TestApp at={demosAt('accordions')}/>);
    await demoTabs.open('Z-index');
    const news = recipeFolds.story(await zIndexTab.findFeatureStories(), story);

    expect(explanation.codeShown(recipeFolds.steps(news)[2]).join()).toMatch(/\.banners \{[^]*padding: 0;/);
  });

  test('should open the second story from step 3’s slide-step link, keeping the side and align chosen', async () => {
    render(<TestApp at={demosAt('z-index', '?news=top&side=bottom&align=right')}/>);
    const tutorial = await zIndexTab.findFeatureStories();
    const placing = recipeFolds.steps(recipeFolds.story(tutorial, story))[2];

    await zIndexTab.follow(placing, 'Slide in from off screen');

    expect(demoPage.title('Slide in from off screen')).toBeVisible();
    expect(demoPage.urlSearch()).toHaveTextContent(/side=bottom&align=right/);
  });

  test('should carve the panel’s overflow: visible beside the step that says why it is set', async () => {
    render(<TestApp at={demosAt('accordions')}/>);
    await demoTabs.open('Z-index');
    const news = recipeFolds.story(await zIndexTab.findFeatureStories(), story);

    expect(explanation.codeShown(recipeFolds.steps(news)[2]).join()).toMatch(/\.banners \{[^]*overflow: visible;/);
  });

  test('should say the message’s color and border and the dismiss button’s look are shared classes, and carve each after its rule', async () => {
    render(<TestApp at={demosAt('accordions')}/>);
    await demoTabs.open('Z-index');
    const news = recipeFolds.story(await zIndexTab.findFeatureStories(), story);
    const styling = recipeFolds.steps(news)[3];

    expect(explanation.saying(styling, /^Each message sits in a paragraph/)).toHaveTextContent(/^Each message sits in a paragraph with the class news\. Its look comes from classes shared across this site: field for the background, rounded-corners, floating for the shadow, alarm-ink for the message’s color, and hairline-outline for a thin border in that color\./);
    expect(explanation.saying(styling, /^Each message sits in a paragraph/)).toHaveTextContent(/The dismiss button is a square of fixed size that does not shrink when the message is long\. Its look is shared classes too: borderless and unfilled take off the browser’s own button border and ground, glyph-icon sets the × at the size the site’s icons are drawn, and muted-ink grays it\.$/);
    expect(zIndexTab.codeShownIn(styling)).toHaveTextContent(/\.floating \{[^]*\.alarm-ink \{[^]*\.hairline-outline \{[^]*\.dismiss \{[^]*\.borderless \{[^]*\.unfilled \{[^]*\.glyph-icon \{[^]*\.muted-ink \{/);
  });

  test('should send the reader to MDN, which the tab names earlier as Mozilla’s web reference', async () => {
    render(<TestApp at={demosAt('accordions')}/>);
    await demoTabs.open('Z-index');

    expect(await demoPage.findSays(/The links go to MDN, if you want more\./)).toBeInTheDocument();
    expect(explanation.saying(demoPage.part('What else forms a stacking context'), /MDN, Mozilla’s web reference, keeps/)).toBeInTheDocument();
  });
});

describe('the banner tutorial’s second story', () => {
  const story = 'The user can have multiple banners';
  const secondStory = async (): Promise<HTMLElement> =>
    recipeFolds.story(await zIndexTab.findFeatureStories(), story);

  test('should head each step with what happens, with the height step only for a sideways stack', async () => {
    render(<TestApp at={demosAt('z-index', '?stack=left')}/>);
    const many = await recipeFolds.press(await zIndexTab.findFeatureStories(), story);

    expect(recipeFolds.stepTitles(many)).toEqual([
      'Skip a message that is already up',
      'Open a gap in the stack first',
      'Slide in from off screen',
      'Slide out, then close the gap',
      'Change a banner’s height smoothly when its text rewraps'
    ]);
  });

  test('should want, for a repeated message, nothing new', async () => {
    render(<TestApp at={demosAt('accordions')}/>);
    await demoTabs.open('Z-index');

    expect(recipeFolds.steps(await secondStory())[0]).toHaveTextContent('The same message twice tells me nothing new.');
  });

  test('should tell step 2 in five paragraphs after its want, and step 3 in two', async () => {
    render(<TestApp at={demosAt('accordions')}/>);
    await demoTabs.open('Z-index');
    const steps = recipeFolds.steps(await secondStory());

    expect(explanation.saying(steps[1], /^A banner is the list item with the class trouble/)).toHaveTextContent(/so the transition opens the gap over 0\.3 seconds\.$/);
    expect(explanation.paragraphsIn(steps[1])).toHaveLength(6);
    expect(explanation.saying(steps[1], /^A track closes only as far/)).toHaveTextContent(/its padding and border start at 0 as well\.$/);
    expect(explanation.saying(steps[1], /^The banner has one transition list/)).toHaveTextContent('The banner has one transition list, written once for all four stacks: both track sizes and both margins over 0.3 seconds, and the slide over 0.6, starting after the gap’s 0.3. The slide in the next step is in it. A second transition declaration on the same element replaces the list; it does not add to it. So the arriving banner’s transitions are all in this one list, and the leaving rule in step 4 writes a whole list of its own.');
    expect(explanation.saying(steps[2], /^The slide can be seen only because/)).toHaveTextContent(/That would clip the slide to the panel’s own box\.$/);
    expect(explanation.paragraphsIn(steps[2])).toHaveLength(3);
  });

  test('should show a sideways stack’s own rules in step 2’s sample, and none of a column’s', async () => {
    render(<TestApp at={demosAt('z-index', '?stack=left')}/>);
    const steps = recipeFolds.steps(await secondStory());

    expect(steps[1]).toHaveTextContent(/&:where\(\.stack-left, \.stack-right\) \.trouble \{ grid-template-columns: 1fr;/);
    expect(steps[1]).toHaveTextContent(/&:where\(\.stack-left, \.stack-right\) \.news \{ @starting-style \{ padding-inline: 0; border-inline-width: 0; } }/);
    expect(steps[1]).toHaveTextContent('&:where(.stack-right) .trouble:where(:not(:last-child)), &:where(.stack-left) .trouble:where(:not(:first-child)) { margin-inline-end: var(--base); }');
    expect(steps[1]).not.toHaveTextContent(/\.stack-down, \.stack-up/);
  });

  test.each([
    ['down', ':where(.stack-down, .stack-up) is the part of the rule’s selector that matches the panel with either class, and the rule applies to each banner in it. So I write the grid-template-rows rule once for the downward and upward stacks, and the grid-template-columns rule once for the two sideways stacks.', 'a margin below every banner but the bottom one, the last child when the stack grows downward', 'carries the upward stack’s selector, where the bottom banner is the first child'],
    ['up', ':where(.stack-down, .stack-up) is the part of the rule’s selector that matches the panel with either class, and the rule applies to each banner in it. So I write the grid-template-rows rule once for the downward and upward stacks, and the grid-template-columns rule once for the two sideways stacks.', 'a margin below every banner but the bottom one, the first child when the stack grows upward', 'carries the downward stack’s selector, where the bottom banner is the last child'],
    ['right', ':where(.stack-left, .stack-right) is the part of the rule’s selector that matches the panel with either class, and the rule applies to each banner in it. So I write the grid-template-columns rule once for the leftward and rightward stacks, and the grid-template-rows rule once for the two vertical stacks.', 'a margin to the right of every banner but the one at the right, the last child when the stack grows rightward', 'carries the leftward stack’s selector, where the banner at the right is the first child'],
    ['left', ':where(.stack-left, .stack-right) is the part of the rule’s selector that matches the panel with either class, and the rule applies to each banner in it. So I write the grid-template-columns rule once for the leftward and rightward stacks, and the grid-template-rows rule once for the two vertical stacks.', 'a margin to the right of every banner but the one at the right, the first child when the stack grows leftward', 'carries the rightward stack’s selector, where the banner at the right is the last child']
  ])('should say, for a stack that grows %s, which rule its axis shares and where its gap is', async (stack, axis, gap, shared) => {
    render(<TestApp at={demosAt('z-index', `?stack=${stack}`)}/>);
    const steps = recipeFolds.steps(await secondStory());

    expect(steps[1]).toHaveTextContent(axis);
    expect(steps[1]).toHaveTextContent(gap);
    expect(steps[1]).toHaveTextContent(shared);
  });

  test('should show the chosen entrance’s distance in step 3’s sample', async () => {
    render(<TestApp at={demosAt('z-index', '?enter=left')}/>);
    const steps = recipeFolds.steps(await secondStory());

    expect(steps[2]).toHaveTextContent('&.from-left { --arrive: -100dvw 0; }');
    expect(steps[2]).not.toHaveTextContent(/from-above|from-below|from-right/);
  });

  test('should show a sideways stack’s own leaving rules in step 4’s sample, and none of a column’s', async () => {
    render(<TestApp at={demosAt('z-index', '?stack=left')}/>);
    const steps = recipeFolds.steps(await secondStory());

    expect(steps[3]).toHaveTextContent(/&:where\(\.stack-left, \.stack-right\) \.trouble\.leaving \{ grid-template-columns: 0fr; margin-inline-end: 0; transition: translate 0\.6s cubic-bezier\(0\.45, 0, 0\.15, 1\), grid-template-columns 0\.3s 0\.6s, margin-inline-end 0\.3s 0\.6s; }/);
    expect(steps[3]).toHaveTextContent(/&:where\(\.stack-left, \.stack-right\) \.trouble\.leaving \.news \{ padding-inline: 0; border-inline-width: 0;/);
    expect(steps[3]).not.toHaveTextContent(/\.stack-down, \.stack-up/);
  });

  test('should leave out the height step for a stack that grows down', async () => {
    render(<TestApp at={demosAt('z-index', '?stack=down')}/>);
    const many = await recipeFolds.press(await zIndexTab.findFeatureStories(), story);

    expect(recipeFolds.stepTitles(many)).not.toContain('Change a banner’s height smoothly when its text rewraps');
  });

  test('should declare the banner’s height above the rule that reads it, and say what @property is, in the height step', async () => {
    render(<TestApp at={demosAt('z-index', '?stack=left')}/>);
    const steps = recipeFolds.steps(await secondStory());

    expect(steps[4]).toHaveTextContent(/@property --news-block-size \{[^]*initial-value: auto;[^]*block-size: var\(--news-block-size\)/);
    expect(explanation.saying(steps[4], /a browser object that calls back when an element changes size/)).toHaveTextContent(/The number travels in a custom property named --news-block-size\.$/);
    expect(explanation.saying(steps[4], /^The stylesheet declares it with/)).toHaveTextContent('The stylesheet declares it with @property, an at-rule: a rule that starts with @ and sets something up for the style sheet without picking out elements. This one gives a custom property a type and a starting value: a length or auto, starting as auto, so a message that has not been measured keeps its own height.');
    expect(explanation.saying(steps[4], /^Before it measures/)).toHaveTextContent(/so a message measured with the old height still on it could only grow\.$/);
  });

  test('should open on the two moves, and say what a transition and a starting style are', async () => {
    render(<TestApp at={demosAt('accordions')}/>);
    await demoTabs.open('Z-index');
    const many = await secondStory();

    expect(many).toHaveTextContent('A banner arrives in two moves: the stack opens a gap for it while it is still off screen, and then it slides in.');
    expect(many).toHaveTextContent('A transition changes a CSS value over a set time instead of at once. A banner that has just been added has no earlier value to change from, so a starting style, written @starting-style, gives it one.');
  });

  test('should give no browser as the reason for the code', async () => {
    render(<TestApp at={demosAt('accordions')}/>);
    await demoTabs.open('Z-index');

    expect(await secondStory()).not.toHaveTextContent(/Chrome|Platform traps|keyframe/);
  });

  test.each([
    ['a grid and a track', 'A banner is the list item with the class trouble. Each banner is a grid, a layout of rows and columns, with a single row or column, called a track.'],
    ['fr', 'A track’s size can be given in fr, its share of the grid’s room: at 1fr this one track takes all of it, and at 0fr it takes none.'],
    ['why the message shrinks to nothing', 'A track closes only as far as what is inside it can shrink, so the message’s minimum size is 0 in both directions, and on the stack’s axis its padding and border start at 0 as well.'],
    ['a custom property', 'The distance is a custom property: a value given a name once, here --arrive, and read back with var().'],
    ['the leaving class', 'Dismissing a banner gives it the class leaving. That rule sends the banner back the way it came at once, and holds the track, the margin and the message’s padding and border for 0.6 seconds, the time the slide takes, before closing them.'],
    ['raise', 'raise is the function a page calls with a message.']
  ])('should define %s in the second story', async (_term, sentence) => {
    render(<TestApp at={demosAt('accordions')}/>);
    await demoTabs.open('Z-index');

    expect(await secondStory()).toHaveTextContent(sentence);
  });

  test('should say what a ResizeObserver and block-size are, for a sideways stack', async () => {
    render(<TestApp at={demosAt('z-index', '?stack=right')}/>);

    const many = await secondStory();

    expect(many).toHaveTextContent('A ResizeObserver, a browser object that calls back when an element changes size, sets each message’s height to a measured number of pixels.');
    expect(many).toHaveTextContent('A rewrap then changes one number to another, and the transition on block-size, the CSS name for height on this page, runs between them.');
  });

  test('should say the code removes the old height before it measures, for a sideways stack', async () => {
    render(<TestApp at={demosAt('z-index', '?stack=right')}/>);

    expect(await secondStory()).toHaveTextContent('Before it measures, the code removes the height it set last time.');
  });

  test('should say what scrollHeight is before the height step uses it, for a sideways stack', async () => {
    render(<TestApp at={demosAt('z-index', '?stack=right')}/>);

    expect(await secondStory()).toHaveTextContent('scrollHeight, the height of everything inside the element even where it overflows, is never less than the element’s own height');
  });

  test('should point the popover up to Why the popover wins, where it is taught', async () => {
    render(<TestApp at={demosAt('accordions')}/>);
    await demoTabs.open('Z-index');
    const many = await secondStory();

    expect(many).toHaveTextContent('The panel is a popover, as Why the popover wins explains, and the browser’s own stylesheet gives a popover overflow: auto.');
    expect(explanation.linkNamed(many, 'Why the popover wins')).toHaveAttribute('href', zIndexTab.fragmentOf('Why the popover wins'));
  });

  test('should show the banner’s one transition list and a column’s rules in step 2’s sample, none in step 3’s, and a column’s leaving rules in step 4’s', async () => {
    render(<TestApp at={demosAt('accordions')}/>);
    await demoTabs.open('Z-index');
    const steps = recipeFolds.steps(await secondStory());

    expect(steps[1]).toHaveTextContent(/\.trouble \{ display: grid; transition: translate 0\.6s cubic-bezier\(0\.45, 0, 0\.15, 1\) 0\.3s, grid-template-rows 0\.3s, grid-template-columns 0\.3s, margin-block-end 0\.3s, margin-inline-end 0\.3s; @starting-style/);
    expect(steps[1]).toHaveTextContent(/&:where\(\.stack-down, \.stack-up\) \.trouble \{ grid-template-rows: 1fr;/);
    expect(steps[1]).toHaveTextContent(/&:where\(\.stack-down, \.stack-up\) \.news \{ @starting-style \{ padding-block: 0; border-block-width: 0; } }/);
    expect(steps[1]).toHaveTextContent('&:where(.stack-down) .trouble:where(:not(:last-child)), &:where(.stack-up) .trouble:where(:not(:first-child)) { margin-block-end: var(--base); }');
    expect(steps[2]).not.toHaveTextContent(/transition:/);
    expect(steps[3]).toHaveTextContent(/&:where\(\.stack-down, \.stack-up\) \.trouble\.leaving \{ grid-template-rows: 0fr; margin-block-end: 0; transition: translate 0\.6s cubic-bezier\(0\.45, 0, 0\.15, 1\), grid-template-rows 0\.3s 0\.6s, margin-block-end 0\.3s 0\.6s; }/);
    expect(steps[3]).toHaveTextContent(/&:where\(\.stack-down, \.stack-up\) \.trouble\.leaving \.news \{ padding-block: 0; border-block-width: 0; transition: padding 0\.3s 0\.6s, border-width 0\.3s 0\.6s; }/);
  });

  test('should say where the banner starts, for the entrance chosen', async () => {
    render(<TestApp at={demosAt('z-index', '?enter=left')}/>);

    expect(await secondStory()).toHaveTextContent('Here the banner starts a full window’s width to the left of its place. The distance is a custom property');
  });
});

describe('the z-index tab’s introduction', () => {
  const paragraphs = [
    'Where two boxes on a page overlap, the browser draws one over the other. z-index is the CSS property for changing which.',
    'This tab assumes what the accordions tab gives: an element, an attribute, a class, a dial and a custom property. The rest is new here.',
    'z-index reads like one ranking for the whole page, where the biggest number wins. So when a menu opens under a card, or a banner is covered by something scrolling past, the usual fix is a bigger number. Then 9999 loses too.',
    'I think a bigger number is the wrong fix, because a z-index is compared only inside a stacking context, a group of boxes the browser stacks as one. Most of this page is about that context: what makes one, what it traps, and the browser’s own way out of it, the top layer.',
    'By the end you can say why one box is drawn over another, why a z-index of 9999 can still lose, and how a popover, an element the browser itself shows and hides, is drawn over everything on the page. The last part builds this site’s banner that way. The first exhibit below is a pile of three cards with no z-index at all. Raise First with the pills and watch it come to the top.'
  ];

  test('should tell, after what it assumes from earlier tabs, the problem, the page’s view and what a reader can do after, before the first exhibit', async () => {
    render(<TestApp at={demosAt('accordions')}/>);
    await demoTabs.open('Z-index');
    const tab = await demoTabs.arrivedOn('Z-index');
    const firstExhibit = zIndexTab.titleIn(tab, 'Why Third is on top');

    expect(outOfReadingOrder([...paragraphs.map(paragraphReading), firstExhibit])).toEqual([]);
  });

  test('should say what it assumes from earlier tabs, linking each tab it names', async () => {
    render(<TestApp at={demosAt('z-index')}/>);

    expect(await demoTabs.assumedLinks('Z-index')).toEqual([
      ['accordions tab', `${Paths.demos}accordions/`]
    ]);
  });
});

describe('the z-index tab’s own words', () => {
  test.each([
    'I could give the banner a huge z-index. But a z-index counts only inside its own stacking context, the term taught above in Why 9999 still loses. An element around the banner forms a stacking context by the ways What else forms a stacking context shows. position: fixed, which pins the banner to the window, does not lift it out of that context, as Why a fixed banner still loses shows. Inside that context, the banner’s 9999 is compared with nothing outside it. So I made the panel a popover, drawn in the top layer like the new menu above. Why the popover wins says what both are.',
    'Elsewhere on this site it reports real trouble. On this page the button raises random nonsense so you can watch the mechanics.',
    'More properties than z-index form a stacking context. MDN, Mozilla’s web reference, keeps the whole list, and these are the ones a page meets most. I put the three that form none beside them because telling them apart is the lesson.',
    'middle and center set auto again. They change nothing. I keep them so the choice shows in the class names.',
    'z-index: 1 forms a context on a positioned element. It forms one on a grid item too, which card one is here, and on a flex item, a box laid out by a parent whose display is flex. The menu part’s card had position: relative as well, and either is enough. Card two, at 1 and later in the code, is painted over card one.',
    'A popover is shown in the top layer, a layer the browser keeps above the whole page for popovers, dialogs and elements shown full screen.',
    'To build this banner yourself, go to the tutorial below. It opens at the step where the panel becomes a popover and so is shown in the top layer.',
    'The dials below place the stack, choose its entrance and pick how it grows. Where a step depends on a dial, that dial sits on the step.',
    'A banner is read at a glance, by someone busy with something else.',
    'The menu’s own style sheet places it with position-area, below the button that opened it or above it when there is no room below, and where a browser has no position-area, it centers the menu on the screen.'
  ])('should say, whatever the dials, words and links together: %s', async sentence => {
    render(<TestApp at={demosAt('z-index')}/>);

    expect(await demoTabs.arrivedOn('Z-index')).toHaveTextContent(sentence);
  });

  test('should define the top layer once, with no second sentence saying it again', async () => {
    render(<TestApp at={demosAt('z-index')}/>);

    expect(await demoTabs.arrivedOn('Z-index')).not.toHaveTextContent('Whatever the page stacks, the top layer sits over it.');
  });
});

describe('the names the code uses', () => {
  test.each([
    {name: 'Item', run: /gives its button the site’s shared classes that set its look/},
    {name: 'Menu', run: /gives its button the site’s shared classes that set its look/},
    {name: 'position: fixed', run: /I could give the banner a huge z-index/},
    {name: 'middle', run: /set auto again/},
    {name: 'center', run: /set auto again/}
  ])('should set $name as code where its run names it', async ({name, run}) => {
    render(<TestApp at={demosAt('z-index')}/>);
    const told = explanation.saying(await demoTabs.arrivedOn('Z-index'), run);

    expect(explanation.codeShown(told)).toContain(name);
  });
});

describe('the banner dials’ readings', () => {
  test.each([
    ['side=top', 'The panel holds to the window’s top edge.'],
    ['side=middle', 'The panel sits in the window’s middle.'],
    ['side=bottom', 'The panel holds to the window’s bottom edge.'],
    ['align=left', 'The panel holds to the window’s left edge.'],
    ['align=center', 'The browser centers the panel across the window.'],
    ['align=right', 'The panel holds to the window’s right edge.'],
    ['enter=above', 'A new banner slides in from above the window’s top edge.'],
    ['enter=below', 'A new banner slides in from below the window’s bottom edge.'],
    ['enter=left', 'A new banner slides in from past the window’s left edge.'],
    ['enter=right', 'A new banner slides in from past the window’s right edge.'],
    ['stack=down', 'Each new banner goes below the ones already up.'],
    ['stack=up', 'Each new banner goes above the ones already up.'],
    ['stack=left', 'The stack grows leftward, with the newest banner at the left.'],
    ['stack=right', 'The stack grows rightward, with the newest banner at the right.']
  ])('should read, with %s chosen, “%s”', async (choice, reading) => {
    render(<TestApp at={demosAt('z-index', `?${choice}`)}/>);

    expect(await demoPage.findSays(reading)).toBeInTheDocument();
  });
});

describe('the links to other tabs', () => {
  test('should link each term it glosses, and each tab it names, to that tab', async () => {
    render(<TestApp at={demosAt('z-index')}/>);

    const tab = await demoTabs.arrivedOn('Z-index');

    expect(demoPage.linksToTabsIn(tab)).toEqual([
      ['accordions tab', `${Paths.demos}accordions/`],
      ['accordions tab', `${Paths.demos}accordions/`],
      ['dials', `${Paths.demos}accordions/`]
    ]);
  });
});
