import {render, screen, within} from '@testing-library/react';
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

  test('should open on the inclusive type, and offer both types in the address', async () => {
    render(<TestApp at={demosAt('?tab=accordions')}/>);

    const types = await screen.findByRole('navigation', {name: 'fold type'});

    expect(within(types).getByRole('link', {name: 'Inclusive', current: 'page'})).toBeInTheDocument();
    expect(within(types).getByRole('link', {name: 'Exclusive'})).toHaveAttribute('href', expect.stringContaining('type=exclusive'));
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

    expect(codeBeside(explained, /The exclusive build is a radio group/)).toHaveTextContent('const pressedIn');
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
    ['exclusive', parts[1], ['One job, two ways', 'Three pieces become two', 'Sized to the text, no guess']],
    ['inclusive', parts[2], ['A row that grows to its content', 'The padding inside the clip']],
    ['exclusive', parts[2], ['A row that grows to its content', 'The padding inside the clip', 'The text rides the row’s edge']]
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
