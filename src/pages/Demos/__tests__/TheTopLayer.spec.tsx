import {TestApp} from '@__test_support/TestApp';
import {demosAt, demoTabs, outOfReadingOrder} from '@pages/Demos/__test_support';
import {fireEvent, render, screen, within} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {seed} from '@components/fibs';
import {recipeFolds} from '@pages/Demos/Recipe/__test_support';

beforeEach(() => seed('top-layer'));

const troublesIn = (alert: HTMLElement): HTMLElement[] =>
  within(alert).queryAllByRole('button', {name: /^dismiss /, hidden: true});

const openZIndexTab = async () => {
  render(<TestApp at={demosAt()}/>);
  await demoTabs.open('Z-index');
};

describe('the top layer', () => {
  test('the z-index tab opens on its four parts, in order, in the heading outline', async () => {
    await openZIndexTab();

    const tab = await screen.findByRole('region', {name: 'Z-index'});

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

    expect(news).toHaveTextContent('A z-index other than auto starts one too, but only on an element that is positioned, meaning its position is not static, or that is a child of a flex or grid container');
    expect(within(news).getByRole('link', {name: 'Why 9999 still loses'})).toHaveAttribute('href', `#${screen.getByRole('heading', {name: 'Why 9999 still loses'}).id}`);
  });

  test('should say what flex and grid are where the first story first names them', async () => {
    await openZIndexTab();

    expect(recipeFolds.story(await screen.findByRole('region', {name: 'let’s build this feature'}), story)).toHaveTextContent('or that is a child of a flex or grid container, the two CSS layouts that arrange their children along a line or in rows and columns.');
  });

  test('should say what inset: 0 does where step 3 first names it', async () => {
    await openZIndexTab();

    expect(recipeFolds.story(await screen.findByRole('region', {name: 'let’s build this feature'}), story)).toHaveTextContent('inset: 0 and margin: auto. inset: 0 lets the panel reach each edge of the window. It takes only the room its content needs, and the auto margins share the rest, which centres it in the window.');
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

    expect(recipeFolds.stepTitles(news))
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

  test('should tell step 3 in four paragraphs: the centring, the classes, the margins for the dials chosen, then the sample', async () => {
    await openZIndexTab();
    const news = recipeFolds.story(await screen.findByRole('region', {name: 'let’s build this feature'}), story);
    const placing = recipeFolds.steps(news)[2];

    expect(within(placing).getByText(/^The browser’s own stylesheet/)).toHaveTextContent(/which centres it in the window\. That stylesheet also gives a popover a border and a background; the panel wears borderless and unfilled, which take them off, so only the banners inside it show\.$/);
    expect(within(placing).getByText(/^A class for an edge/)).toHaveTextContent(/so the choice shows in the class names\.$/);
    expect(within(placing).getByText(/^On this page margin-block/)).toHaveTextContent(/And center sets the margins to the left and right to auto again\.$/);
    expect(within(placing).getByText(/^The sample is the component’s line/)).toBeInTheDocument();
  });

  test('should carve the panel’s own line, and say the class names the dials chose', async () => {
    render(<TestApp at={demosAt('?tab=z-index&side=bottom&align=right')}/>);
    const news = recipeFolds.story(await screen.findByRole('region', {name: 'let’s build this feature'}), story);
    const placing = recipeFolds.steps(news)[2];

    expect(within(placing).getAllByRole('code')[0]).toHaveTextContent("className={classNames('banners', 'borderless', 'unfilled', side, align");
    expect(placing).toHaveTextContent('The sample is the component’s line: the two class names the dials choose arrive as side and align, and the browser’s element reads, for this page’s choice, bottom right.');
  });

  test('should say the dismiss button’s look is shared classes, and carve each after its rule', async () => {
    await openZIndexTab();
    const news = recipeFolds.story(await screen.findByRole('region', {name: 'let’s build this feature'}), story);
    const styling = recipeFolds.steps(news)[3];

    expect(within(styling).getByText(/^Each message sits in a paragraph/)).toHaveTextContent(/The dismiss button is a square of fixed size that does not shrink when the message is long\. Its look is shared classes too: borderless and unfilled take off the browser’s own button border and ground, glyph-icon sets the ✕ at the size the site’s icons are drawn, and muted-ink greys it\.$/);
    expect(within(styling).getByRole('code')).toHaveTextContent(/\.dismiss \{[^]*\.borderless \{[^]*\.unfilled \{[^]*\.glyph-icon \{[^]*\.muted-ink \{/);
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

    expect(recipeFolds.stepTitles(many)).toEqual([
      'Skip a message that is already up',
      'Open a gap in the stack first',
      'Slide in from off screen',
      'Slide out, then close the gap',
      'Change a banner’s height smoothly when its text rewraps'
    ]);
  });

  test('should tell step 2 in three paragraphs, and step 3 in two after its want', async () => {
    await openZIndexTab();
    const steps = recipeFolds.steps(await secondStory());

    expect(within(steps[1]).getByText(/^Each banner is a grid/)).toHaveTextContent(/The margin between banners opens over the same time\.$/);
    expect(within(steps[1]).getByText(/^A track closes only as far/)).toHaveTextContent(/its padding and border start at 0 as well\.$/);
    expect(within(steps[1]).getByText(/^The banner has one transition list/)).toHaveTextContent('The banner has one transition list, and the slide in the next step is in it. A second transition declaration on the same element replaces the list; it does not add to it. So the arriving banner’s transitions are all in this one list, and the leaving rule in step 4 writes a whole list of its own.');
    expect(within(steps[2]).getByText(/^The slide can be seen only because/)).toHaveTextContent(/That would clip the slide to the panel’s own box\.$/);
    expect(within(steps[2]).getAllByRole('paragraph')).toHaveLength(3);
  });

  test('should let a sideways stack’s message shrink across, in step 2’s sample', async () => {
    render(<TestApp at={demosAt('?tab=z-index&stack=left')}/>);
    const steps = recipeFolds.steps(await secondStory());

    expect(steps[1]).toHaveTextContent(/\.news \{ min-inline-size: 0;[^]*padding-inline: 0; border-inline-width: 0;/);
    expect(steps[1]).not.toHaveTextContent(/min-block-size/);
  });

  test('should say the slide waits for the gap, in the transition list of step 2’s sample', async () => {
    await openZIndexTab();

    expect(recipeFolds.steps(await secondStory())[2]).toHaveTextContent('In the transition list in step 2’s sample, the slide waits 0.3 seconds, the time the gap takes to open.');
  });

  test('should leave out the height step for a stack that grows down', async () => {
    render(<TestApp at={demosAt('?tab=z-index&stack=down')}/>);
    const many = await recipeFolds.press(await screen.findByRole('region', {name: 'let’s build this feature'}), story);

    expect(recipeFolds.stepTitles(many)).not.toContain('Change a banner’s height smoothly when its text rewraps');
  });

  test('should declare the banner’s height above the rule that reads it, and say what @property is, in the height step', async () => {
    render(<TestApp at={demosAt('?tab=z-index&stack=left')}/>);
    const steps = recipeFolds.steps(await secondStory());

    expect(steps[4]).toHaveTextContent(/@property --news-block-size \{[^]*initial-value: auto;[^]*block-size: var\(--news-block-size\)/);
    expect(steps[4]).toHaveTextContent('The number travels in a custom property named --news-block-size. The stylesheet declares it with @property, a rule that gives a custom property a type and a starting value: a length or auto, starting as auto, so a message that has not been measured keeps its own height.');
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
    ['a grid and a track', 'Each banner is a grid, a layout of rows and columns, with a single row or column, called a track.'],
    ['fr', 'A track’s size can be given in fr, its share of the grid’s room: at 1fr this one track takes all of it, and at 0fr it takes none.'],
    ['why the message shrinks to nothing', 'A track closes only as far as what is inside it can shrink, so the message has a minimum size of 0, and its padding and border start at 0 as well.'],
    ['a custom property', 'The distance is a custom property: a value given a name once, here --arrive, and read back with var().'],
    ['the leaving class', 'Dismissing a banner gives it the class leaving. That rule sends the banner back the way it came at once, and holds the track, the margin and the message’s padding and border for 0.6 seconds, the time the slide takes, before closing them.'],
    ['raise', 'raise is the function a page calls with a message.']
  ])('should define %s in the second story', async (_term, sentence) => {
    await openZIndexTab();

    expect(await secondStory()).toHaveTextContent(sentence);
  });

  test('should say what a ResizeObserver and block-size are, for a sideways stack', async () => {
    render(<TestApp at={demosAt('?tab=z-index&stack=right')}/>);

    const many = await secondStory();

    expect(many).toHaveTextContent('A ResizeObserver, a browser object that calls back when an element changes size, sets each message’s height to a measured number of pixels.');
    expect(many).toHaveTextContent('A rewrap then changes one number to another, and the transition on block-size, the CSS name for height on this page, runs between them.');
  });

  test('should say the code removes the old height before it measures, for a sideways stack', async () => {
    render(<TestApp at={demosAt('?tab=z-index&stack=right')}/>);

    expect(await secondStory()).toHaveTextContent('Before it measures, the code removes the height it set last time. scrollHeight is never less than the element’s own height');
  });

  test('should point the popover up to Why the popover wins, where it is taught', async () => {
    await openZIndexTab();
    const many = await secondStory();

    expect(many).toHaveTextContent('The panel is a popover, as Why the popover wins explains, and the browser’s own stylesheet gives a popover overflow: auto.');
    expect(within(many).getByRole('link', {name: 'Why the popover wins'})).toHaveAttribute('href', `#${screen.getByRole('heading', {name: 'Why the popover wins'}).id}`);
  });

  test('should show the banner’s one transition list and the message’s rules in step 2’s sample, none in step 3’s, and the whole leaving rules in step 4’s', async () => {
    await openZIndexTab();
    const steps = recipeFolds.steps(await secondStory());

    expect(steps[1]).toHaveTextContent(/transition: translate 0\.6s cubic-bezier\(0\.45, 0, 0\.15, 1\) 0\.3s, grid-template-rows 0\.3s, margin-block-end 0\.3s; @starting-style/);
    expect(steps[1]).toHaveTextContent(/\.news \{ min-block-size: 0; transition: padding 0\.3s, border-width 0\.3s; @starting-style \{ padding-block: 0; border-block-width: 0; } }/);
    expect(steps[2]).not.toHaveTextContent(/transition:/);
    expect(steps[3]).toHaveTextContent(/margin-block-end: 0;[^]*grid-template-rows 0\.3s 0\.6s, margin-block-end 0\.3s 0\.6s; }/);
    expect(steps[3]).toHaveTextContent(/\.trouble\.leaving \.news \{ padding-block: 0; border-block-width: 0; transition: padding 0\.3s 0\.6s, border-width 0\.3s 0\.6s; }/);
  });

  test('should say where the banner starts, for the entrance chosen', async () => {
    render(<TestApp at={demosAt('?tab=z-index&enter=left')}/>);

    expect(await secondStory()).toHaveTextContent('Here the banner starts a full window’s width to the left of its place. The distance is a custom property');
  });
});

describe('the z-index tab’s introduction', () => {
  const paragraphs = [
    'Where two boxes on a page overlap, the browser draws one over the other. z-index is the CSS property for changing which.',
    'It reads like one ranking for the whole page, where the biggest number wins. So when a menu opens under a card, or a banner is covered by something scrolling past, the usual fix is a bigger number. Then 9999 loses too.',
    'This page’s view is that a bigger number is the wrong fix. A z-index is compared only inside a group of boxes, called a stacking context, and most of this page is about that group: what makes one, what it traps, and the browser’s own way out of it, the top layer.',
    'By the end you can say why one box is drawn over another, why a z-index of 9999 can still lose, and how a popover, an element the browser itself shows and hides, is drawn over everything on the page. The last part builds this site’s banner that way. The first exhibit below is a pile of three cards with no z-index at all. Raise First with the pills and watch it come to the top.'
  ];

  test('should name the tab Z-index, and tell the problem, the page’s view and what a reader can do after, before the first exhibit', async () => {
    await openZIndexTab();
    const tab = await screen.findByRole('region', {name: 'Z-index'});
    const firstExhibit = within(tab).getByRole('heading', {name: 'Why Third is on top'});

    expect(within(tab).getAllByRole('heading', {level: 2})[0]).toHaveTextContent(/^Z-index$/);
    expect(outOfReadingOrder([...paragraphs.map(paragraph => within(tab).getByText(paragraph)), firstExhibit])).toEqual([]);
  });
});
