import {TestApp} from '@__test_support/TestApp';
import {demosAt} from '@pages/Demos/__test_support';
import {fireEvent, render, screen, within} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {seed} from '@components/fibs';
import {recipeFolds} from '@pages/Demos/Recipe/__test_support';

beforeEach(() => seed('top-layer'));

const troublesIn = (alert: HTMLElement): HTMLElement[] =>
  within(alert).queryAllByRole('button', {name: /^dismiss /, hidden: true});

const openZIndexTab = async () => {
  render(<TestApp at={demosAt()}/>);
  const demoTabs = await screen.findByRole('navigation', {name: 'demos'});
  await userEvent.click(within(demoTabs).getByText('Z-Index'));
};

describe('the top layer', () => {
  test('the z-index tab opens on its four parts, in order, in the heading outline', async () => {
    await openZIndexTab();

    const tab = await screen.findByRole('region', {name: 'Z-Index'});

    expect(within(tab).getAllByRole('heading', {level: 3}).map(heading => heading.textContent).slice(0, 4))
      .toEqual(['Why Third is on top', 'Why 9999 still loses', 'Why the popover wins', 'Why a fixed banner still loses']);
  });

  test('the user raises a banner from the demo', async () => {
    await openZIndexTab();
    const alert = screen.getByRole('alert', {hidden: true});
    const alreadyStanding = troublesIn(alert).length;

    await userEvent.click(await screen.findByRole('button', {name: 'Raise a banner, in the top layer'}));

    expect(troublesIn(alert)).toHaveLength(alreadyStanding + 1);
  });

  test('a dismissed banner leaves the pile', async () => {
    await openZIndexTab();
    const alert = screen.getByRole('alert', {hidden: true});
    const alreadyStanding = troublesIn(alert).length;
    await userEvent.click(await screen.findByRole('button', {name: 'Raise a banner, in the top layer'}));
    const raised = troublesIn(alert);
    const newest = raised[raised.length - 1];
    const item = within(alert).getAllByRole('listitem', {hidden: true}).find(standing => standing.contains(newest));
    if (!item) {
      throw new Error('the raised trouble stands in no list item');
    }

    await userEvent.click(newest);
    fireEvent.transitionEnd(item, {propertyName: 'grid-template-rows'});

    expect(troublesIn(alert)).toHaveLength(alreadyStanding);
  });

  test('every press stacks another banner', async () => {
    await openZIndexTab();
    const alert = screen.getByRole('alert', {hidden: true});
    const alreadyStanding = troublesIn(alert).length;
    const raise = await screen.findByRole('button', {name: 'Raise a banner, in the top layer'});

    await userEvent.click(raise);
    await userEvent.click(raise);
    await userEvent.click(raise);

    expect(troublesIn(alert)).toHaveLength(alreadyStanding + 3);
  });

  test('the tutorial tells the story of the news', async () => {
    await openZIndexTab();

    expect(await screen.findByText('let’s build this feature')).toBeVisible();
    expect(screen.getByText('The user sees the news above everything')).toBeVisible();
    expect(screen.getByText('The user can have multiple banners')).toBeVisible();
    expect(screen.queryByText('Any component can raise a banner')).not.toBeInTheDocument();
    expect(screen.queryByText('The news travels, and the pile makes room')).not.toBeInTheDocument();
  });

  test('the dials explain themselves and say their url', async () => {
    await openZIndexTab();
    const controls = await screen.findByRole('region', {name: 'banner controls'});

    await userEvent.click(within(within(controls).getByRole('group', {name: 'side'})).getByRole('radio', {name: 'Bottom'}));
    await userEvent.click(within(within(controls).getByRole('group', {name: 'align'})).getByRole('radio', {name: 'Right'}));
    await userEvent.click(within(within(controls).getByRole('group', {name: 'entrance'})).getByRole('radio', {name: 'Below'}));
    await userEvent.click(within(within(controls).getByRole('group', {name: 'stack'})).getByRole('radio', {name: 'Left'}));

    expect(within(controls).getByText('The news rests along the bottom edge and waits to be noticed.')).toBeVisible();
    expect(within(controls).getByText('?side=bottom&align=right&enter=below&stack=left')).toBeVisible();
  });

  test('the tutorial follows the dials', async () => {
    await openZIndexTab();
    const controls = await screen.findByRole('region', {name: 'banner controls'});

    expect(screen.getByText(/the stack grows downward, so the track is a row\./)).toBeInTheDocument();

    await userEvent.click(within(within(controls).getByRole('group', {name: 'stack'})).getByRole('radio', {name: 'Left'}));

    expect(screen.getByText(/the stack grows leftward, so the track is a column\./)).toBeInTheDocument();
  });

  test('the cards start stacked', async () => {
    await openZIndexTab();

    expect(await screen.findByRole('button', {name: 'Expand', expanded: false})).toBeInTheDocument();
  });

  test('the button spreads the cards and offers to collapse them', async () => {
    await openZIndexTab();

    const spread = await screen.findByRole('button', {name: 'Expand', expanded: false});
    await userEvent.click(spread);

    expect(screen.getByRole('button', {name: 'Collapse', expanded: true})).toBeInTheDocument();
    expect(screen.queryByRole('button', {name: 'Expand'})).not.toBeInTheDocument();
  });
});

describe('the banner tutorial’s first story', () => {
  const story = 'The user sees the news above everything';

  test('should say a z-index starts a stacking context only on a positioned element or a flex or grid item, and point up to where the term is taught', async () => {
    await openZIndexTab();
    const news = recipeFolds.story(await screen.findByRole('region', {name: 'let’s build this feature'}), story);

    expect(news).toHaveTextContent('A z-index other than auto starts one too, but only on an element that is positioned, meaning its position is not static, or that is a child of a flex or grid container.');
    expect(within(news).getByRole('link', {name: 'Why 9999 still loses'})).toHaveAttribute('href', `#${screen.getByRole('heading', {name: 'Why 9999 still loses'}).id}`);
  });

  test('should not call stacking contexts a cascade', async () => {
    await openZIndexTab();

    expect(recipeFolds.story(await screen.findByRole('region', {name: 'let’s build this feature'}), story)).not.toHaveTextContent(/cascade/);
  });

  test('should call the panel a popover drawn in the top layer, and point up to Why the popover wins instead of defining both again', async () => {
    await openZIndexTab();
    const news = recipeFolds.story(await screen.findByRole('region', {name: 'let’s build this feature'}), story);

    expect(news).toHaveTextContent('So the panel is a popover, drawn in the top layer like the new menu above. Why the popover wins says what both are.');
    expect(within(news).getByRole('link', {name: 'Why the popover wins'})).toHaveAttribute('href', `#${screen.getByRole('heading', {name: 'Why the popover wins'}).id}`);
    expect(news).not.toHaveTextContent(/hidden until the code shows it|No z-index on the page can put anything over the top layer/);
  });

  test('should head each step with what happens', async () => {
    await openZIndexTab();
    const news = await recipeFolds.press(await screen.findByRole('region', {name: 'let’s build this feature'}), story);

    expect(recipeFolds.steps(news).map(step => within(step).getAllByRole('heading')[0].textContent))
      .toEqual(['Make the panel a popover', 'Show it when there is news', 'Place the panel with two class names', 'Style each banner']);
  });

  test.each([
    ['light dismiss', 'The usual value, auto, gives a popover light dismiss: a click outside it or the Escape key closes it.'],
    ['a screen reader', 'a screen reader, the program that reads a page aloud, announces what arrives without being asked.'],
    ['a React effect', 'A React effect, code that React runs after it has updated the page, runs when the number of banners changes.'],
    ['the browser’s own stylesheet', 'The browser’s own stylesheet, the styles every page starts with, gives a popover a fixed position, a size that fits its content, inset: 0 and margin: auto.'],
    ['margin-block and margin-inline', 'On this page margin-block is the margins above and below the panel, and margin-inline is the ones to its left and right.']
  ])('should define %s in the first story', async (_term, sentence) => {
    await openZIndexTab();

    expect(recipeFolds.story(await screen.findByRole('region', {name: 'let’s build this feature'}), story)).toHaveTextContent(sentence);
  });

  test('should say where the placement classes put the panel with no dials set', async () => {
    await openZIndexTab();

    expect(recipeFolds.story(await screen.findByRole('region', {name: 'let’s build this feature'}), story))
      .toHaveTextContent('Here, top sets the margin above the panel and leaves the one below at auto. And center sets the margins to the left and right to auto again.');
  });

  test('should say where each placement class puts the panel, for the dials chosen', async () => {
    render(<TestApp at={demosAt('?tab=z-index&side=bottom&align=right')}/>);

    expect(recipeFolds.story(await screen.findByRole('region', {name: 'let’s build this feature'}), story))
      .toHaveTextContent('Here, bottom sets the margin below the panel and leaves the one above at auto. And right sets the margin to the panel’s right and leaves the one to its left at auto.');
  });

  test('should tell step 3 in three paragraphs: the centring, the classes, then the margins for the dials chosen', async () => {
    await openZIndexTab();
    const news = recipeFolds.story(await screen.findByRole('region', {name: 'let’s build this feature'}), story);
    const placing = recipeFolds.steps(news)[2];

    expect(within(placing).getByText(/^The browser’s own stylesheet/)).toHaveTextContent(/which centres it in the window\.$/);
    expect(within(placing).getByText(/^A class for an edge/)).toHaveTextContent(/so the choice shows in the class names\.$/);
    expect(within(placing).getByText(/^On this page margin-block/)).toHaveTextContent(/And center sets the margins to the left and right to auto again\.$/);
  });

  test('should name MDN as Mozilla’s web reference', async () => {
    await openZIndexTab();

    expect(await screen.findByText(/The links go to MDN, Mozilla’s web reference, if you want more\./)).toBeInTheDocument();
  });
});

describe('the banner tutorial’s second story', () => {
  const story = 'The user can have multiple banners';
  const secondStory = async (): Promise<HTMLElement> =>
    recipeFolds.story(await screen.findByRole('region', {name: 'let’s build this feature'}), story);

  test('should head each step with what happens, with the height step only for a sideways stack', async () => {
    render(<TestApp at={demosAt('?tab=z-index&stack=left')}/>);
    const many = await recipeFolds.press(await screen.findByRole('region', {name: 'let’s build this feature'}), story);

    expect(recipeFolds.steps(many).map(step => within(step).getAllByRole('heading')[0].textContent)).toEqual([
      'Skip a message that is already up',
      'Open a gap in the stack first',
      'Slide in from off screen',
      'Slide out, then close the gap',
      'Change a banner’s height smoothly when its text rewraps'
    ]);
  });

  test('should open on the two moves, and say what a transition and a starting style are', async () => {
    await openZIndexTab();
    const many = await secondStory();

    expect(many).toHaveTextContent('A banner arrives in two moves: the stack opens a gap for it while it is still off screen, and then it slides in.');
    expect(many).toHaveTextContent('A transition changes a CSS value over a set time instead of at once. A banner that has just been added has no earlier value to change from, so a starting style, written @starting-style, gives it one.');
  });

  test('should give no browser as the reason for the code', async () => {
    await openZIndexTab();

    expect(await secondStory()).not.toHaveTextContent(/Chrome|Platform traps|keyframe/);
  });

  test.each([
    ['a track', 'Each banner is a grid with a single row or column, called a track.'],
    ['0fr and 1fr', 'The starting style sets the track to 0fr, which is no size at all, and the banner’s own rule sets it to 1fr, the size of its content, so the transition opens the gap over 0.3 seconds.'],
    ['a custom property', 'The distance is a custom property: a value given a name once, here --arrive, and read back with var().'],
    ['the leaving class', 'Dismissing a banner gives it the class leaving, which runs the two moves in the other order'],
    ['raise', 'raise is the function a page calls with a message.']
  ])('should say what %s is where the reader meets it', async (_term, sentence) => {
    await openZIndexTab();

    expect(await secondStory()).toHaveTextContent(sentence);
  });

  test('should say what a ResizeObserver and block-size are, for a sideways stack', async () => {
    render(<TestApp at={demosAt('?tab=z-index&stack=right')}/>);

    expect(await secondStory()).toHaveTextContent('A ResizeObserver, a browser object that calls back when an element changes size, sets each message’s height to a measured number of pixels. A rewrap then changes one number to another, and the transition on block-size, the CSS name for height on this page, runs between them.');
  });

  test('should point the popover up to Why the popover wins, where it is taught', async () => {
    await openZIndexTab();
    const many = await secondStory();

    expect(many).toHaveTextContent('The panel is a popover, as Why the popover wins explains, and the browser’s own stylesheet gives a popover overflow: auto.');
    expect(within(many).getByRole('link', {name: 'Why the popover wins'})).toHaveAttribute('href', '#popover-wins-heading');
  });

  test('should show the transition that opens the gap in step 2’s sample, and the whole leaving rule in step 4’s', async () => {
    await openZIndexTab();
    const steps = recipeFolds.steps(await secondStory());

    expect(steps[1]).toHaveTextContent(/transition: grid-template-rows 0\.3s, margin-block-end 0\.3s; @starting-style/);
    expect(steps[3]).toHaveTextContent(/margin-block-end: 0;[^]*grid-template-rows 0\.3s 0\.6s, margin-block-end 0\.3s 0\.6s; \}/);
  });

  test('should say where the banner starts, for the entrance chosen', async () => {
    render(<TestApp at={demosAt('?tab=z-index&enter=left')}/>);

    expect(await secondStory()).toHaveTextContent('Here the banner starts a full window’s width to the left of the window. The distance is a custom property');
  });
});
