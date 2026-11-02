import {maybe} from '@ryandur/sand';
import {render} from '@testing-library/react';
import {TestApp} from '@__test_support/TestApp';
import {Paths} from '@pages/Paths';
import {demoPage, demosAt, demoTabs} from '@pages/Demos/__test_support';
import {outOfReadingOrder} from '@__test_support/reading-order';
import {explanation, recipeFolds} from '@pages/Demos/Recipe/__test_support';
import {accordionsTab} from '@pages/Demos/Accordions/__test_support/tab';

const htmlAlone = 'An accordion in HTML alone';

const togetherHeading = (type: string): string => `A ${type === 'exclusive' ? 'radio' : 'checkbox'} and a grid row: the old control, the new slide`;
const parts = ['How we used to build a fold', 'What the platform gives now', togetherHeading('exclusive'), 'How every fold moves'];

const exclusiveOnly = [/Close radio/, /share a name|same name|shared name/, /one fold open|one open at a time/, /A radio that loses its check/, /const \[open, setOpen] = useState<string>\(\);/];

describe('the accordions tab', () => {
  test.each(['inclusive', 'exclusive'])('should name no two regions the same, with %s chosen, so every landmark is its own', async type => {
    render(<TestApp at={demosAt('accordions', `?type=${type}`)}/>);

    await explanation.part('Accordions');
    const names = explanation.partNames();

    expect(names.filter((name, at) => names.indexOf(name) !== at)).toEqual([]);
  });

  test('should open on the three languages, say it assumes nothing from other tabs, then the choice between them, and bring the accordion in as the example, before the first accordion', async () => {
    render(<TestApp at={demosAt('accordions')}/>);

    const tab = await explanation.part('Accordions');
    const openings = [
      /^A web page is written in three languages\./,
      /^Nothing here leans on another tab\.$/,
      /^You don’t always need all three languages\./,
      /^The thing is an accordion:/,
      /^Sliding it open is the hard part\./,
      /^By the end you can build an accordion.* say which language each job needed and why\./
    ];

    expect(outOfReadingOrder([...openings.map(opening => explanation.saying(tab, opening)), explanation.foldsIn(tab)[0]])).toEqual([]);
  });

  test('should start with HTML alone, then the fold choices, then tell the old way, the platform, the two together, and how every fold moves', async () => {
    render(<TestApp at={demosAt('accordions')}/>);

    const tab = await explanation.part('Accordions');

    expect(explanation.partTitles(tab)).toEqual([htmlAlone, 'fold choices', ...parts]);
  });

  test('should name the fold choices’ section by its heading, with the line and both rows inside it', async () => {
    render(<TestApp at={demosAt('accordions')}/>);

    const choices = await explanation.part('fold choices');

    expect(explanation.saying(choices, /^Two choices set the accordions in the sections below/)).toBeVisible();
    expect(accordionsTab.choiceIn(choices, 'fold type')).toBeVisible();
    expect(accordionsTab.choiceIn(choices, 'fold motion')).toBeVisible();
  });

  test('should open on the exclusive type, and write the type chosen into the address', async () => {
    render(<TestApp at={demosAt('accordions')}/>);
    const types = await accordionsTab.choice('fold type');
    expect(accordionsTab.option(types, 'Exclusive')).toBeChecked();

    await accordionsTab.choose('fold type', 'Inclusive');

    expect(demoPage.urlSearch()).toHaveTextContent('type=inclusive');
    expect(accordionsTab.option(types, 'Inclusive')).toBeChecked();
  });

  test.each([
    ['inclusive', parts[0], ['Accordion using checkboxes and a measured height', 'Accordion using checkboxes and a known height']],
    ['inclusive', parts[1], ['Inclusive accordion using details elements']],
    ['inclusive', togetherHeading('inclusive'), ['Inclusive accordion using checkboxes']],
    ['exclusive', parts[0], ['Accordion using a radio group and a measured height', 'Accordion using a radio group and a known height']],
    ['exclusive', parts[1], ['Exclusive accordion using details elements']],
    ['exclusive', togetherHeading('exclusive'), ['Exclusive accordion using radio group']]
  ])('should show, with %s chosen, under "%s" the build of that type', async (type, part, builds) => {
    render(<TestApp at={demosAt('accordions', `?type=${type}`)}/>);

    const explained = await explanation.part(part);

    expect(accordionsTab.buildsIn(explained)).toEqual(builds);
  });
});

describe('the accordions tab’s own words', () => {
  test.each([
    'Every fold on this tab moves by transition, never by animation, because a reader may press again before the fold lands. If they do, a transition turns around from wherever it is. An animation plays a set of keyframes on its own clock, whatever the state does.',
    'The script makes the moves in two layout effects, code React runs after it has updated the elements and before the browser paints them. The first answers a press by pinning where the motion starts. The second, once that start is on the page, sets where it ends. So the script measures the panel and pins its start with no frame showing in between.',
    'Whether a tall fold’s last line is cut off depends on where its lines fall, so the section wears foot-shadowed. That class paints a shadow at the section’s foot, and over it a cover in the panel’s color that scrolls with the text. The cover hides the shadow when the text is at its end, or when the text fits.',
    'The third sets view transitions, the browser’s moves from one page state to the next, to no animation at all.',
    'You don’t always need all three languages. HTML does some jobs alone, and HTML with CSS does more, before you need script. If you know how each one works, you can choose the one the job needs.',
    'The sections below are about making it slide, starting with how we did it before the browser could.',
    'The cost was the timing. The transition spent its whole time crossing the guess, so a short fold opened in a rush and then sat still, and on closing it waited, unmoving, until the guess fell to its text. The bigger the guess, the worse the rush and the wait. A guess too small cut the text off.',
    'You want the text to slide open, not appear at once.'
  ])('should say, whatever the dials, words and links together: %s', async sentence => {
    render(<TestApp at={demosAt('accordions')}/>);

    expect(await explanation.part('Accordions')).toHaveTextContent(sentence);
  });

  test.each([
    {choice: 'style=drawer', sentence: 'One transition moves it all, so no part can fall behind another. The drawer works around no browser limit. I built it to show what grid alignment does on its own.'},
    {choice: 'type=exclusive', sentence: 'Radios that share a name keep one fold open on their own, which checkboxes cannot do without script. What a radio cannot do is close itself: pressed again, it stays checked. So I add that with a little script on the list. The radios stay plain.'},
    {choice: 'type=exclusive', sentence: 'The change event is the one the browser sends to the radio a press has just checked, and to no other. By the time it fires, Firefox and Safari have already applied the pressed box’s new style. So the script pins the start first, with unmoving, as the plain script does.'},
    {choice: 'type=inclusive', sentence: 'The change event is the one the browser sends to the checkbox a press has just checked or unchecked, and to no other. By the time it fires, Firefox and Safari have already applied the pressed box’s new style.'},
    {choice: 'style=drawer', sentence: 'With the drawer, the size moves on the same 300 milliseconds, and the part a details hides lays its text out as a column set at its end. The text has flex-shrink 0, so it keeps its height, and what the size does not hold yet is the text’s top. Its bottom stays on the fold’s edge as it slides down from under the bar. Content-visibility hides the closed content and has no values between on and off; allow-discrete lets it switch at the end of a close and at the start of an open, which keeps the text visible for the whole slide.'},
    {choice: 'style=reveal', sentence: 'With reveal, the size moves over 300 milliseconds with ease-in-out, and the text shows from its top down.'},
    {choice: 'style=reveal', sentence: 'Reveal moves the row on a transition, 300 milliseconds of ease-in-out. The text shows from its top down as the row grows.'},
    {choice: 'type=exclusive', sentence: 'Most of us turned next to script. A transition can move a height to a number'},
    {choice: 'type=inclusive', sentence: 'Most of us turned next to script. A transition can move a height to a number'},
    {choice: 'style=drawer', sentence: 'With the drawer, the height moves over 300 milliseconds with ease-in-out, which starts slowly, speeds up and slows to a stop, and the text slides down from under the bar.'},
    {choice: 'type=exclusive', sentence: 'This build is a disclosure: a bar you press to show the text under it. It has no script.'}
  ])('should say, with $choice, words and links together: $sentence', async ({choice, sentence}) => {
    render(<TestApp at={demosAt('accordions', `?${choice}`)}/>);

    expect(await explanation.part('Accordions')).toHaveTextContent(sentence);
  });
});

describe('the measured build’s Close bar', () => {
  test('should explain the Close bar in a run of its own in "How this site does it", first after the build that has it, with exclusive chosen', async () => {
    render(<TestApp at={demosAt('accordions', '?type=exclusive')}/>);
    const oldWay = await explanation.part(parts[0]);
    const folded = recipeFolds.story(oldWay, 'How this site does it');
    const closeBar = explanation.saying(folded, 'Opening one fold closes the others, and the short Close bar at the top closes whichever is open.');

    expect(outOfReadingOrder([
      accordionsTab.buildTitled(folded, 'Accordion using a radio group and a measured height'),
      closeBar,
      explanation.saying(folded, /^React, the library this site’s script is written in, keeps what it knows in state/)
    ])).toEqual([]);
  });
});

describe('the accordions explanation', () => {
  test.each([parts[0], parts[1], togetherHeading('inclusive')])('should show, with inclusive chosen, none of the radio builds’ words or code under "%s"', async part => {
    render(<TestApp at={demosAt('accordions', '?type=inclusive')}/>);

    const explained = await explanation.part(part);

    for (const words of exclusiveOnly) {
      expect(explained).not.toHaveTextContent(words);
    }
  });

  test('should show, with exclusive chosen, the radio builds’ words and code', async () => {
    render(<TestApp at={demosAt('accordions', '?type=exclusive')}/>);

    const tab = await explanation.part('Accordions');

    for (const words of exclusiveOnly) {
      expect(tab).toHaveTextContent(words);
    }
  });

  test.each(['inclusive', 'exclusive'])('should say, with %s chosen, that the old build and the platform build have no script', async type => {
    render(<TestApp at={demosAt('accordions', `?type=${type}`)}/>);

    expect(explanation.saying(await explanation.part(parts[0]), /It has\s+no script/)).toBeInTheDocument();
    expect(explanation.saying(await explanation.part(parts[1]), /There is no script here either/)).toBeInTheDocument();
  });
});

describe('the words and the code chosen by type', () => {

  const labelNamesItsInput = (html: string): boolean =>
    maybe(/<input id="([^"]+)"/.exec(html)?.[1]).map(id => html.includes(`for="${id}"`)).orElse(false);

  test('should, with inclusive chosen, call the box a checkbox where the runs hide it and say what a screen reader announces', async () => {
    render(<TestApp at={demosAt('accordions', '?type=inclusive')}/>);

    const oldWay = await explanation.part(parts[0]);

    expect(explanation.saying(oldWay, /so you hide the checkbox\./)).toBeInTheDocument();
    expect(oldWay).toHaveTextContent(/a checkbox, checked or not checked\./);
  });

  test('should, with exclusive chosen, call the box a radio where the runs hide it and say what a screen reader announces', async () => {
    render(<TestApp at={demosAt('accordions', '?type=exclusive')}/>);

    const oldWay = await explanation.part(parts[0]);

    expect(explanation.saying(oldWay, /so you hide the radio\./)).toBeInTheDocument();
    expect(oldWay).toHaveTextContent(/a radio, one of six\./);
  });

  test('should, with inclusive chosen, show the plain fold’s own HTML beside the run on the box, a checkbox whose label’s for names it', async () => {
    render(<TestApp at={demosAt('accordions', '?type=inclusive')}/>);

    const oldWay = await explanation.part(parts[0]);
    const html = explanation.codeBeside(oldWay, /To open and close a fold/).textContent ?? '';

    expect(explanation.sourcesBeside(oldWay, /To open and close a fold/)).toEqual(['Plain/fold.html on GitHub']);
    expect(html).toContain('type="checkbox"');
    expect(labelNamesItsInput(html)).toBe(true);
  });

  test('should, with exclusive chosen, show one fold’s HTML written for the page beside the run on the box, a radio in a named group whose label’s for names it', async () => {
    render(<TestApp at={demosAt('accordions', '?type=exclusive')}/>);

    const oldWay = await explanation.part(parts[0]);
    const html = explanation.codeBeside(oldWay, /To open and close a fold/).textContent ?? '';

    expect(explanation.writtenForThePageBeside(oldWay, /To open and close a fold/)).toBe(true);
    expect(html).toMatch(/type="radio" name="/);
    expect(labelNamesItsInput(html)).toBe(true);
  });

  test('should, with inclusive chosen, draw the platform’s answer as needing a checkbox', async () => {
    render(<TestApp at={demosAt('accordions', '?type=inclusive')}/>);

    expect(explanation.drawingNamed(await explanation.part(parts[1]), /needs a checkbox,/)).toBeInTheDocument();
  });

  test('should, with exclusive chosen, draw the platform’s answer as needing a radio', async () => {
    render(<TestApp at={demosAt('accordions', '?type=exclusive')}/>);

    expect(explanation.drawingNamed(await explanation.part(parts[1]), /needs a radio,/)).toBeInTheDocument();
  });
});

describe('what the platform gives now', () => {
  test('should show the inclusive build’s own details, with no shared name, beside the run that introduces details', async () => {
    render(<TestApp at={demosAt('accordions', '?type=inclusive')}/>);

    const explained = await explanation.part(parts[1]);

    expect(explanation.sourcesBeside(explained, /This build uses details and summary/)).toEqual(['Accordions/Accordions.tsx on GitHub']);
    expect(explanation.codeBeside(explained, /This build uses details and summary/)).toHaveTextContent('<details');
    expect(explanation.codeBeside(explained, /This build uses details and summary/)).not.toHaveTextContent('name=');
  });

  test('should show the exclusive build’s own details sharing one name, which is what makes them exclusive, beside the run that introduces details', async () => {
    render(<TestApp at={demosAt('accordions', '?type=exclusive')}/>);

    const explained = await explanation.part(parts[1]);

    expect(explanation.sourcesBeside(explained, /This build uses details and summary/)).toEqual(['Accordions/Accordions.tsx on GitHub']);
    expect(explanation.codeBeside(explained, /This build uses details and summary/)).toHaveTextContent(/<details[^>]* name=/);
  });
});

describe('the two together', () => {
  test('should show, with inclusive chosen, the checkbox build\'s label beside its run', async () => {
    render(<TestApp at={demosAt('accordions', '?type=inclusive')}/>);

    const explained = await explanation.part(togetherHeading('inclusive'));

    expect(explanation.codeBeside(explained, /The inclusive build keeps the checkbox/)).toHaveTextContent('type="checkbox"');
  });

  test('should show, with exclusive chosen, the script that lets a radio close beside its run', async () => {
    render(<TestApp at={demosAt('accordions', '?type=exclusive')}/>);

    const explained = await explanation.part(togetherHeading('exclusive'));

    expect(explanation.codeBeside(explained, /The exclusive build keeps the radio group/)).toHaveTextContent('const openAfter');
  });
});

describe('the measured build', () => {
  test('should say what React, its state, a ref and a layout effect are, each beside its own lines, before the runs that use them', async () => {
    render(<TestApp at={demosAt('accordions')}/>);

    const explained = await explanation.part(parts[0]);
    const state = explanation.runTelling(explained, /^React, the library this site’s script is written in, keeps what it knows in state/);
    const ref = explanation.runTelling(explained, /The script uses the panel’s one ref only to/);
    const effects = explanation.runTelling(explained, /The script makes the moves in two layout effects/);

    expect(state).toHaveTextContent('React, the library this site’s script is written in, keeps what it knows in state. State is a value a component holds and draws from. Here it is whether a fold is open, and, while it moves, first the height the motion starts from, then the height it ends at, and whether it has started. The z-index tab says more about state.');
    expect(ref).toHaveTextContent('A ref is a handle on the element itself');
    expect(effects).toHaveTextContent('layout effects, code React runs after it has updated the elements and before the browser paints them');
    expect(explanation.everyCodeBeside(explained, /^React, the library this site’s script is written in, keeps what it knows in state/).join()).toContain('useState');
    expect(explanation.everyCodeBeside(explained, /The script uses the panel’s one ref only to/).join()).toContain('useRef');
    expect(explanation.everyCodeBeside(explained, /The script makes the moves in two layout effects/).join().match(/useLayoutEffect\(/g)).toHaveLength(2);
    expect(outOfReadingOrder([state, ref, effects, explanation.runTelling(explained, /The React build hands each height to the style sheet/)])).toEqual([]);
  });

  test('should say, with exclusive chosen, that the change bubbles to the list item that records its own key, in a run of its own', async () => {
    render(<TestApp at={demosAt('accordions', '?type=exclusive')}/>);

    const explained = await explanation.part(parts[0]);

    expect(explanation.runTelling(explained, /^A radio that loses its check/)).toHaveTextContent('A radio that loses its check gets no event at all. The change event the pressed radio gets rises from it through the elements around it, which is called bubbling. The list item around the radio handles it by recording its own key in React state as the open one, and the fold whose key is no longer the open one closes from that state.');
  });

  test.each(['inclusive', 'exclusive'])('should say, with %s chosen, in a run of its own, that the measured build turns off the move to auto', async type => {
    render(<TestApp at={demosAt('accordions', `?type=${type}`)}/>);

    const explained = await explanation.part(parts[0]);

    expect(explanation.runTelling(explained, /^This page lets its other folds move to auto/)).toHaveTextContent('This page lets its other folds move to auto, and this build turns that off with interpolate-size, because the trick was for browsers that could only move between numbers.');
  });

  test('should show the whole plain script, with no React in it, beside the run that opens a fold, and say it is the whole of it', async () => {
    render(<TestApp at={demosAt('accordions')}/>);

    const explained = await explanation.part(parts[0]);
    const run = explanation.runTelling(explained, /When the motion ends, the script takes the number away/);
    const code = explanation.everyCodeBeside(explained, /When the motion ends, the script takes the number away/).join();

    expect(run).toHaveTextContent('A number left in place goes stale: narrow the window, the text wraps onto more lines, and a fixed height cuts it off. The script beside this run is the whole script, with no library.');
    expect(code).toMatch(/addEventListener\('change'[^]*getBoundingClientRect\(\)\.height/);
    expect(code).toMatch(/addEventListener\('transitionend'/);
    expect(code).toMatch(/classList\.remove\('sized'\)/);
    expect(code).not.toMatch(/React|use[A-Z]|setMotion/);
  });

  test('should put the fold measured by plain script at that run, ahead of the run, with what to press', async () => {
    render(<TestApp at={demosAt('accordions')}/>);

    const explained = await explanation.part(parts[0]);
    const plain = await accordionsTab.foldMeasuredByPlainScript(explained);

    expect(explanation.saying(explained, /^Press the bar: with motion allowed/)).toBeVisible();
    expect(outOfReadingOrder([plain, explanation.runTelling(explained, /^Most of us turned next to script/)])).toEqual([]);
  });

  test.each(['inclusive', 'exclusive'])('should keep, with %s chosen, the React build in "How this site does it", opening on why it differs from the plain script, then its accordion', async type => {
    render(<TestApp at={demosAt('accordions', `?type=${type}`)}/>);

    const explained = await explanation.part(parts[0]);
    const folded = recipeFolds.story(explained, 'How this site does it');
    const why = explanation.saying(folded, /^This site builds the same fold in React/);
    const built = accordionsTab.buildTitled(folded, /and a measured height$/);

    expect(why).toHaveTextContent('This site builds the same fold in React, and the runs below say what React and state are as they come. What changes is the shape. The plain script listens for the press; the React build redraws the panel from what it holds, so the measuring runs in two steps React takes before the browser paints: the first pins where the motion starts, and the second sets where it ends.');
    expect(outOfReadingOrder([why, built, explanation.runTelling(explained, /^React, the library this site’s script is written in, keeps what it knows in state/)])).toEqual([]);
  });

  const handsTheHeight = /^The script hands the height to the style sheet as a custom property/;
  const pinsTheStart = /^On a press that moves the panel/;

  test('should show the sized rule, and not the unmoving one, beside the run that hands the height to the style sheet', async () => {
    render(<TestApp at={demosAt('accordions')}/>);

    const explained = await explanation.part(parts[0]);

    expect(explanation.everyCodeBeside(explained, handsTheHeight).join()).toMatch(/\.info-measured\.sized \{/);
    expect(explanation.everyCodeBeside(explained, handsTheHeight).join()).not.toMatch(/\.info-measured\.unmoving \{/);
  });

  test('should show the unmoving rule beside the run on how a press that moves the panel pins where the slide starts', async () => {
    render(<TestApp at={demosAt('accordions')}/>);

    const explained = await explanation.part(parts[0]);

    expect(explanation.everyCodeBeside(explained, pinsTheStart).join()).toMatch(/\.info-measured\.unmoving \{/);
  });

  test('should tell the plain script in order: the measuring, the handing over, the pin, then the cost', async () => {
    render(<TestApp at={demosAt('accordions')}/>);

    const explained = await explanation.part(parts[0]);

    expect(outOfReadingOrder([
      explanation.runTelling(explained, /^Most of us turned next to script/),
      explanation.runTelling(explained, handsTheHeight),
      explanation.runTelling(explained, pinsTheStart),
      explanation.runTelling(explained, /^The cost was script/)
    ])).toEqual([]);
  });

  test('should show the fold measured by plain script as a figure named by its caption, under the heading "The measured height"', async () => {
    render(<TestApp at={demosAt('accordions')}/>);

    const measured = await explanation.part('The measured height');

    expect(explanation.drawingNamed(measured, /^Press the bar: with motion allowed/)).toContainElement(await accordionsTab.foldMeasuredByPlainScript(measured));
  });

  test('should show the React build’s own two layout effects and its hand-off at the motion’s end beside the run that tells the two layout effects', async () => {
    render(<TestApp at={demosAt('accordions')}/>);

    const explained = await explanation.part(parts[0]);
    const code = explanation.everyCodeBeside(explained, /The script makes the moves in two layout effects/).join();

    expect(explanation.sourcesBeside(explained, /The script makes the moves in two layout effects/)).toEqual(['Accordions/MeasuredPanel.tsx on GitHub']);
    expect(code.match(/useLayoutEffect\(/g)).toHaveLength(2);
    expect(code).toContain('TransitionEvent');
  });

  test('should show @property beside the run that declares it, .sized beside the run that names the class, and .unmoving beside the run that closes', async () => {
    render(<TestApp at={demosAt('accordions')}/>);

    const explained = await explanation.part(parts[0]);

    expect(explanation.everyCodeBeside(explained, /^The React build hands each height to the style sheet/).join()).toMatch(/@property --measured-height \{[^]*initial-value: auto;/);
    expect(explanation.everyCodeBeside(explained, /^The React build marks the panel/).join()).toMatch(/\.info-measured\.sized \{/);
    expect(explanation.everyCodeBeside(explained, /^Closing runs the other way/).join()).toMatch(/\.info-measured\.unmoving \{/);
  });

  test('should tell the property, then the class, then closing, each in a run of its own', async () => {
    render(<TestApp at={demosAt('accordions')}/>);

    const explained = await explanation.part(parts[0]);

    expect(outOfReadingOrder([
      explanation.runTelling(explained, /^The React build hands each height to the style sheet/),
      explanation.runTelling(explained, /^The React build marks the panel/),
      explanation.runTelling(explained, /^Closing runs the other way/)
    ])).toEqual([]);
  });

  test('should say, in the React build’s class run, only what React adds: it marks the panel sized as the plain one does', async () => {
    render(<TestApp at={demosAt('accordions')}/>);

    const named = explanation.runTelling(await explanation.part(parts[0]), /^The React build marks the panel/);

    expect(named).toHaveTextContent('The React build marks the panel sized as the plain one does. While sized is on, the panel’s height reads --measured-height.');
    expect(named).not.toHaveTextContent(/a name an element wears/);
  });

  test('should not say the sized panel takes its own height, a moment the script never reaches', async () => {
    render(<TestApp at={demosAt('accordions')}/>);

    const named = explanation.runTelling(await explanation.part(parts[0]), /^The React build marks the panel/);

    expect(named).not.toHaveTextContent(/takes its own height/);
  });

  test('should open the closing run with what closing does', async () => {
    render(<TestApp at={demosAt('accordions')}/>);

    const closing = explanation.runTelling(await explanation.part(parts[0]), /^Closing runs the other way/);

    expect(closing).toHaveTextContent('Closing runs the other way: the script sets the open height as the start and 0 as the end, and the transition moves between them.');
  });

  test('should show the script that turns a fold around beside the run that tells it', async () => {
    render(<TestApp at={demosAt('accordions')}/>);

    const explained = await explanation.part(parts[0]);

    expect(explanation.sourcesBeside(explained, /turns around from where it is/)).toEqual(['Accordions/MeasuredPanel.tsx on GitHub']);
    expect(explanation.everyCodeBeside(explained, /turns around from where it is/).join()).toContain('movingTo');
  });
});

describe('the fold choices', () => {
  test('should read the chosen motion and the less-motion sentence as two sentences with the styles off', async () => {
    render(<TestApp at={demosAt('accordions', '?style=drawer')}/>);

    const row = await accordionsTab.choiceRow('fold motion');

    expect(accordionsTab.readingIn(row).textContent).toBe('The text slides down from under its bar. If your system asks for less motion, every fold here opens at once, whichever you choose.');
  });

  test('should say, before the rows, which accordions they set', async () => {
    render(<TestApp at={demosAt('accordions')}/>);

    const types = await accordionsTab.choice('fold type');
    const line = explanation.saying(await explanation.part('Accordions'), 'Two choices set the accordions in the sections below, except the fold measured by plain script, which is one checkbox fold and always reveals. Each choice is a dial, a control on the page that sets how a build behaves, with a line beside it saying what it does. The fold type also reaches the accordion above: with exclusive, its details share a name and opening one closes the others.');

    expect(outOfReadingOrder([await explanation.part(htmlAlone), line, types])).toEqual([]);
  });

  test('should say, after which accordions the rows set and before the rows, why the motion does not reach the first', async () => {
    render(<TestApp at={demosAt('accordions')}/>);

    const tab = await explanation.part('Accordions');
    const why = explanation.saying(tab, /^The fold motion does not reach the accordion above/);

    expect(outOfReadingOrder([explanation.saying(tab, /^Two choices set the accordions/), why, await accordionsTab.choice('fold type')])).toEqual([]);
  });

  test('should read the chosen fold type, and read the other once it is chosen', async () => {
    render(<TestApp at={demosAt('accordions')}/>);

    const row = await accordionsTab.choiceRow('fold type');

    expect(accordionsTab.readingIn(row)).toHaveTextContent('Opening one fold closes the others.');

    await accordionsTab.choose('fold type', 'Inclusive');

    expect(accordionsTab.readingIn(row)).toHaveTextContent('Any number of folds can be open at once.');
  });

  test.each([
    ['Reveal', 'static', 'The text is uncovered from its first line down.'],
    ['Drawer', 'static', 'The text slides down from under its bar.'],
    ['Static', 'reveal', 'The fold opens at once, with nothing moving.']
  ])('should read %s as the fold motion once it is chosen over %s', async (motion, from, reading) => {
    render(<TestApp at={demosAt('accordions', `?style=${from}`)}/>);

    const row = await accordionsTab.choiceRow('fold motion');
    await accordionsTab.choose('fold motion', motion);

    expect(accordionsTab.readingIn(row)).toHaveTextContent(reading);
  });
});

describe('the reset', () => {
  test('should be said once, where the fold choices first name it, so the reduced-motion run reads it as known', async () => {
    render(<TestApp at={demosAt('accordions')}/>);

    const everyFoldMoves = await explanation.part(parts[3]);

    expect(explanation.everySaying(await explanation.part('Accordions'), /The reset is the style sheet that sets every element’s defaults/)).toHaveLength(1);
    expect(explanation.saying(everyFoldMoves, /^When a reader asks for/)).toHaveTextContent('every fold opens with no slide. The reset has a reduced-motion block with three rules.');
  });
});

describe('the fold motion', () => {
  test('should sit after the accordion in HTML alone, right after the fold type, before the old way, and in no part', async () => {
    render(<TestApp at={demosAt('accordions')}/>);

    const tab = await explanation.part('Accordions');
    const start = explanation.partIn(tab, htmlAlone);
    const oldWay = explanation.partIn(tab, parts[0]);
    const foldType = accordionsTab.choiceIn(tab, 'fold type');
    const foldMotion = accordionsTab.choiceIn(tab, 'fold motion');

    expect(outOfReadingOrder([start, foldType, foldMotion, oldWay])).toEqual([]);
    for (const part of parts) {
      expect(await explanation.part(part)).not.toContainElement(foldMotion);
    }
  });

  test('should open on the reveal', async () => {
    render(<TestApp at={demosAt('accordions')}/>);

    const motions = await accordionsTab.choice('fold motion');

    expect(accordionsTab.option(motions, 'Reveal')).toBeChecked();
  });

  test('should write the motion chosen into the address', async () => {
    render(<TestApp at={demosAt('accordions')}/>);
    const motions = await accordionsTab.choice('fold motion');

    await accordionsTab.choose('fold motion', 'Drawer');

    expect(demoPage.urlSearch()).toHaveTextContent('style=drawer');
    expect(accordionsTab.option(motions, 'Drawer')).toBeChecked();
  });

  const partTwoSays = {
    reveal: /With reveal, the size moves over 300 milliseconds/,
    drawer: /With the drawer, the size moves on the same 300 milliseconds/,
    static: /With static, the part a details hides has no transition/
  };

  test.each([
    {style: 'reveal', others: ['drawer', 'static']},
    {style: 'drawer', others: ['reveal', 'static']},
    {style: 'static', others: ['reveal', 'drawer']}
  ] as const)('should tell, with $style chosen, only what the details builds do under that motion', async ({style, others}) => {
    render(<TestApp at={demosAt('accordions', `?style=${style}`)}/>);

    const platform = await explanation.part(parts[1]);

    expect(explanation.saying(platform, partTwoSays[style])).toBeInTheDocument();
    for (const other of others) {
      expect(explanation.saidIn(platform, partTwoSays[other])).not.toBeInTheDocument();
    }
  });

  test('should carve the details drawer rule beside the details run under the drawer', async () => {
    render(<TestApp at={demosAt('accordions', '?style=drawer')}/>);

    const platform = await explanation.part(parts[1]);

    expect(explanation.everyCodeBeside(platform, /A pseudo-element is a part of an element/).join()).toContain('.drawer &::details-content');
  });

  test.each(['reveal', 'static'])('should carve no details drawer rule under %s', async style => {
    render(<TestApp at={demosAt('accordions', `?style=${style}`)}/>);

    const platform = await explanation.part(parts[1]);

    expect(explanation.everyCodeBeside(platform, /A pseudo-element is a part of an element/).join()).not.toContain('.drawer &::details-content');
  });

  const knownHeight = ['.info, .info-text { height: 10lh;', '.info { overflow: hidden;', '.info-toggle:not(:checked) ~ .info { height: 0;'];

  const partOneSays = {
    reveal: /With reveal, the panel’s height moves over 300 milliseconds/,
    drawer: /With the drawer, the height moves over 300 milliseconds with ease-in-out/,
    static: /With static, nothing moves/
  };

  test.each([
    {style: 'reveal', others: ['drawer', 'static'], carves: [...knownHeight, ':is(.reveal, .drawer) & .info { transition: height'], omits: ['.drawer & .info']},
    {style: 'drawer', others: ['reveal', 'static'], carves: [...knownHeight, ':is(.reveal, .drawer) & .info { transition: height'], omits: ['.drawer & .info']},
    {style: 'static', others: ['reveal', 'drawer'], carves: knownHeight, omits: [':is(.reveal, .drawer) & .info', '.drawer & .info']}
  ] as const)('should tell, with $style chosen, only what that motion does under part one', async ({style, others, carves, omits}) => {
    render(<TestApp at={demosAt('accordions', `?style=${style}`)}/>);

    const oldWay = await explanation.part(parts[0]);

    expect(explanation.saying(oldWay, partOneSays[style])).toBeInTheDocument();
    for (const other of others) {
      expect(explanation.saidIn(oldWay, partOneSays[other])).not.toBeInTheDocument();
    }
    for (const rule of carves) {
      expect(explanation.codeBeside(oldWay, partOneSays[style])).toHaveTextContent(rule);
    }
    for (const rule of omits) {
      expect(explanation.codeBeside(oldWay, partOneSays[style])).not.toHaveTextContent(rule);
    }
  });

  const sectionSays = {
    reveal: /With reveal, the section sits at the panel’s top/,
    drawer: /With the drawer, the panel lays the section out as a column set at its end/
  };

  const visibilitySays = {
    reveal: /With reveal, visibility moves on the same 300 milliseconds/,
    drawer: /With the drawer, visibility moves on the same 300 milliseconds and changes at the visible end/
  };

  test.each([
    {style: 'reveal', other: 'drawer'},
    {style: 'drawer', other: 'reveal'}
  ] as const)('should tell, with $style chosen, what that motion does to the section and to visibility, each in its own run', async ({style, other}) => {
    render(<TestApp at={demosAt('accordions', `?style=${style}`)}/>);

    const oldWay = await explanation.part(parts[0]);

    expect(explanation.runTelling(oldWay, /Whether a tall fold’s last line is cut off/)).toHaveTextContent(sectionSays[style]);
    expect(explanation.runTelling(oldWay, /The section has a tabindex of 0/)).toHaveTextContent(visibilitySays[style]);
    expect(explanation.saidIn(oldWay, sectionSays[other])).not.toBeInTheDocument();
    expect(explanation.saidIn(oldWay, visibilitySays[other])).not.toBeInTheDocument();
  });

  test.each(['reveal', 'drawer'] as const)('should show, with %s chosen, the rule that moves visibility beside the visibility run', async style => {
    render(<TestApp at={demosAt('accordions', `?style=${style}`)}/>);

    const oldWay = await explanation.part(parts[0]);

    expect(explanation.codeBeside(oldWay, visibilitySays[style])).toHaveTextContent(/transition:[^;]*visibility/);
  });

  test('should show, with static chosen, no transition rule beside the visibility run', async () => {
    render(<TestApp at={demosAt('accordions', '?style=static')}/>);

    const oldWay = await explanation.part(parts[0]);

    expect(explanation.codeBeside(oldWay, /The section has a tabindex of 0/)).not.toHaveTextContent('transition:');
  });

  test('should show, with drawer chosen, the drawer’s column rules beside the section’s run', async () => {
    render(<TestApp at={demosAt('accordions', '?style=drawer')}/>);

    const oldWay = await explanation.part(parts[0]);

    expect(explanation.codeBeside(oldWay, sectionSays.drawer)).toHaveTextContent('.drawer & .info {');
    expect(explanation.codeBeside(oldWay, sectionSays.drawer)).toHaveTextContent('.drawer & .info-text {');
  });

  test('should show, with reveal chosen, none of the drawer’s rules beside the section’s run', async () => {
    render(<TestApp at={demosAt('accordions', '?style=reveal')}/>);

    const oldWay = await explanation.part(parts[0]);

    expect(explanation.codeBeside(oldWay, sectionSays.reveal)).not.toHaveTextContent('.drawer & .info');
  });

  test('should tell, with static chosen, nothing about motion in the section’s run or the visibility run', async () => {
    render(<TestApp at={demosAt('accordions', '?style=static')}/>);

    const oldWay = await explanation.part(parts[0]);

    expect(explanation.runTelling(oldWay, /Whether a tall fold’s last line is cut off/)).not.toHaveTextContent(/With static/);
    expect(explanation.runTelling(oldWay, /The section has a tabindex of 0/)).not.toHaveTextContent(/With static/);
  });

  test.each([
    {style: 'reveal', says: /With reveal and the drawer, a transition sits on every bar/, not: /With static the turn has no transition/},
    {style: 'drawer', says: /With reveal and the drawer, a transition sits on every bar/, not: /With static the turn has no transition/},
    {style: 'static', says: /With static the turn has no transition, so the corner turns at once/, not: /With reveal and the drawer, a transition sits on every bar/}
  ])('should tell, with $style chosen, how the arrow turns', async ({style, says, not}) => {
    render(<TestApp at={demosAt('accordions', `?style=${style}`)}/>);

    const oldWay = await explanation.part(parts[0]);

    expect(explanation.saying(oldWay, says)).toBeInTheDocument();
    expect(explanation.saidIn(oldWay, not)).not.toBeInTheDocument();
  });

  const partThreeSays = {
    reveal: /Reveal moves the row on a transition/,
    drawer: /Drawer moves the row on the same transition/,
    static: /Static matches neither class/
  };

  test.each([
    {style: 'reveal', others: ['drawer', 'static'], drawn: ['A row that grows to its content', 'The padding inside the clip']},
    {style: 'drawer', others: ['reveal', 'static'], drawn: ['A row that grows to its content', 'The padding inside the clip', 'The text rides the row’s edge']},
    {style: 'static', others: ['reveal', 'drawer'], drawn: ['A row that grows to its content', 'The padding inside the clip']}
  ] as const)('should tell, with $style chosen, only what that motion does under part three', async ({style, others, drawn}) => {
    render(<TestApp at={demosAt('accordions', `?style=${style}`)}/>);

    const together = await explanation.part(parts[2]);

    expect(explanation.saying(together, partThreeSays[style])).toBeInTheDocument();
    for (const other of others) {
      expect(explanation.saidIn(together, partThreeSays[other])).not.toBeInTheDocument();
    }
    expect(drawn.map(title => explanation.drawingNamed(together, new RegExp(`^${title}\\.`))))
      .toEqual(explanation.drawingsIn(together));
  });

  test('should tell the drawer run under the drawer', async () => {
    render(<TestApp at={demosAt('accordions', '?style=drawer')}/>);

    const together = await explanation.part(parts[2]);

    expect(explanation.saying(together, /With the drawer, the text slides down/)).toBeInTheDocument();
  });

  test('should keep the words around the drawer run’s quoted CSS apart', async () => {
    render(<TestApp at={demosAt('accordions', '?style=drawer')}/>);

    const together = await explanation.part(parts[2]);

    const run = explanation.saying(together, /With the drawer, the text slides down/);

    expect(run).toHaveTextContent(/so align-content: end sets/);
    expect(run).toHaveTextContent(/Then align-self: end sets/);
  });

  test.each(['reveal', 'static'])('should tell no drawer run under %s', async style => {
    render(<TestApp at={demosAt('accordions', `?style=${style}`)}/>);

    const together = await explanation.part(parts[2]);

    expect(explanation.saidIn(together, /With the drawer, the text slides down/)).not.toBeInTheDocument();
  });

  test('should keep an open fold open when the reader chooses another motion', async () => {
    render(<TestApp at={demosAt('accordions')}/>);
    const together = await explanation.part(parts[2]);
    const first = await accordionsTab.openFirstFold(together);

    await accordionsTab.choose('fold motion', 'Drawer');

    expect(first).toBeChecked();
  });
});

describe('how every fold moves', () => {
  test('should show the one block that opens every fold at once for a reader who asks for less motion', async () => {
    render(<TestApp at={demosAt('accordions')}/>);

    const explained = await explanation.part(parts[3]);
    const shown = explanation.codeShown(explained).join('\n');

    expect(shown).toContain('@media (prefers-reduced-motion: reduce)');
    expect(shown).toContain('::details-content');
    expect(shown).toContain('::view-transition-group(*)');
  });
});

describe('the accordions diagrams', () => {
  test.each([
    ['inclusive', parts[0], ['The rule matches the box', 'One guess, two folds', 'The known height', 'Off screen, not gone', 'Two borders, turned', 'Focus on the box, drawn on the bar']],
    ['exclusive', parts[0], ['The rule matches the box', 'One guess, two folds', 'The known height', 'Off screen, not gone', 'Two borders, turned', 'Focus on the box, drawn on the bar', 'One name, one choice']],
    ['inclusive', parts[1], ['One job, two ways', 'Three pieces become two', 'Sized to the text']],
    ['exclusive', parts[1], ['One job, two ways', 'Three pieces become two', 'Sized to the text']]
  ])('should draw, with %s chosen, under "%s" each mechanism in order, named by its title and one sentence', async (type, part, titles) => {
    render(<TestApp at={demosAt('accordions', `?type=${type}`)}/>);

    const explained = await explanation.part(part);

    expect(titles.map(title => explanation.drawingNamed(explained, new RegExp(`^${title}\\. \\S.*\\.$`))))
      .toEqual(explanation.drawingsIn(explained));
  });

  test('should set out, with exclusive chosen, what each element promises, row by row, as a table', async () => {
    render(<TestApp at={demosAt('accordions', '?type=exclusive')}/>);

    const explained = await explanation.part(togetherHeading('exclusive'));
    expect(accordionsTab.promises(explained)).toEqual(expect.arrayContaining(['checkbox yes no', 'radio no yes', 'details with a name yes yes']));
  });
});

describe('the max-height guess', () => {
  test('should say the old fold moved the panel’s max-height instead of its height', async () => {
    render(<TestApp at={demosAt('accordions')}/>);

    const oldWay = await explanation.part(parts[0]);

    expect(explanation.partIn(oldWay, 'The max-height guess')).toHaveTextContent('so we moved the panel’s max-height instead, from 0 to a number taller than any fold would need, such as 1000px.');
  });

  test('should open part one on the code of the guess, beside its heading', async () => {
    render(<TestApp at={demosAt('accordions')}/>);

    const oldWay = await explanation.part(parts[0]);

    expect(explanation.codeShown(explanation.partIn(oldWay, 'The max-height guess')).join())
      .toMatch(/max-height: 0;[^]*transition: max-height .3s ease-in-out;[^]*max-height: 1000px;/);
  });

  test.each([
    ['inclusive', 'Accordion using checkboxes and a measured height', 'Accordion using checkboxes and a known height'],
    ['exclusive', 'Accordion using a radio group and a measured height', 'Accordion using a radio group and a known height']
  ])('should outline part one, with %s chosen, as what a fold remembers, the guess, the measured height, then the known height', async (type, measured, known) => {
    render(<TestApp at={demosAt('accordions', `?type=${type}`)}/>);

    const oldWay = await explanation.part(parts[0]);

    expect(explanation.sectionTitles(oldWay)).toEqual(['A box remembers the fold, and a rule reads it', 'The max-height guess', 'The measured height', measured, known]);
  });
});

const everyTypeAndMotion = ['inclusive', 'exclusive'].flatMap(type => ['reveal', 'drawer', 'static'].map(style => ({type, style})));

describe('what the newer builds end', () => {
  test.each(everyTypeAndMotion)('should name, with $type and $style chosen, the three old ways the details builds replace', async ({type, style}) => {
    render(<TestApp at={demosAt('accordions', `?type=${type}&style=${style}`)}/>);

    const platform = await explanation.part(parts[1]);

    expect(explanation.runTelling(platform, /This build replaces the three old ways/)).toHaveTextContent(/the max-height guess, the height measured by script, and the known height/);
  });

  test('should say the grid row guesses, measures and fixes nothing, and scrolls no text', async () => {
    render(<TestApp at={demosAt('accordions')}/>);

    const together = await explanation.part(parts[2]);

    expect(explanation.runTelling(together, /The row always ends at the content’s own height/))
      .toHaveTextContent(/nothing is guessed, nothing is measured by script, nothing is fixed, and no text has to scroll/);
  });

  test.each(everyTypeAndMotion)('should say no sentence twice in the runs’ paragraphs or the figures’ captions, with $type and $style chosen', async ({type, style}) => {
    render(<TestApp at={demosAt('accordions', `?type=${type}&style=${style}`)}/>);

    const tab = await explanation.part('Accordions');
    const sentences = [...explanation.paragraphsIn(tab), ...explanation.captionsIn(tab)]
      .flatMap(text => text.split(/(?<=[.!?])\s+/))
      .map(sentence => sentence.trim())
      .filter(sentence => sentence.length > 0);

    expect(sentences.filter((sentence, at) => sentences.indexOf(sentence) !== at)).toEqual([]);
  });
});

describe('the accordion in HTML alone', () => {
  test('should hold three folds, basalt, cinder and meadow, in that order', async () => {
    render(<TestApp at={demosAt('accordions')}/>);

    const folds = explanation.foldsIn(await explanation.part(htmlAlone));

    expect(folds).toHaveLength(3);
    ['basalt', 'cinder', 'meadow'].forEach((name, at) => expect(explanation.saying(folds[at], name)).toBeInTheDocument());
  });

  test('should open its part on the three folds, in the same run as their markup', async () => {
    render(<TestApp at={demosAt('accordions')}/>);

    const firstRun = explanation.runsIn(await explanation.part(htmlAlone))[0];

    expect(explanation.foldsIn(firstRun)).toHaveLength(3);
  });

  test('should show the folds’ whole markup in the part’s first run, with no class and no script', async () => {
    render(<TestApp at={demosAt('accordions')}/>);

    const code = await accordionsTab.htmlAloneMarkup();

    expect(code).toMatch(/<ul>[^]*<details[^]*<summary>basalt<\/summary>[^]*<summary>meadow<\/summary>[^]*<\/ul>/);
    expect(code).not.toMatch(/className|on[A-Z]\w*=/);
  });

  test('should show, with inclusive chosen, folds that share no name, so each opens on its own', async () => {
    render(<TestApp at={demosAt('accordions', '?type=inclusive')}/>);

    expect(await accordionsTab.htmlAloneMarkup()).not.toContain('name=');
  });

  test('should show, with exclusive chosen, one name shared by every details, so opening one closes the others', async () => {
    render(<TestApp at={demosAt('accordions', '?type=exclusive')}/>);

    const names = [...(await accordionsTab.htmlAloneMarkup()).matchAll(/<details name="([^"]+)"/g)].map(([, name]) => name);

    expect(names).toHaveLength(3);
    expect(new Set(names).size).toBe(1);
  });
});

describe('the name that makes the first accordion exclusive', () => {
  const carriesAName = /^Each of these details carries/;

  test('should, with exclusive chosen, say after the details and summary run that details sharing a name close one another, with name linked to MDN', async () => {
    render(<TestApp at={demosAt('accordions', '?type=exclusive')}/>);

    const first = await explanation.part(htmlAlone);

    expect(explanation.runTelling(first, carriesAName)).toHaveTextContent('Each of these details carries a name attribute, a setting written inside the element’s opening tag, and details that share a name close one another: open one and the browser shuts the rest. It needs no CSS and no script.');
    expect(explanation.linksBeside(first, carriesAName)).toEqual([['name', 'https://developer.mozilla.org/en-US/docs/Web/HTML/Element/details#name']]);
    expect(outOfReadingOrder([explanation.runTelling(first, /The summary is the bar\./), explanation.runTelling(first, carriesAName)])).toEqual([]);
  });

  test('should, with inclusive chosen, say nothing of a name beside the first accordion, whose details carry none', async () => {
    render(<TestApp at={demosAt('accordions', '?type=inclusive')}/>);

    expect(explanation.saidIn(await explanation.part(htmlAlone), carriesAName)).not.toBeInTheDocument();
  });
});

describe('the depth of each part', () => {
  test.each([
    {type: 'exclusive', part: parts[0], fold: 'How this site does it', point: /Most of us turned next to script/, depth: /Closing runs the other way/},
    {type: 'exclusive', part: parts[0], fold: 'How the known height works', point: /Here every panel is the same height/, depth: /You want the reader to see a bar/},
    {type: 'exclusive', part: parts[1], fold: 'How details works', point: /This build replaces the three old ways/, depth: /A pseudo-element is a part of an element/},
    {type: 'exclusive', part: parts[2], fold: 'How the radio and the grid row work together', point: /A grid row can slide open to its content’s height/, depth: /A row closes only as far as its item can/},
    {type: 'inclusive', part: togetherHeading('inclusive'), fold: 'How the checkbox and the grid row work together', point: /A grid row can slide open to its content’s height/, depth: /A row closes only as far as its item can/}
  ])('should keep, with $type chosen, under "$part", a closed fold named "$fold" with the depth inside it and the point outside it', async ({type, part, fold, point, depth}) => {
    render(<TestApp at={demosAt('accordions', `?type=${type}`)}/>);

    const explained = await explanation.part(part);
    const folded = recipeFolds.story(explained, fold);

    expect(folded).toContainElement(explanation.saying(explained, depth));
    expect(explanation.saying(explained, depth)).not.toBeVisible();
    expect(explanation.saying(explained, point)).toBeVisible();
  });

  test('should tell, under reveal, what content-visibility is before what allow-discrete does with it', async () => {
    render(<TestApp at={demosAt('accordions', '?style=reveal')}/>);

    const platform = await explanation.part(parts[1]);

    expect(explanation.saying(platform, /A pseudo-element is a part of an element/))
      .toHaveTextContent('Content-visibility hides the closed content, and it has no values between on and off. Allow-discrete lets a property like that switch at the end of a close and at the start of an open.');
  });
});

describe('the runs in view, with the folds shut', () => {
  test('should say what a transition is where the tab first uses it', async () => {
    render(<TestApp at={demosAt('accordions')}/>);

    const oldWay = await explanation.part(parts[0]);

    expect(explanation.saying(oldWay, /Before a known height/)).toHaveTextContent(/A transition is CSS moving a property from its old value to its new one over a set time\. It can move a height/);
  });

  test.each([['inclusive', 'checkbox'], ['exclusive', 'radio']])('should, with %s chosen, say what the platform build replaces without the %s’s words', async (type, input) => {
    render(<TestApp at={demosAt('accordions', `?type=${type}`)}/>);

    const platform = await explanation.part(parts[1]);
    const run = explanation.saying(platform, /This build uses details and summary/);

    expect(run).toBeVisible();
    expect(run).not.toHaveTextContent(/no for and no id|sibling selector/);
    expect(run).toHaveTextContent(`nothing has to tie a label to a hidden ${input}. Details remembers whether it is open, so there is no ${input} to hide and no rule that reads it.`);
  });

  test('should, with exclusive chosen, say in view what makes the build exclusive', async () => {
    render(<TestApp at={demosAt('accordions', '?type=exclusive')}/>);

    const platform = await explanation.part(parts[1]);

    expect(explanation.saying(platform, /This build uses details and summary/))
      .toHaveTextContent(/Every details here shares a name, as the first accordion’s details do above\. Pressing the open one closes it, so the list needs no Close bar\. This build replaces the three old ways/);
  });

  test('should, with inclusive chosen, say in view that each fold opens on its own, and go on to what the build replaces', async () => {
    render(<TestApp at={demosAt('accordions', '?type=inclusive')}/>);

    const platform = await explanation.part(parts[1]);

    expect(explanation.saying(platform, /This build uses details and summary/))
      .toHaveTextContent(/With nothing more, each fold opens and closes on its own, as the checkbox build’s folds do\. This build replaces the three old ways/);
  });

  test.each(['reveal', 'drawer'])('should, with %s chosen, say in view that only Chromium slides the fold, and only there', async motion => {
    render(<TestApp at={demosAt('accordions', `?style=${motion}`)}/>);

    const platform = await explanation.part(parts[1]);

    expect(explanation.saying(platform, /This build uses details and summary/)).toHaveTextContent(/and the known height\. Today only Chromium slides the fold\. Firefox and Safari open it at once, and it still works\.$/);
    expect(platform).not.toHaveTextContent(/Today only Chromium moves the size/);
  });

  test('should, with static chosen, say nothing about which browsers slide', async () => {
    render(<TestApp at={demosAt('accordions', '?style=static')}/>);

    const platform = await explanation.part(parts[1]);

    expect(platform).not.toHaveTextContent(/Today only Chromium/);
  });

  test('should say what grid and :has() are in the run on the grid row', async () => {
    render(<TestApp at={demosAt('accordions')}/>);

    const together = await explanation.part(parts[2]);

    expect(explanation.saying(together, /A grid row can slide open to its content’s height/))
      .toHaveTextContent(/^Grid is the CSS layout that sets a box out in rows and columns\. A grid row can slide open to its content’s height in every browser today\. Under the bar[^]*while the fold is closed\. :has\(\) is a piece of a CSS rule that picks an element/);
  });

  test('should say, with inclusive chosen, that the checkbox remembers as it did in the known-height build', async () => {
    render(<TestApp at={demosAt('accordions', '?type=inclusive')}/>);

    const together = await explanation.part(togetherHeading('inclusive'));

    expect(explanation.saying(together, /The inclusive build keeps the checkbox/)).toHaveTextContent(/the checkbox remembers whether the fold is open, as it did in the known-height build\./);
  });

  test.each([
    {type: 'inclusive', opening: /^The inclusive build keeps the checkbox/, sentence: 'The inclusive build keeps the checkbox from the old way, with no script, and takes its slide from the grid row. Each bar holds the fold’s name and, at its end, an Open or Close control, and the checkbox remembers whether the fold is open, as it did in the known-height build. The name is only a name: pressing it does nothing. Only the control works the fold.'},
    {type: 'exclusive', opening: /^The exclusive build keeps the radio group/, sentence: 'The exclusive build keeps the radio group from the old way and takes its slide from the grid row. Each bar holds the fold’s name and, at its end, an Open or Close control; the name is only a name, and only the control works the fold.'}
  ])('should say, with $type chosen, that only the control at the bar’s end works the fold', async ({type, opening, sentence}) => {
    render(<TestApp at={demosAt('accordions', `?type=${type}`)}/>);

    const together = await explanation.part(togetherHeading(type));

    expect(explanation.saying(together, opening)).toHaveTextContent(sentence);
  });

  test('should say, with exclusive chosen, what an event and a handler are where the press reaches the list, then what a radio’s value and the data-open attribute are, in a paragraph of their own', async () => {
    render(<TestApp at={demosAt('accordions', '?type=exclusive')}/>);

    const together = await explanation.part(togetherHeading('exclusive'));

    expect(explanation.saying(together, /^A press on a radio is an event/)).toHaveTextContent('A press on a radio is an event, the browser telling the page that something happened. The event then bubbles up through the elements around the radio, and the list runs a function for it on the way, which is called a handler.');
    expect(explanation.saying(together, /^The script keeps the open radio’s value/)).toHaveTextContent('The script keeps the open radio’s value, the string each radio carries to tell it apart, in a data-open attribute on the list element. In the script it is dataset.open: dataset is the browser’s name for an element’s data- attributes, with the prefix dropped. A press on that radio unchecks it and clears the attribute, and a press on any other writes the new one.');
  });

  test('should say, with exclusive chosen, what keydown is where the list catches the space bar', async () => {
    render(<TestApp at={demosAt('accordions', '?type=exclusive')}/>);

    const together = await explanation.part(togetherHeading('exclusive'));

    expect(explanation.runTelling(together, /^The space bar is the keyboard’s press/)).toHaveTextContent('So a handler on the list for keydown, the event a key press sends, catches the space bar too, and closes the fold when the key lands on the open radio.');
  });

  test.each([
    {type: 'inclusive', input: 'checkbox', pressed: 'checked or unchecked'},
    {type: 'exclusive', input: 'radio', pressed: 'checked'}
  ])('should say, with $type chosen, which event change is where the measured build first names it', async ({type, input, pressed}) => {
    render(<TestApp at={demosAt('accordions', `?type=${type}`)}/>);

    const oldWay = await explanation.part(parts[0]);

    expect(explanation.saying(oldWay, /^Closing runs the other way/)).toHaveTextContent(`The change event is the one the browser sends to the ${input} a press has just ${pressed}, and to no other. By the time it fires, Firefox and Safari have already applied the pressed box’s new style. So the script pins the start first, with unmoving, as the plain script does.`);
  });

  test('should open the less-motion run on what the reader gets: every fold opens with no slide', async () => {
    render(<TestApp at={demosAt('accordions')}/>);

    const motion = await explanation.part(parts[3]);

    expect(explanation.runTelling(motion, /every fold opens with no slide/)).toHaveTextContent(/^When a reader asks for less motion, every fold opens with no slide\./);
  });

  test('should say that a transition turns around when the reader presses again midway', async () => {
    render(<TestApp at={demosAt('accordions')}/>);

    const motion = await explanation.part(parts[3]);

    expect(explanation.saying(motion, /Every fold on this tab moves by transition/)).toHaveTextContent(/because a reader may press again before the fold lands\. If they do, a transition turns around from wherever it is\./);
  });
});

describe('the word attribute', () => {
  test('should be said, with inclusive chosen, and then what an id is, before the label’s for attribute', async () => {
    render(<TestApp at={demosAt('accordions', '?type=inclusive')}/>);

    const oldWay = await explanation.part(parts[0]);

    expect(explanation.saying(oldWay, /To open and close a fold/)).toHaveTextContent(/An attribute is a name, often with a value, written inside an element’s opening tag\. An id is an attribute whose value is one no other element on the page shares\. The label’s for attribute names the/);
  });

  test('should, with exclusive chosen, be said once, beside the first accordion, so the box run points back to the name above', async () => {
    render(<TestApp at={demosAt('accordions', '?type=exclusive')}/>);

    const oldWay = await explanation.part(parts[0]);
    const box = explanation.saying(oldWay, /To open and close a fold/);

    expect(box).toHaveTextContent(/An id is another attribute, like name above, and its value is one no other element on the page shares\. The label’s for attribute names the/);
    expect(box).not.toHaveTextContent('An attribute is a name');
  });
});

describe('the word display', () => {
  test.each([['inclusive', 'checkbox'], ['exclusive', 'radio']])('should be said first where display none is weighed against hiding the input off screen, with no text before it saying display, with %s chosen', async (type, input) => {
    render(<TestApp at={demosAt('accordions', `?type=${type}`)}/>);

    const oldWay = await explanation.part(parts[0]);

    const told = oldWay.textContent;

    expect(told.search(/display/i)).toBeGreaterThan(told.indexOf('far off the page'));
    expect(explanation.runTelling(oldWay, /far off the page/)).toHaveTextContent(`far off the page. Display is the property that sets how a box lays out what it holds, and display none would hide the ${input} too, but it would also take the ${input} out of the tab order, and a keyboard could no longer open the fold.`);
  });
});

describe('the platform build’s bars', () => {
  test.each([['inclusive', 'checkbox'], ['exclusive', 'radio']])('should say a flex bar loses the marker and draws the old build’s arrow in its place, in a run with no sample, with %s chosen', async (type, input) => {
    render(<TestApp at={demosAt('accordions', `?type=${type}`)}/>);

    const platform = await explanation.part(parts[1]);
    const run = explanation.runTelling(platform, /Summary also draws its own arrow/);

    expect(run).toHaveTextContent(`Summary also draws its own arrow, called a marker, where the ${input} build drew one from two borders. The browser gives a summary the display of a list item, and draws a marker only on a list item. This bar’s display is flex, a row, so the browser draws no marker. The bar draws the ${input} build’s arrow in its place, so it reads the same as the bars of the known-height and measured builds.`);
    expect(run).not.toHaveTextContent(/every build/);
    expect(explanation.everyCodeBeside(platform, /Summary also draws its own arrow/)).toEqual([]);
  });

  test('should say the browser marks an open details with the open attribute, and [open] picks it to turn the arrow, beside the rule that turns it', async () => {
    render(<TestApp at={demosAt('accordions')}/>);

    const platform = await explanation.part(parts[1]);

    expect(explanation.runTelling(platform, /The arrow points right while the fold is closed/)).toHaveTextContent('The arrow points right while the fold is closed. When the fold opens, the browser adds an open attribute to the details in the page it is showing, as if it were written in the opening tag. [open] is a piece of a CSS rule that picks an element with that attribute, and its rule turns the arrow down.');
    expect(explanation.everyCodeBeside(platform, /The arrow points right while the fold is closed/).join()).toContain('&[open] > .info-label::after {');
  });

  test.each([['inclusive', 'checkbox'], ['exclusive', 'radio']])('should keep the bar’s own run to the row, the classes it wears and its focus, with %s chosen', async (type, input) => {
    render(<TestApp at={demosAt('accordions', `?type=${type}`)}/>);

    const platform = await explanation.part(parts[1]);

    expect(explanation.runTelling(platform, /The bar is the same flex row/)).toHaveTextContent(new RegExp(`^The bar is the same flex row as the label in the ${input} build, now on summary, wearing the same classes: inverse-filled for its colors, attentive for the approach color, the ring and a glow while it is pressed, and field-outlined for the hairline that draws the line between one bar and the next\\. Summary takes focus and hover itself, where the ${input} build carried focus from the hidden ${input} to the label\\.`));
  });

  test('should show the classes the details bar wears beside its own rule', async () => {
    render(<TestApp at={demosAt('accordions')}/>);

    const platform = await explanation.part(parts[1]);

    expect(explanation.everyCodeBeside(platform, /The bar is the same flex row/).join()).toMatch(/\.info-label \{[^]*\.inverse-filled \{[^]*\.attentive[^]*\.field-outlined \{/);
  });
});

describe('the known-height build’s style sheet reading the hidden input', () => {
  const matchesOnTheInput = /Now a rule has to match on/;
  const mdnLinks = [
    [':checked', 'https://developer.mozilla.org/en-US/docs/Web/CSS/:checked'],
    ['combinator', 'https://developer.mozilla.org/en-US/docs/Web/CSS/Subsequent-sibling_combinator']
  ];

  test('should link the pseudo-class and the combinator to MDN, with inclusive chosen, in the run on a checked checkbox', async () => {
    render(<TestApp at={demosAt('accordions', '?type=inclusive')}/>);

    const oldWay = await explanation.part(parts[0]);

    expect(explanation.linksBeside(oldWay, matchesOnTheInput)).toEqual(expect.arrayContaining(mdnLinks));
    expect(explanation.runTelling(oldWay, matchesOnTheInput)).toHaveTextContent('a checked checkbox');
  });

  test('should link the pseudo-class and the combinator to MDN, with exclusive chosen, in the run on a checked radio', async () => {
    render(<TestApp at={demosAt('accordions', '?type=exclusive')}/>);

    const oldWay = await explanation.part(parts[0]);

    expect(explanation.linksBeside(oldWay, matchesOnTheInput)).toEqual(expect.arrayContaining(mdnLinks));
    expect(explanation.runTelling(oldWay, matchesOnTheInput)).toHaveTextContent('a checked radio');
  });
});

describe('the known-height build’s bars', () => {
  test.each([['inclusive', 'checkbox'], ['exclusive', 'radio']])('should say the label wears prior-approached, a shared class that reads an earlier sibling, with %s chosen', async (type, input) => {
    render(<TestApp at={demosAt('accordions', `?type=${type}`)}/>);

    const oldWay = await explanation.part(parts[0]);

    expect(explanation.runTelling(oldWay, /A keyboard user needs to see which bar they are on/)).toHaveTextContent(`so the label wears prior-approached, a shared class that reads an earlier sibling. The :focus-visible pseudo-class picks the ${input} while it has keyboard focus, and :focus-visible ~ .prior-approached gives the bar the approach color, ink for its words and a ring inside its edge. The browser treats hovering a label as hovering its ${input}, so the class’s :hover rule lights the bar too.`);
  });

  test('should show the known-height build’s own hover rule beside the run that lights its bar', async () => {
    render(<TestApp at={demosAt('accordions')}/>);

    const oldWay = await explanation.part(parts[0]);
    const beside = explanation.everyCodeBeside(oldWay, /A keyboard user needs to see which bar they are on/).join();

    expect(beside).toMatch(/@media \(hover: hover\) \{\s*:hover ~ \.prior-approached \{[^]*:focus-visible ~ \.prior-approached \{/);
    expect(beside).not.toMatch(/&:hover/);
  });

  test('should show the arrow’s one shared shape beside the run that draws it', async () => {
    render(<TestApp at={demosAt('accordions')}/>);

    const oldWay = await explanation.part(parts[0]);

    expect(explanation.everyCodeBeside(oldWay, /Each bar shows an arrow/).join()).toContain('.opening-arrow::after {');
  });

  test('should say the arrow’s borders are drawn in currentcolor, so the arrow changes color with the words', async () => {
    render(<TestApp at={demosAt('accordions')}/>);

    const oldWay = await explanation.part(parts[0]);

    expect(explanation.runTelling(oldWay, /Each bar shows an arrow/)).toHaveTextContent('The borders are drawn in currentcolor, the element’s own text color, so the arrow changes color with the words.');
  });

  const sharedClass = /The bar’s colors are the page’s the other way round/;
  const ruleThenSharedClass = /^&:not\(\.close\) \.info-label \{[^]*\.inverse-filled \{/;

  test('should show, with inclusive chosen, the shared class beside the run on the bar’s colors, before any class is named', async () => {
    render(<TestApp at={demosAt('accordions', '?type=inclusive')}/>);

    const oldWay = await explanation.part(parts[0]);
    const run = explanation.runTelling(oldWay, sharedClass);

    expect(explanation.everyCodeBeside(oldWay, sharedClass).join()).toMatch(ruleThenSharedClass);
    expect(outOfReadingOrder([
      run,
      explanation.runTelling(oldWay, /Each bar shows an arrow/),
      explanation.runTelling(oldWay, /A keyboard user needs to see which bar they are on/),
      explanation.runTelling(oldWay, /Whether a tall fold’s last line is cut off/)
    ])).toEqual([]);
  });

  test('should show, with exclusive chosen, the shared class beside the run on the bar’s colors, the Close bar’s among them, before any class is named', async () => {
    render(<TestApp at={demosAt('accordions', '?type=exclusive')}/>);

    const oldWay = await explanation.part(parts[0]);
    const run = explanation.runTelling(oldWay, sharedClass);

    expect(explanation.everyCodeBeside(oldWay, sharedClass).join()).toMatch(ruleThenSharedClass);
    expect(outOfReadingOrder([
      run,
      explanation.runTelling(oldWay, /Each bar shows an arrow/),
      explanation.runTelling(oldWay, /A keyboard user needs to see which bar they are on/),
      explanation.runTelling(oldWay, /Whether a tall fold’s last line is cut off/),
      explanation.runTelling(oldWay, /The Close bar is shorter than the others/)
    ])).toEqual([]);
  });

  test('should show the arrow’s classes in the order its run names them: the style sheet’s rules, the corner, then the turns', async () => {
    render(<TestApp at={demosAt('accordions')}/>);

    const oldWay = await explanation.part(parts[0]);

    expect(explanation.everyCodeBeside(oldWay, /Each bar shows an arrow/).join()).toMatch(/\.opening-arrow::after \{[^]*\.corner-after::after \{[^]*\.info-toggle:checked ~ \.info-label::after/);
    expect(explanation.everyCodeBeside(oldWay, /Each bar shows an arrow/).join()).not.toContain('.inverse-filled');
  });
});

describe('the classes the bars wear', () => {
  test('should say the Close bar’s ground and text are two plain color classes, and show them beside its rule', async () => {
    render(<TestApp at={demosAt('accordions', '?type=exclusive')}/>);

    const oldWay = await explanation.part(parts[0]);

    expect(explanation.runTelling(oldWay, /The Close bar is shorter than the others/)).toHaveTextContent('so a press anywhere on the bar counts. Its ground is field-inverse and its text field-ink, two plain color classes with no hover or focus of their own.');
    expect(explanation.everyCodeBeside(oldWay, /The Close bar is shorter than the others/).join()).toMatch(/&\.close \{[^]*\.field-inverse \{[^]*\.field-ink \{/);
  });

  test.each([
    {type: 'inclusive', input: 'checkbox'},
    {type: 'exclusive', input: 'radio'}
  ])('should say, with $type chosen, what the eye and the ear meet on the control, beside the rules that show its word', async ({type, input}) => {
    render(<TestApp at={demosAt('accordions', `?type=${type}`)}/>);

    const together = await explanation.part(togetherHeading(type));

    expect(explanation.runTelling(together, /^The bar carries the fold’s name/)).toHaveTextContent(`The bar carries the fold’s name. The control is a ${input} under a label. The label holds the Open or Close the eye sees and, off screen, the fold’s name, so a listener hears the word, the fold and the state: “Open”, then the fold’s name, then “${input}, not checked”. Someone using voice control says what they see. Its checked state is the fold’s state. The word that does not apply has display: none, which takes it out of the page and out of the name the listener hears, so the control is always called by the one word it shows. The control is a box drawn by hairline-outline, a hairline in the text’s own color, and field-pressed, which gives it the page’s own ground and ink while it is pressed.`);
    expect(explanation.everyCodeBeside(together, /^The bar carries the fold’s name/).join()).toMatch(/\.when-closed \{[^]*\.when-open \{[^]*\.hairline-outline \{[^]*\.field-pressed:active \{/);
  });
});

describe('the known-height build’s scroll sign', () => {
  test('should say a keyboard reaches and scrolls the section, sees its ring and hears it named by its bar, beside the ring', async () => {
    render(<TestApp at={demosAt('accordions')}/>);

    const oldWay = await explanation.part(parts[0]);

    expect(explanation.runTelling(oldWay, /The section has a tabindex of 0/)).toHaveTextContent('The section has a tabindex of 0, so a keyboard can reach it and scroll it, and wears focus-ringed, so a keyboard user sees when they have reached it. Its bar names it through aria-labelledby, so a screen reader says which fold it is reading.');
    expect(explanation.everyCodeBeside(oldWay, /The section has a tabindex of 0/).join()).toMatch(/\.focus-ringed \{/);
  });

  test('should say the sign is a shadow at the panel’s foot, under a cover that scrolls with the text', async () => {
    render(<TestApp at={demosAt('accordions')}/>);

    const oldWay = await explanation.part(parts[0]);

    expect(explanation.runTelling(oldWay, /Whether a tall fold’s last line is cut off/)).toHaveTextContent('so the section wears foot-shadowed. That class paints a shadow at the section’s foot, and over it a cover in the panel’s color that scrolls with the text. The cover hides the shadow when the text is at its end, or when the text fits.');
    expect(explanation.everyCodeBeside(oldWay, /Whether a tall fold’s last line is cut off/).join()).toMatch(/\.info-text \{[^]*\.info-paragraph \{[^]*\.foot-shadowed \{/);
  });
});

describe('what a fold remembers, before the first build that leans on it', () => {
  const remembers = 'A box remembers the fold, and a rule reads it';

  test.each([['inclusive', 'checkbox'], ['exclusive', 'radio']])('should, with %s chosen, explain the %s, its label and the rule that reads it in plain view, before the max-height guess', async (type, input) => {
    render(<TestApp at={demosAt('accordions', `?type=${type}`)}/>);

    const oldWay = await explanation.part(parts[0]);
    const told = explanation.partIn(oldWay, remembers);
    const box = explanation.saying(told, /^To open and close a fold, something has to remember which way it is\./);
    const rule = explanation.saying(told, /^Now a rule has to match on whether the/);

    expect(box).toBeVisible();
    expect(box).toHaveTextContent(`The label’s for attribute names the ${input}’s id.`);
    expect(rule).toBeVisible();
    expect(rule).toHaveTextContent('The ~ is a combinator');
    expect(explanation.everyCodeBeside(oldWay, /^Now a rule has to match on whether the/).join()).toMatch(/\.info-toggle:not\(:checked\) ~ \.info \{/);
    expect(outOfReadingOrder([
      explanation.sectionTitle(oldWay, remembers),
      box,
      rule,
      explanation.sectionTitle(oldWay, 'The max-height guess')
    ])).toEqual([]);
  });

  const knownHeightWorks = 'How the known height works';
  const threeParts = /^The fold is the three parts from/;

  test('should open "How the known height works", with inclusive chosen, on the checkbox fold, beside the same fold in React', async () => {
    render(<TestApp at={demosAt('accordions', '?type=inclusive')}/>);

    const folded = recipeFolds.story(await explanation.part(parts[0]), knownHeightWorks);

    expect(explanation.runTelling(folded, threeParts)).toHaveTextContent('The fold is the three parts from “A box remembers the fold, and a rule reads it”: the checkbox, its label and the text. The sample beside this run is the same fold in React, the library this site’s script is written in, which writes class as className and for as htmlFor.');
    expect(explanation.sourcesBeside(folded, threeParts)).toEqual(['Accordions/Accordions.tsx on GitHub']);
    expect(explanation.codeBeside(folded, threeParts)).toHaveTextContent('type="checkbox"');
    expect(outOfReadingOrder([explanation.runTelling(folded, threeParts), explanation.runTelling(folded, /^You want the reader to see a bar/)])).toEqual([]);
  });

  test('should open "How the known height works", with exclusive chosen, on the radio fold, beside the same fold in React, a radio in a named group', async () => {
    render(<TestApp at={demosAt('accordions', '?type=exclusive')}/>);

    const folded = recipeFolds.story(await explanation.part(parts[0]), knownHeightWorks);

    expect(explanation.runTelling(folded, threeParts)).toHaveTextContent('The fold is the three parts from “A box remembers the fold, and a rule reads it”: the radio, its label and the text. The sample beside this run is the same fold in React, the library this site’s script is written in, which writes class as className and for as htmlFor.');
    expect(explanation.sourcesBeside(folded, threeParts)).toEqual(['Accordions/Accordions.tsx on GitHub']);
    expect(explanation.codeBeside(folded, threeParts)).toHaveTextContent(/type="radio" name="/);
    expect(outOfReadingOrder([explanation.runTelling(folded, threeParts), explanation.runTelling(folded, /^You want the reader to see a bar/)])).toEqual([]);
  });

  test('should explain nothing in "How the known height works" that the top of the section already told', async () => {
    render(<TestApp at={demosAt('accordions')}/>);

    const folded = recipeFolds.story(await explanation.part(parts[0]), knownHeightWorks);

    expect(explanation.saidIn(folded, /^To open and close a fold/)).not.toBeInTheDocument();
    expect(explanation.saidIn(folded, /^Now a rule has to match on whether the/)).not.toBeInTheDocument();
  });
});

describe('the links to other tabs', () => {
  test('should link each term it glosses, and each tab it names, to that tab', async () => {
    render(<TestApp at={demosAt('accordions')}/>);

    const tab = await demoTabs.arrivedOn('Accordions');

    expect(demoPage.linksToTabsIn(tab)).toEqual([
      ['z-index tab', `${Paths.demos}z-index/`],
      ['React', `${Paths.demos}z-index/`]
    ]);
  });
});
