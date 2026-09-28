import {render, screen, within} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {TestApp} from '@__test_support/TestApp';
import {demosAt} from '@pages/Demos/__test_support';

const codeBeside = (part: HTMLElement, words: RegExp): HTMLElement =>
  within(within(part).getAllByRole('listitem').filter(run => within(run).queryByText(words) !== null)[0]).getByRole('code');

const parts = ['How we used to build a fold', 'What the platform gives now', 'The two together', 'How every fold moves'];

const exclusiveOnly = [/Close radio/, /share a name|same name|shared name/, /one part open|one open at a time/];

describe('the accordions tab', () => {
  test('should tell the old way, then the platform, then the two together, then how every fold moves', async () => {
    render(<TestApp at={demosAt('?tab=accordions')}/>);

    const tab = await screen.findByRole('region', {name: 'Accordions'});

    expect(within(tab).getAllByRole('heading', {level: 3}).map(part => part.textContent)).toEqual(parts);
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
    ['inclusive', parts[0], ['Accordion using checkboxes']],
    ['inclusive', parts[1], ['Inclusive accordion using details elements']],
    ['inclusive', parts[2], ['Inclusive accordion using checkboxes']],
    ['exclusive', parts[0], ['Accordion using a radio group']],
    ['exclusive', parts[1], ['Exclusive accordion using details elements']],
    ['exclusive', parts[2], ['Exclusive accordion using radio group']]
  ])('should show, with %s chosen, under "%s" the build of that type', async (type, part, builds) => {
    render(<TestApp at={demosAt(`?tab=accordions&type=${type}`)}/>);

    const explained = await screen.findByRole('region', {name: part});

    expect(within(explained).getAllByRole('heading', {level: 4}).map(build => build.textContent)).toEqual(builds);
  });
});

describe('the accordions explanation', () => {
  test.each(parts.slice(0, 3))('should tell, with inclusive chosen, nothing under "%s" of a shared name, a Close radio or one part open', async part => {
    render(<TestApp at={demosAt('?tab=accordions&type=inclusive')}/>);

    const explained = await screen.findByRole('region', {name: part});

    for (const words of exclusiveOnly) {
      expect(explained).not.toHaveTextContent(words);
    }
  });

  test('should tell, with exclusive chosen, of a shared name, a Close radio and one part open', async () => {
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
    expect(codeBeside(oldWay, /To open and close a part/)).toHaveTextContent(carvedInput);
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

    expect(codeBeside(explained, /HTML now has a disclosure of its own/)).toHaveTextContent(carved);
  });
});

describe('the two together', () => {
  test('should show, with inclusive chosen, the checkbox build\'s label beside its run', async () => {
    render(<TestApp at={demosAt('?tab=accordions&type=inclusive')}/>);

    const explained = await screen.findByRole('region', {name: parts[2]});

    expect(codeBeside(explained, /The inclusive build is a checkbox build again/)).toHaveTextContent('type="checkbox"');
  });

  test('should show, with exclusive chosen, the script that lets a radio close beside its run', async () => {
    render(<TestApp at={demosAt('?tab=accordions&type=exclusive')}/>);

    const explained = await screen.findByRole('region', {name: parts[2]});

    expect(codeBeside(explained, /The exclusive build is a radio group/)).toHaveTextContent('const openAfter');
  });
});

describe('the fold motion', () => {
  test('should sit at the top of the tab, right after the fold type, and in no part', async () => {
    render(<TestApp at={demosAt('?tab=accordions')}/>);

    const tab = await screen.findByRole('region', {name: 'Accordions'});

    expect(within(tab).getAllByRole('group').slice(0, 2))
      .toEqual([within(tab).getByRole('group', {name: 'fold type'}), within(tab).getByRole('group', {name: 'fold motion'})]);
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

    expect(codeBeside(platform, /This replaces the max-height guess/)).toHaveTextContent('.drawer &::details-content');
  });

  test.each(['reveal', 'static'])('should carve no details drawer rule under %s', async style => {
    render(<TestApp at={demosAt(`?tab=accordions&style=${style}`)}/>);

    const platform = await screen.findByRole('region', {name: parts[1]});

    expect(codeBeside(platform, /This replaces the max-height guess/)).not.toHaveTextContent('.drawer &::details-content');
  });

  const partOneSays = {
    reveal: /With reveal, the transition that runs is the one on the state being entered/,
    drawer: /With the drawer, max-height moves on the same timings/,
    static: /With static, nothing moves/
  };

  test.each([
    {style: 'reveal', others: ['drawer', 'static'], carves: ['.info { overflow: hidden; max-height: var(--base-x-100);', '.info-toggle:not(:checked) ~ .info { margin-top: 0; max-height: 0;', '.reveal & .info {', '.reveal & .info-toggle:not(:checked) ~ .info {'], omits: ['.drawer & .info']},
    {style: 'drawer', others: ['reveal', 'static'], carves: ['.info { overflow: hidden; max-height: var(--base-x-100);', '.info-toggle:not(:checked) ~ .info { margin-top: 0; max-height: 0;', '.drawer & .info {', '.drawer & .info-toggle:not(:checked) ~ .info {'], omits: ['.reveal & .info']},
    {style: 'static', others: ['reveal', 'drawer'], carves: ['.info { overflow: hidden; max-height: var(--base-x-100);', '.info-toggle:not(:checked) ~ .info { margin-top: 0; max-height: 0;'], omits: ['.reveal & .info', '.drawer & .info']}
  ] as const)('should tell, with $style chosen, only what that motion does under part one', async ({style, others, carves, omits}) => {
    render(<TestApp at={demosAt(`?tab=accordions&style=${style}`)}/>);

    const oldWay = await screen.findByRole('region', {name: parts[0]});

    expect(within(oldWay).getByText(partOneSays[style])).toBeInTheDocument();
    for (const other of others) {
      expect(within(oldWay).queryByText(partOneSays[other])).not.toBeInTheDocument();
    }
    for (const rule of carves) {
      expect(codeBeside(oldWay, partOneSays[style])).toHaveTextContent(rule);
    }
    for (const rule of omits) {
      expect(codeBeside(oldWay, partOneSays[style])).not.toHaveTextContent(rule);
    }
  });

  test.each([
    {style: 'reveal', says: /With reveal and the drawer, one sits on every bar/, not: /With static there is none/},
    {style: 'drawer', says: /With reveal and the drawer, one sits on every bar/, not: /With static there is none/},
    {style: 'static', says: /With static there is none, so the corner turns in a single frame/, not: /With reveal and the drawer, one sits on every bar/}
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
      .toEqual(within(together).getAllByRole('figure'));
  });

  test('should tell the drawer run under the drawer', async () => {
    render(<TestApp at={demosAt('?tab=accordions&style=drawer')}/>);

    const together = await screen.findByRole('region', {name: parts[2]});

    expect(within(together).getByText(/With the drawer, the text slides down/)).toBeInTheDocument();
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
    ['inclusive', parts[0], ['Off screen, not gone', 'The sheet reads the box', 'Two borders, turned', 'Focus on the box, drawn on the bar', 'The guess']],
    ['exclusive', parts[0], ['Off screen, not gone', 'The sheet reads the box', 'Two borders, turned', 'Focus on the box, drawn on the bar', 'The guess', 'One name, one choice']],
    ['inclusive', parts[1], ['One job, two ways', 'Three pieces become two', 'Sized to the text, no guess']],
    ['exclusive', parts[1], ['One job, two ways', 'Three pieces become two', 'Sized to the text, no guess']]
  ])('should draw, with %s chosen, under "%s" each mechanism in order, named by its title and one sentence', async (type, part, titles) => {
    render(<TestApp at={demosAt(`?tab=accordions&type=${type}`)}/>);

    const explained = await screen.findByRole('region', {name: part});

    expect(titles.map(title => within(explained).getByRole('figure', {name: new RegExp(`^${title}\\. \\S.*\\.$`)})))
      .toEqual(within(explained).getAllByRole('figure'));
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
