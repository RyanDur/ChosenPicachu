import {render, screen, within} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {TestApp} from '@__test_support/TestApp';
import {demosAt, outOfReadingOrder} from '@pages/Demos/__test_support';
import {explanation} from '@pages/Demos/Recipe/__test_support';

const htmlAlone = 'An accordion in HTML alone';

const parts = ['How we used to build a fold', 'What the platform gives now', 'The two together', 'How every fold moves'];

const exclusiveOnly = [/Close radio/, /share a name|same name|shared name/, /one part open|one open at a time/, /A radio that loses its check/, /export const foldMeasured/];

describe('the accordions tab', () => {
  test('should open on the three languages and the choice between them, and bring the accordion in as the example, before the first accordion', async () => {
    render(<TestApp at={demosAt('?tab=accordions')}/>);

    const tab = await screen.findByRole('region', {name: 'Accordions'});
    const openings = [
      /^A web page is written in three languages\./,
      /^You don’t always need all three\./,
      /^The thing is an accordion:/,
      /^Sliding it open is the hard part\./,
      /^By the end you can build an accordion.* say which language each job needed and why\./
    ];

    expect(outOfReadingOrder([...openings.map(opening => within(tab).getByText(opening)), within(tab).getAllByRole('group')[0]])).toEqual([]);
  });

  test('should start with HTML alone, then the fold choices, then tell the old way, the platform, the two together, and how every fold moves', async () => {
    render(<TestApp at={demosAt('?tab=accordions')}/>);

    const tab = await screen.findByRole('region', {name: 'Accordions'});

    expect(within(tab).getAllByRole('heading', {level: 3}).map(part => part.textContent)).toEqual([htmlAlone, 'fold choices', ...parts]);
  });

  test('should name the fold choices’ section by its heading, with the line and both rows inside it', async () => {
    render(<TestApp at={demosAt('?tab=accordions')}/>);

    const choices = await screen.findByRole('region', {name: 'fold choices'});

    expect(within(choices).getByText(/^Two choices set the accordions/)).toBeVisible();
    expect(within(choices).getByRole('group', {name: 'fold type'})).toBeVisible();
    expect(within(choices).getByRole('group', {name: 'fold motion'})).toBeVisible();
  });

  test('should open on the inclusive type, and write the type chosen into the address', async () => {
    render(<TestApp at={demosAt('?tab=accordions')}/>);
    const types = await screen.findByRole('group', {name: 'fold type'});
    expect(within(types).getByRole('radio', {name: 'Inclusive'})).toBeChecked();

    await userEvent.click(within(types).getByRole('radio', {name: 'Exclusive'}));

    expect(screen.getByRole('status', {name: 'url search'})).toHaveTextContent('type=exclusive');
    expect(within(types).getByRole('radio', {name: 'Exclusive'})).toBeChecked();
  });

  test.each([
    ['inclusive', parts[0], ['Accordion using checkboxes and a measured height', 'Accordion using checkboxes and a known height']],
    ['inclusive', parts[1], ['Inclusive accordion using details elements']],
    ['inclusive', parts[2], ['Inclusive accordion using checkboxes']],
    ['exclusive', parts[0], ['Accordion using a radio group and a measured height', 'Accordion using a radio group and a known height']],
    ['exclusive', parts[1], ['Exclusive accordion using details elements']],
    ['exclusive', parts[2], ['Exclusive accordion using radio group']]
  ])('should show, with %s chosen, under "%s" the build of that type', async (type, part, builds) => {
    render(<TestApp at={demosAt(`?tab=accordions&type=${type}`)}/>);

    const explained = await screen.findByRole('region', {name: part});

    expect(within(explained).getAllByRole('article').map(build => within(build).getByRole('heading', {level: 4}).textContent)).toEqual(builds);
  });
});

describe('the accordions explanation', () => {
  test.each(parts.slice(0, 3))('should show, with inclusive chosen, none of the radio builds’ words or code under "%s"', async part => {
    render(<TestApp at={demosAt('?tab=accordions&type=inclusive')}/>);

    const explained = await screen.findByRole('region', {name: part});

    for (const words of exclusiveOnly) {
      expect(explained).not.toHaveTextContent(words);
    }
  });

  test('should show, with exclusive chosen, the radio builds’ words and code', async () => {
    render(<TestApp at={demosAt('?tab=accordions&type=exclusive')}/>);

    const tab = await screen.findByRole('region', {name: 'Accordions'});

    for (const words of exclusiveOnly) {
      expect(tab).toHaveTextContent(words);
    }
  });

  test.each(['inclusive', 'exclusive'])('should say, with %s chosen, that the old build and the platform build have no script', async type => {
    render(<TestApp at={demosAt(`?tab=accordions&type=${type}`)}/>);

    expect(within(await screen.findByRole('region', {name: parts[0]})).getByText(/It has\s+no script/)).toBeInTheDocument();
    expect(within(screen.getByRole('region', {name: parts[1]})).getByText(/There is no script here either/)).toBeInTheDocument();
  });
});

describe('the words and the code chosen by type', () => {

  test.each([
    {type: 'inclusive', input: 'checkbox', announced: /a checkbox, checked or not checked\./, carvedInput: 'type="checkbox"'},
    {type: 'exclusive', input: 'radio', announced: /a radio, one of six\./, carvedInput: 'type="radio" name="group"'}
  ])('should, with $type chosen, name the $input in the runs and show its build\'s list item', async ({type, input, announced, carvedInput}) => {
    render(<TestApp at={demosAt(`?tab=accordions&type=${type}`)}/>);

    const oldWay = await screen.findByRole('region', {name: parts[0]});
    const platform = screen.getByRole('region', {name: parts[1]});

    expect(within(oldWay).getByText(new RegExp(`so you hide the ${input}\\.`))).toBeInTheDocument();
    expect(oldWay).toHaveTextContent(announced);
    expect(explanation.codeBeside(oldWay, /To open and close a part/)).toHaveTextContent(carvedInput);
    expect(within(platform).getByRole('figure', {name: new RegExp(`needs a ${input},`)})).toBeInTheDocument();
  });
});

describe('what the platform gives now', () => {
  test.each([
    ['inclusive', '<details className="fold">'],
    ['exclusive', '<details className="fold" name="exclusive-toggle-accordion">']
  ])('should show, with %s chosen, the details of that build beside the run that introduces details', async (type, carved) => {
    render(<TestApp at={demosAt(`?tab=accordions&type=${type}`)}/>);

    const explained = await screen.findByRole('region', {name: parts[1]});

    expect(explanation.codeBeside(explained, /This build uses details and summary/)).toHaveTextContent(carved);
  });
});

describe('the two together', () => {
  test('should show, with inclusive chosen, the checkbox build\'s label beside its run', async () => {
    render(<TestApp at={demosAt('?tab=accordions&type=inclusive')}/>);

    const explained = await screen.findByRole('region', {name: parts[2]});

    expect(explanation.codeBeside(explained, /The inclusive build is a checkbox build again/)).toHaveTextContent('type="checkbox"');
  });

  test('should show, with exclusive chosen, the script that lets a radio close beside its run', async () => {
    render(<TestApp at={demosAt('?tab=accordions&type=exclusive')}/>);

    const explained = await screen.findByRole('region', {name: parts[2]});

    expect(explanation.codeBeside(explained, /The exclusive build is a radio group/)).toHaveTextContent('const openAfter');
  });
});

describe('the measured build', () => {
  test('should show the script that measures, then lets go, beside the run that opens a part', async () => {
    render(<TestApp at={demosAt('?tab=accordions')}/>);

    const explained = await screen.findByRole('region', {name: parts[0]});

    expect(explanation.codeBeside(explained, /When the motion ends, the script takes the number away/)).toHaveTextContent(/const opened[^]*const settled[^]*const letsGo/);
  });

  test('should show @property beside the run that declares it, .sized beside the run that names the class, and .unmoving beside the run that closes', async () => {
    render(<TestApp at={demosAt('?tab=accordions')}/>);

    const explained = await screen.findByRole('region', {name: parts[0]});

    expect(explanation.everyCodeBeside(explained, /^The script hands each height to the stylesheet/).join()).toMatch(/@property --measured-height \{[^]*initial-value: auto;/);
    expect(explanation.everyCodeBeside(explained, /^The script marks the panel with a class/).join()).toMatch(/\.info-measured\.sized \{/);
    expect(explanation.everyCodeBeside(explained, /^Closing runs the other way\./).join()).toMatch(/\.info-measured\.unmoving \{/);
  });

  test('should tell the property, then the class, then closing, each in a run of its own', async () => {
    render(<TestApp at={demosAt('?tab=accordions')}/>);

    const explained = await screen.findByRole('region', {name: parts[0]});

    expect(outOfReadingOrder([
      explanation.runTelling(explained, /^The script hands each height to the stylesheet/),
      explanation.runTelling(explained, /^The script marks the panel with a class/),
      explanation.runTelling(explained, /^Closing runs the other way\./)
    ])).toEqual([]);
  });

  test('should say what @property is in the property’s run, and leave the class to the next', async () => {
    render(<TestApp at={demosAt('?tab=accordions')}/>);

    const declared = explanation.runTelling(await screen.findByRole('region', {name: parts[0]}), /^The script hands each height to the stylesheet/);

    expect(declared).toHaveTextContent('The stylesheet declares that property with @property, a rule that tells the browser what kind of value a custom property holds and what it is until something sets it: here a length or auto, starting as auto.');
    expect(declared).not.toHaveTextContent(/a name an element wears/);
  });

  test('should say what a class is, and that the panel’s height reads --measured-height while sized is on, in the class’s run', async () => {
    render(<TestApp at={demosAt('?tab=accordions')}/>);

    const named = explanation.runTelling(await screen.findByRole('region', {name: parts[0]}), /^The script marks the panel with a class/);

    expect(named).toHaveTextContent('The script marks the panel with a class, a name an element wears so a rule can pick it out: sized. While sized is on, the panel’s height reads --measured-height.');
  });

  test('should not say the sized panel takes its own height, a moment the script never reaches', async () => {
    render(<TestApp at={demosAt('?tab=accordions')}/>);

    const named = explanation.runTelling(await screen.findByRole('region', {name: parts[0]}), /^The script marks the panel with a class/);

    expect(named).not.toHaveTextContent(/takes its own height/);
  });

  test('should open the closing run with what closing does', async () => {
    render(<TestApp at={demosAt('?tab=accordions')}/>);

    const closing = explanation.runTelling(await screen.findByRole('region', {name: parts[0]}), /^Closing runs the other way\./);

    expect(closing).toHaveTextContent('Closing runs the other way. To close, the script sets the open height, then 0, and the transition moves between them.');
  });

  test('should show the script that turns a part around beside the run that tells it', async () => {
    render(<TestApp at={demosAt('?tab=accordions')}/>);

    const explained = await screen.findByRole('region', {name: parts[0]});

    expect(explanation.everyCodeBeside(explained, /turns around from where it is/).join()).toMatch(/const movesTo[^]*const stillMoving/);
  });
});

describe('the fold choices', () => {
  const rowOf = async (name: string): Promise<HTMLElement> => {
    await screen.findByRole('group', {name});
    const rows = screen.getAllByRole('listitem').filter(item => within(item).queryByRole('group', {name}) !== null);
    return rows[rows.length - 1];
  };

  test('should read the chosen motion and the less-motion sentence as two sentences with the styles off', async () => {
    render(<TestApp at={demosAt('?tab=accordions&style=drawer')}/>);

    const row = await rowOf('fold motion');

    expect(within(row).getByRole('status').textContent).toBe('The text slides down from under its bar. If your system asks for less motion, every fold here opens at once, whichever you choose.');
  });

  test('should say, just before the rows, which accordions they set', async () => {
    render(<TestApp at={demosAt('?tab=accordions')}/>);

    const types = await screen.findByRole('group', {name: 'fold type'});
    const line = screen.getByText('Two choices set the accordions in the three parts below. The one above is HTML alone, so they don’t change it.');

    expect(line.compareDocumentPosition(types) & Node.DOCUMENT_POSITION_FOLLOWING).toBe(Node.DOCUMENT_POSITION_FOLLOWING);
    expect(line.compareDocumentPosition(screen.getByRole('region', {name: 'An accordion in HTML alone'})) & Node.DOCUMENT_POSITION_PRECEDING).toBe(Node.DOCUMENT_POSITION_PRECEDING);
  });

  test('should read the chosen fold type, and read the other once it is chosen', async () => {
    render(<TestApp at={demosAt('?tab=accordions')}/>);

    const row = await rowOf('fold type');

    expect(within(row).getByRole('status')).toHaveTextContent('Any number of folds can be open at once.');

    await userEvent.click(within(row).getByRole('radio', {name: 'Exclusive'}));

    expect(within(row).getByRole('status')).toHaveTextContent('Opening one fold closes the others.');
  });

  test.each([
    ['Reveal', 'static', 'The text is uncovered from its first line down.'],
    ['Drawer', 'static', 'The text slides down from under its bar.'],
    ['Static', 'reveal', 'The fold opens at once, with nothing moving.']
  ])('should read %s as the fold motion once it is chosen over %s', async (motion, from, reading) => {
    render(<TestApp at={demosAt(`?tab=accordions&style=${from}`)}/>);

    const row = await rowOf('fold motion');
    await userEvent.click(within(row).getByRole('radio', {name: motion}));

    expect(within(row).getByRole('status')).toHaveTextContent(reading);
  });
});

describe('the fold motion', () => {
  test('should sit after the accordion in HTML alone, right after the fold type, before the old way, and in no part', async () => {
    render(<TestApp at={demosAt('?tab=accordions')}/>);

    const tab = await screen.findByRole('region', {name: 'Accordions'});
    const [start, oldWay] = [within(tab).getByRole('region', {name: htmlAlone}), within(tab).getByRole('region', {name: parts[0]})];
    const [foldType, foldMotion] = [within(tab).getByRole('group', {name: 'fold type'}), within(tab).getByRole('group', {name: 'fold motion'})];

    expect(start.compareDocumentPosition(foldType)).toBe(Node.DOCUMENT_POSITION_FOLLOWING);
    expect(foldType.compareDocumentPosition(foldMotion)).toBe(Node.DOCUMENT_POSITION_FOLLOWING);
    expect(foldMotion.compareDocumentPosition(oldWay)).toBe(Node.DOCUMENT_POSITION_FOLLOWING);
    for (const part of parts) {
      expect(within(screen.getByRole('region', {name: part})).queryByRole('group', {name: 'fold motion'})).not.toBeInTheDocument();
    }
  });

  test('should open on the reveal', async () => {
    render(<TestApp at={demosAt('?tab=accordions')}/>);

    const motions = await screen.findByRole('group', {name: 'fold motion'});

    expect(within(motions).getByRole('radio', {name: 'Reveal'})).toBeChecked();
  });

  test('should write the motion chosen into the address', async () => {
    render(<TestApp at={demosAt('?tab=accordions')}/>);
    const motions = await screen.findByRole('group', {name: 'fold motion'});

    await userEvent.click(within(motions).getByRole('radio', {name: 'Drawer'}));

    expect(screen.getByRole('status', {name: 'url search'})).toHaveTextContent('style=drawer');
    expect(within(motions).getByRole('radio', {name: 'Drawer'})).toBeChecked();
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
    render(<TestApp at={demosAt(`?tab=accordions&style=${style}`)}/>);

    const platform = await screen.findByRole('region', {name: parts[1]});

    expect(within(platform).getByText(partTwoSays[style])).toBeInTheDocument();
    for (const other of others) {
      expect(within(platform).queryByText(partTwoSays[other])).not.toBeInTheDocument();
    }
  });

  test('should carve the details drawer rule beside the details run under the drawer', async () => {
    render(<TestApp at={demosAt('?tab=accordions&style=drawer')}/>);

    const platform = await screen.findByRole('region', {name: parts[1]});

    expect(explanation.everyCodeBeside(platform, /A pseudo-element is a part of an element/).join()).toContain('.drawer &::details-content');
  });

  test.each(['reveal', 'static'])('should carve no details drawer rule under %s', async style => {
    render(<TestApp at={demosAt(`?tab=accordions&style=${style}`)}/>);

    const platform = await screen.findByRole('region', {name: parts[1]});

    expect(explanation.everyCodeBeside(platform, /A pseudo-element is a part of an element/).join()).not.toContain('.drawer &::details-content');
  });

  const knownHeight = ['.info, .info-text { height: 10lh;', '.info { overflow: hidden;', '.info-text { overflow-y: auto;', '.info-paragraph { box-sizing', '.info-toggle:not(:checked) ~ .info { height: 0;'];

  const partOneSays = {
    reveal: /With reveal, the panel’s height moves over 300 milliseconds/,
    drawer: /With the drawer, the height and visibility move on the same 300 milliseconds/,
    static: /With static, nothing moves/
  };

  test.each([
    {style: 'reveal', others: ['drawer', 'static'], carves: [...knownHeight, ':is(.reveal, .drawer) & .info { transition: height'], omits: ['.drawer & .info']},
    {style: 'drawer', others: ['reveal', 'static'], carves: [...knownHeight, ':is(.reveal, .drawer) & .info { transition: height', '.drawer & .info { display: flex;', '.drawer & .info-text { flex-shrink: 0;'], omits: []},
    {style: 'static', others: ['reveal', 'drawer'], carves: knownHeight, omits: [':is(.reveal, .drawer) & .info', '.drawer & .info']}
  ] as const)('should tell, with $style chosen, only what that motion does under part one', async ({style, others, carves, omits}) => {
    render(<TestApp at={demosAt(`?tab=accordions&style=${style}`)}/>);

    const oldWay = await screen.findByRole('region', {name: parts[0]});

    expect(within(oldWay).getByText(partOneSays[style])).toBeInTheDocument();
    for (const other of others) {
      expect(within(oldWay).queryByText(partOneSays[other])).not.toBeInTheDocument();
    }
    for (const rule of carves) {
      expect(explanation.codeBeside(oldWay, partOneSays[style])).toHaveTextContent(rule);
    }
    for (const rule of omits) {
      expect(explanation.codeBeside(oldWay, partOneSays[style])).not.toHaveTextContent(rule);
    }
  });

  test.each([
    {style: 'reveal', says: /With reveal and the drawer, one sits on every bar/, not: /With static there is none/},
    {style: 'drawer', says: /With reveal and the drawer, one sits on every bar/, not: /With static there is none/},
    {style: 'static', says: /With static there is none, so the corner turns at once/, not: /With reveal and the drawer, one sits on every bar/}
  ])('should tell, with $style chosen, how the arrow turns', async ({style, says, not}) => {
    render(<TestApp at={demosAt(`?tab=accordions&style=${style}`)}/>);

    const oldWay = await screen.findByRole('region', {name: parts[0]});

    expect(within(oldWay).getByText(says)).toBeInTheDocument();
    expect(within(oldWay).queryByText(not)).not.toBeInTheDocument();
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
    render(<TestApp at={demosAt(`?tab=accordions&style=${style}`)}/>);

    const together = await screen.findByRole('region', {name: parts[2]});

    expect(within(together).getByText(partThreeSays[style])).toBeInTheDocument();
    for (const other of others) {
      expect(within(together).queryByText(partThreeSays[other])).not.toBeInTheDocument();
    }
    expect(drawn.map(title => within(together).getByRole('figure', {name: new RegExp(`^${title}\\.`)})))
      .toEqual(explanation.drawingsIn(together));
  });

  test('should tell the drawer run under the drawer', async () => {
    render(<TestApp at={demosAt('?tab=accordions&style=drawer')}/>);

    const together = await screen.findByRole('region', {name: parts[2]});

    expect(within(together).getByText(/With the drawer, the text slides down/)).toBeInTheDocument();
  });

  test('should keep the words around the drawer run’s quoted CSS apart', async () => {
    render(<TestApp at={demosAt('?tab=accordions&style=drawer')}/>);

    const together = await screen.findByRole('region', {name: parts[2]});

    const run = within(together).getByText(/With the drawer, the text slides down/);

    expect(run).toHaveTextContent(/so align-content: end sets/);
    expect(run).toHaveTextContent(/Then align-self: end sets/);
  });

  test.each(['reveal', 'static'])('should tell no drawer run under %s', async style => {
    render(<TestApp at={demosAt(`?tab=accordions&style=${style}`)}/>);

    const together = await screen.findByRole('region', {name: parts[2]});

    expect(within(together).queryByText(/With the drawer, the text slides down/)).not.toBeInTheDocument();
  });

  test('should keep an open fold open when the reader chooses another motion', async () => {
    render(<TestApp at={demosAt('?tab=accordions')}/>);
    const together = await screen.findByRole('region', {name: parts[2]});
    const first = within(together).getAllByRole('checkbox')[0];
    await userEvent.click(first);

    await userEvent.click(within(screen.getByRole('group', {name: 'fold motion'})).getByRole('radio', {name: 'Drawer'}));

    expect(first).toBeChecked();
  });
});

describe('how every fold moves', () => {
  test('should show the one block that opens every fold at once for a reader who asks for less motion', async () => {
    render(<TestApp at={demosAt('?tab=accordions')}/>);

    const explained = await screen.findByRole('region', {name: parts[3]});
    const shown = within(explained).getAllByRole('code').map(code => code.textContent ?? '').join('\n');

    expect(shown).toContain('@media (prefers-reduced-motion: reduce)');
    expect(shown).toContain('::details-content');
    expect(shown).toContain('::view-transition-group(*)');
  });
});

describe('the accordions diagrams', () => {
  test.each([
    ['inclusive', parts[0], ['One guess, two parts', 'The known height', 'Off screen, not gone', 'The sheet reads the box', 'Two borders, turned', 'Focus on the box, drawn on the bar']],
    ['exclusive', parts[0], ['One guess, two parts', 'The known height', 'Off screen, not gone', 'The sheet reads the box', 'Two borders, turned', 'Focus on the box, drawn on the bar', 'One name, one choice']],
    ['inclusive', parts[1], ['One job, two ways', 'Three pieces become two', 'Sized to the text']],
    ['exclusive', parts[1], ['One job, two ways', 'Three pieces become two', 'Sized to the text']]
  ])('should draw, with %s chosen, under "%s" each mechanism in order, named by its title and one sentence', async (type, part, titles) => {
    render(<TestApp at={demosAt(`?tab=accordions&type=${type}`)}/>);

    const explained = await screen.findByRole('region', {name: part});

    expect(titles.map(title => within(explained).getByRole('figure', {name: new RegExp(`^${title}\\. \\S.*\\.$`)})))
      .toEqual(explanation.drawingsIn(explained));
  });

  test('should set out, with exclusive chosen, what each element promises, row by row, as a table', async () => {
    render(<TestApp at={demosAt('?tab=accordions&type=exclusive')}/>);

    const explained = await screen.findByRole('region', {name: parts[2]});
    const promises = within(explained).getByRole('table', {name: 'What each element promises'});

    expect(within(promises).getByRole('row', {name: 'checkbox yes no'})).toBeInTheDocument();
    expect(within(promises).getByRole('row', {name: 'radio no yes'})).toBeInTheDocument();
    expect(within(promises).getByRole('row', {name: 'details with a name yes yes'})).toBeInTheDocument();
  });
});

describe('the max-height guess', () => {
  test('should open part one on the code of the guess, beside its heading', async () => {
    render(<TestApp at={demosAt('?tab=accordions')}/>);

    const oldWay = await screen.findByRole('region', {name: parts[0]});

    expect(within(within(oldWay).getByRole('region', {name: 'The max-height guess'})).getByRole('code'))
      .toHaveTextContent(/max-height: 0;.*transition: max-height .3s ease-in-out;.*max-height: 1000px;/);
  });

  test.each([
    ['inclusive', 'Accordion using checkboxes and a measured height', 'Accordion using checkboxes and a known height'],
    ['exclusive', 'Accordion using a radio group and a measured height', 'Accordion using a radio group and a known height']
  ])('should outline part one, with %s chosen, as the guess, the measured height, then the known height', async (type, measured, known) => {
    render(<TestApp at={demosAt(`?tab=accordions&type=${type}`)}/>);

    const oldWay = await screen.findByRole('region', {name: parts[0]});

    expect(within(oldWay).getAllByRole('heading', {level: 4}).map(heading => heading.textContent)).toEqual(['The max-height guess', measured, known]);
  });
});

const everyTypeAndMotion = ['inclusive', 'exclusive'].flatMap(type => ['reveal', 'drawer', 'static'].map(style => ({type, style})));

describe('what the newer builds end', () => {
  test.each(everyTypeAndMotion)('should name, with $type and $style chosen, the three old ways the details builds replace', async ({type, style}) => {
    render(<TestApp at={demosAt(`?tab=accordions&type=${type}&style=${style}`)}/>);

    const platform = await screen.findByRole('region', {name: parts[1]});

    expect(explanation.runTelling(platform, /This replaces the three old ways/)).toHaveTextContent(/the max-height guess, the height measured by script, and the known height/);
  });

  test('should say the grid row guesses, measures and fixes nothing, and scrolls no text', async () => {
    render(<TestApp at={demosAt('?tab=accordions')}/>);

    const together = await screen.findByRole('region', {name: parts[2]});

    expect(explanation.runTelling(together, /The row always ends at the content’s own height/))
      .toHaveTextContent(/nothing is guessed, nothing is measured by script, nothing is fixed, and no text has to scroll/);
  });

  test.each(everyTypeAndMotion)('should say no sentence twice in the runs’ paragraphs or the figures’ captions, with $type and $style chosen', async ({type, style}) => {
    render(<TestApp at={demosAt(`?tab=accordions&type=${type}&style=${style}`)}/>);

    const tab = await screen.findByRole('region', {name: 'Accordions'});
    const sentences = [...within(tab).getAllByRole('paragraph').map(paragraph => paragraph.textContent ?? ''), ...explanation.captionsIn(tab)]
      .flatMap(text => text.split(/(?<=[.!?])\s+/))
      .map(sentence => sentence.trim())
      .filter(sentence => sentence.length > 0);

    expect(sentences.filter((sentence, at) => sentences.indexOf(sentence) !== at)).toEqual([]);
  });
});

describe('the accordion in HTML alone', () => {
  test('should hold three folds, basalt, cinder and meadow, in that order', async () => {
    render(<TestApp at={demosAt('?tab=accordions')}/>);

    const folds = within(await screen.findByRole('region', {name: htmlAlone})).getAllByRole('group');

    expect(folds).toHaveLength(3);
    ['basalt', 'cinder', 'meadow'].forEach((name, at) => expect(within(folds[at]).getByText(name)).toBeInTheDocument());
  });

  test('should open its part on the three folds, in the same run as their markup', async () => {
    render(<TestApp at={demosAt('?tab=accordions')}/>);

    const firstRun = within(await screen.findByRole('region', {name: htmlAlone})).getAllByRole('listitem')[0];

    expect(within(firstRun).getAllByRole('group')).toHaveLength(3);
  });

  test('should show the folds’ whole markup in the part’s first run, with no class and no script', async () => {
    render(<TestApp at={demosAt('?tab=accordions')}/>);

    const firstRun = within(await screen.findByRole('region', {name: htmlAlone})).getAllByRole('listitem')[0];
    const code = within(firstRun).getAllByRole('code').map(sample => sample.textContent).join();

    expect(code).toMatch(/<ul>[^]*<details>[^]*<summary>basalt<\/summary>[^]*<summary>meadow<\/summary>[^]*<\/ul>/);
    expect(code).not.toMatch(/className|on[A-Z]\w*=/);
  });
});

describe('the depth of each part', () => {
  test.each([
    [parts[0], 'How the measured height works', /Most of us reached next for script/, /Closing runs the other way/],
    [parts[0], 'How the known height works', /Here every panel is the same height/, /You want the reader to see a bar/],
    [parts[1], 'How details works', /This replaces the three old ways/, /A pseudo-element is a part of an element/],
    [parts[2], 'How the two work together', /A grid row can slide open to its content’s height/, /A row closes only as far as its item can/]
  ])('should keep, under "%s", a closed fold named "%s" with the depth inside it and the point outside it', async (part, fold, point, depth) => {
    render(<TestApp at={demosAt('?tab=accordions')}/>);

    const explained = await screen.findByRole('region', {name: part});
    const folded = within(explained).getByRole('group', {name: fold});

    expect(folded).toContainElement(within(explained).getByText(depth));
    expect(within(explained).getByText(depth)).not.toBeVisible();
    expect(within(explained).getByText(point)).toBeVisible();
  });

  test('should tell, under reveal, what content-visibility is before what allow-discrete does with it', async () => {
    render(<TestApp at={demosAt('?tab=accordions&style=reveal')}/>);

    const platform = await screen.findByRole('region', {name: parts[1]});

    expect(within(platform).getByText(/A pseudo-element is a part of an element/))
      .toHaveTextContent('Content-visibility hides the closed content, and it has no values between on and off. Allow-discrete lets a property like that switch at the end of a close and at the start of an open.');
  });
});

describe('the runs in view, with the folds shut', () => {
  test('should say what a transition is where the tab first uses it', async () => {
    render(<TestApp at={demosAt('?tab=accordions')}/>);

    const oldWay = await screen.findByRole('region', {name: parts[0]});

    expect(within(oldWay).getByText(/Before a known height/)).toHaveTextContent(/A transition is CSS moving a property from its old value to its new one over a set time\. It can move a height/);
  });

  test.each([['inclusive', 'checkbox'], ['exclusive', 'radio']])('should, with %s chosen, say what the platform build replaces without the %s’s words', async (type, input) => {
    render(<TestApp at={demosAt(`?tab=accordions&type=${type}`)}/>);

    const platform = await screen.findByRole('region', {name: parts[1]});
    const run = within(platform).getByText(/This build uses details and summary/);

    expect(run).toBeVisible();
    expect(run).not.toHaveTextContent(/no for and no id|sibling selector/);
    expect(run).toHaveTextContent(`nothing has to tie a label to a hidden ${input}. Details remembers whether it is open, so there is no ${input} to hide and no rule that reads it.`);
  });

  test('should, with exclusive chosen, say in view what makes the build exclusive', async () => {
    render(<TestApp at={demosAt('?tab=accordions&type=exclusive')}/>);

    const platform = await screen.findByRole('region', {name: parts[1]});

    expect(within(platform).getByText(/This build uses details and summary/))
      .toHaveTextContent(/Give every details the same name, and the browser closes the others when one opens\. Pressing the open one closes it, so the list needs no Close bar\. That is the exclusive build\. This replaces the three old ways/);
  });

  test.each(['reveal', 'drawer'])('should, with %s chosen, say in view that only Chromium slides the fold, and only there', async motion => {
    render(<TestApp at={demosAt(`?tab=accordions&style=${motion}`)}/>);

    const platform = await screen.findByRole('region', {name: parts[1]});

    expect(within(platform).getByText(/This build uses details and summary/)).toHaveTextContent(/and the known height\. Today only Chromium slides the fold\. Firefox and WebKit open it at once, and it still works\.$/);
    expect(platform).not.toHaveTextContent(/Today only Chromium moves the size/);
  });

  test('should, with static chosen, say nothing about which browsers slide', async () => {
    render(<TestApp at={demosAt('?tab=accordions&style=static')}/>);

    const platform = await screen.findByRole('region', {name: parts[1]});

    expect(platform).not.toHaveTextContent(/Today only Chromium/);
  });

  test('should say what grid and :has() are in the run on the grid row', async () => {
    render(<TestApp at={demosAt('?tab=accordions')}/>);

    const together = await screen.findByRole('region', {name: parts[2]});

    expect(within(together).getByText(/A grid row can slide open to its content’s height/))
      .toHaveTextContent(/^Grid is the CSS layout that sets a box out in rows and columns\. A grid row can slide open to its content’s height in every browser today\. Under the bar[^]*while the fold is closed\. :has\(\) is a piece of a CSS rule that picks an element/);
  });

  test('should say, with inclusive chosen, that the checkbox remembers as it did in the known-height build', async () => {
    render(<TestApp at={demosAt('?tab=accordions&type=inclusive')}/>);

    const together = await screen.findByRole('region', {name: parts[2]});

    expect(within(together).getByText(/The inclusive build is a checkbox build again/)).toHaveTextContent(/the checkbox remembers whether the part is open, as it did in the known-height build\./);
  });

  test.each([
    {type: 'inclusive', opening: /^The inclusive build is a checkbox build again/, sentence: 'Each bar holds the part’s name and, at its end, an Open or Close control, and the checkbox remembers whether the part is open, as it did in the known-height build. The name is only a name: pressing it does nothing. Only the control works the fold.'},
    {type: 'exclusive', opening: /^The exclusive build is a radio group/, sentence: 'Each bar holds the part’s name and, at its end, an Open or Close control; the name is only a name, and only the control works the fold.'}
  ])('should say, with $type chosen, that only the control at the bar’s end works the fold', async ({type, opening, sentence}) => {
    render(<TestApp at={demosAt(`?tab=accordions&type=${type}`)}/>);

    const together = await screen.findByRole('region', {name: parts[2]});

    expect(within(together).getByText(opening)).toHaveTextContent(sentence);
  });

  test('should say, with exclusive chosen, that the radio and the stylesheet own whether a part is open', async () => {
    render(<TestApp at={demosAt('?tab=accordions&type=exclusive')}/>);

    const oldWay = await screen.findByRole('region', {name: parts[0]});

    expect(within(oldWay).getByText(/The cost was script/)).toHaveTextContent(/the radio and the stylesheet own that/);
  });

  test('should say that a transition turns around when the reader presses again midway', async () => {
    render(<TestApp at={demosAt('?tab=accordions')}/>);

    const motion = await screen.findByRole('region', {name: parts[3]});

    expect(within(motion).getByText(/Every fold on this tab moves by transition/)).toHaveTextContent(/If the reader presses again midway, a transition turns around from wherever it is\./);
  });
});

describe('the word attribute', () => {
  test.each(['inclusive', 'exclusive'])('should be said, with %s chosen, and then what an id is, before the label’s for attribute', async type => {
    render(<TestApp at={demosAt(`?tab=accordions&type=${type}`)}/>);

    const oldWay = await screen.findByRole('region', {name: parts[0]});

    expect(within(oldWay).getByText(/To open and close a part/)).toHaveTextContent(/An attribute is a name, often with a value, written inside an element’s opening tag\. An id is an attribute that gives an element a name no other element on the page shares\. The label’s for attribute names the/);
  });
});

describe('the word display', () => {
  test('should be said first where display none is weighed against hiding the input off screen, with no text before it saying display', async () => {
    render(<TestApp at={demosAt('?tab=accordions')}/>);

    const oldWay = await screen.findByRole('region', {name: parts[0]});

    const told = oldWay.textContent;

    expect(told.search(/display/i)).toBeGreaterThan(told.indexOf('far off the page'));
    expect(explanation.runTelling(oldWay, /far off the page/)).toHaveTextContent('far off the page. Display is the property that sets how a box lays out what it holds, and display none would hide the checkbox too, but it would also take the checkbox out of the tab order, and a keyboard could no longer open the part.');
  });
});

describe('the platform build’s bars', () => {
  test('should say a flex bar loses the marker and draws the old build’s arrow in its place, in a run with no sample', async () => {
    render(<TestApp at={demosAt('?tab=accordions')}/>);

    const platform = await screen.findByRole('region', {name: parts[1]});
    const run = explanation.runTelling(platform, /Summary also draws its own arrow/);

    expect(run).toHaveTextContent('Summary also draws its own arrow, called a marker, where the checkbox build drew one from two borders. The browser gives a summary the display of a list item, and a marker is drawn only on a list item. This bar’s display is flex, a row, so the marker goes with it, and the bar draws the checkbox build’s arrow in its place, so this bar reads the same as the bars of the known-height and measured builds.');
    expect(run).not.toHaveTextContent(/every build/);
    expect(explanation.everyCodeBeside(platform, /Summary also draws its own arrow/)).toEqual([]);
  });

  test('should say the browser marks an open details with the open attribute, and [open] picks it to turn the arrow, beside the rule that turns it', async () => {
    render(<TestApp at={demosAt('?tab=accordions')}/>);

    const platform = await screen.findByRole('region', {name: parts[1]});

    expect(explanation.runTelling(platform, /The arrow points right while the part is closed/)).toHaveTextContent('The arrow points right while the part is closed. When the part opens, the browser adds open to the details in the page it is showing, as if it were written in the opening tag. A name in that place is called an attribute. [open] is a piece of a CSS rule that picks an element with that attribute, and its rule turns the arrow down.');
    expect(explanation.everyCodeBeside(platform, /The arrow points right while the part is closed/).join()).toMatch(/&\[open] > \.info-label::after \{[^]*rotate\(135deg\)/);
  });

  test('should keep the bar’s own run to the row, the classes it wears and its focus', async () => {
    render(<TestApp at={demosAt('?tab=accordions')}/>);

    const platform = await screen.findByRole('region', {name: parts[1]});

    expect(explanation.runTelling(platform, /The bar is the same flex row/)).toHaveTextContent(/^The bar is the same flex row as the label in the checkbox build, now on summary, wearing the same classes: inverse-filled for its colours, attentive for the approach colour, the ring and a glow while it is pressed, and field-outlined for the hairline that draws the line between one bar and the next\. Summary takes focus and hover itself, where the checkbox build carried focus from the hidden checkbox to the label\./);
  });

  test('should show the classes the details bar wears beside its own rule', async () => {
    render(<TestApp at={demosAt('?tab=accordions')}/>);

    const platform = await screen.findByRole('region', {name: parts[1]});

    expect(explanation.everyCodeBeside(platform, /The bar is the same flex row/).join()).toMatch(/\.info-label \{[^]*\.inverse-filled \{[^]*\.attentive:where\(:not\(:disabled\)\) \{[^]*\.field-outlined \{/);
  });
});

describe('the known-height build’s bars', () => {
  test('should say the label wears prior-approached, a shared class that reads an earlier sibling', async () => {
    render(<TestApp at={demosAt('?tab=accordions')}/>);

    const oldWay = await screen.findByRole('region', {name: parts[0]});

    expect(explanation.runTelling(oldWay, /A keyboard user needs to see which bar they are on/)).toHaveTextContent('so the label wears prior-approached, a shared class that reads an earlier sibling. The :focus-visible pseudo-class picks the checkbox while it has keyboard focus, and :focus-visible ~ .prior-approached gives the bar the approach colour, ink for its words and a ring inside its edge. The browser treats hovering a label as hovering its checkbox, so the class’s :hover rule lights the bar too.');
  });

  test('should show the known-height build’s own hover rule beside the run that lights its bar', async () => {
    render(<TestApp at={demosAt('?tab=accordions')}/>);

    const oldWay = await screen.findByRole('region', {name: parts[0]});
    const beside = explanation.everyCodeBeside(oldWay, /A keyboard user needs to see which bar they are on/).join();

    expect(beside).toMatch(/@media \(hover: hover\) \{\s*:hover ~ \.prior-approached \{[^]*:focus-visible ~ \.prior-approached \{/);
    expect(beside).not.toMatch(/&:hover/);
  });

  test('should show the arrow’s one shared shape beside the run that draws it', async () => {
    render(<TestApp at={demosAt('?tab=accordions')}/>);

    const oldWay = await screen.findByRole('region', {name: parts[0]});

    expect(explanation.everyCodeBeside(oldWay, /Each bar shows an arrow/).join()).toMatch(/\.opening-arrow::after \{[^]*rotate\(45deg\)/);
  });

  test('should say the arrow’s borders are drawn in currentcolor, so the arrow changes colour with the words', async () => {
    render(<TestApp at={demosAt('?tab=accordions')}/>);

    const oldWay = await screen.findByRole('region', {name: parts[0]});

    expect(explanation.runTelling(oldWay, /Each bar shows an arrow/)).toHaveTextContent('The arrow is an empty box drawn after the label’s words. The bar wears corner-after, a shared class that gives that box only its top and right borders; the sheet sizes it and turns it 45 degrees so the corner points right. The borders are drawn in currentcolor, a keyword for the element’s own text colour, so the arrow changes colour with the bar’s words. When the');
  });

  test.each(['inclusive', 'exclusive'])('should say, with %s chosen, what wearing a shared class means before any class is named, with the class beside it', async type => {
    render(<TestApp at={demosAt(`?tab=accordions&type=${type}`)}/>);

    const oldWay = await screen.findByRole('region', {name: parts[0]});
    const run = explanation.runTelling(oldWay, /The bar’s colours are the page’s the other way round/);

    expect(run).toHaveTextContent('The bar’s colours are the page’s the other way round: light words on a dark ground, where the page sets dark words on a light one. That look is shared with the rest of the site, so it does not live in the bar’s own sheet. It is a class in a shared sheet, inverse-filled, and the bar wears it: the class sits in the element’s class attribute, so its rules apply. The bar’s own sheet keeps the structure, the row, the padding and the height. The samples that follow show both, the sheet’s rule and then the shared class.');
    expect(explanation.everyCodeBeside(oldWay, /The bar’s colours are the page’s the other way round/).join()).toMatch(/^\.inverse-filled \{/);
    expect(outOfReadingOrder([
      run,
      explanation.runTelling(oldWay, /Each bar shows an arrow/),
      explanation.runTelling(oldWay, /A keyboard user needs to see which bar they are on/),
      explanation.runTelling(oldWay, /paints the sign in its background instead/),
      ...type === 'exclusive' ? [explanation.runTelling(oldWay, /The Close bar is shorter than the others/)] : []
    ])).toEqual([]);
  });

  test('should show the arrow’s classes in the order its run names them: the sheet’s rules, the corner, then the turns', async () => {
    render(<TestApp at={demosAt('?tab=accordions')}/>);

    const oldWay = await screen.findByRole('region', {name: parts[0]});

    expect(explanation.everyCodeBeside(oldWay, /Each bar shows an arrow/).join()).toMatch(/\.opening-arrow::after \{[^]*\.corner-after::after \{[^]*\.info-toggle:checked ~ \.info-label::after/);
    expect(explanation.everyCodeBeside(oldWay, /Each bar shows an arrow/).join()).not.toContain('.inverse-filled');
  });
});

describe('the classes the bars wear', () => {
  test('should say the Close bar’s ground and text are two plain colour classes, and show them beside its rule', async () => {
    render(<TestApp at={demosAt('?tab=accordions&type=exclusive')}/>);

    const oldWay = await screen.findByRole('region', {name: parts[0]});

    expect(explanation.runTelling(oldWay, /The Close bar is shorter than the others/)).toHaveTextContent('so a press anywhere on the bar counts. Its ground is field-inverse and its text field-ink, two plain colour classes with no hover or focus of their own.');
    expect(explanation.everyCodeBeside(oldWay, /The Close bar is shorter than the others/).join()).toMatch(/&\.close \{[^]*\.field-inverse \{[^]*\.field-ink \{/);
  });

  test.each([
    {type: 'inclusive', input: 'checkbox'},
    {type: 'exclusive', input: 'radio'}
  ])('should say, with $type chosen, what the eye and the ear meet on the control, beside the rules that show its word', async ({type, input}) => {
    render(<TestApp at={demosAt(`?tab=accordions&type=${type}`)}/>);

    const together = await screen.findByRole('region', {name: parts[2]});

    expect(explanation.runTelling(together, /^The bar is named by its part/)).toHaveTextContent(`The bar is named by its part, and the control at its end is the one thing that works the fold. The control is a ${input} under a label that holds the Open or Close the eye sees and, for the ear, the part’s name, so a listener hears the word, the part and the state, such as “Open basalt, ${input}, not checked”, and someone using voice control says what they see. Its checked state is the part’s state. The control is a box drawn by hairline-outline, a hairline in the text’s own colour, and press-inverted, which inverts it while it is pressed.`);
    expect(explanation.everyCodeBeside(together, /^The bar is named by its part/).join()).toMatch(/\.when-closed \{[^]*\.when-open \{[^]*\.hairline-outline \{[^]*\.press-inverted:active \{/);
  });
});

describe('the known-height build’s scroll sign', () => {
  test('should say the sign is a shadow held at the panel’s foot, darkest at the edge, under a cover that scrolls with the text', async () => {
    render(<TestApp at={demosAt('?tab=accordions')}/>);

    const oldWay = await screen.findByRole('region', {name: parts[0]});

    expect(explanation.runTelling(oldWay, /paints the sign in its background instead/)).toHaveTextContent('so the section wears foot-shadowed, which paints the sign in its background instead: a shadow held at its foot, darkest at the edge, and a cover in the panel’s colour that scrolls with the text and hides the shadow at the end, or when the text fits. It wears focus-ringed too, so a keyboard reader sees when they have reached it.');
    expect(explanation.everyCodeBeside(oldWay, /paints the sign in its background instead/).join()).toMatch(/\.info-text \{[^]*\.foot-shadowed \{[^]*\.focus-ringed \{/);
  });
});
