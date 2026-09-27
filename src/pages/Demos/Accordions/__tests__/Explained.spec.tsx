import {render, screen, within} from '@testing-library/react';
import {TestApp} from '@__test_support/TestApp';
import {demosAt} from '@pages/Demos/__test_support';

const parts = ['How we used to build a fold', 'What the platform gives now', 'The two together'];

describe('the accordions tab', () => {
  test('should tell the old way, then the platform, then the two together', async () => {
    render(<TestApp at={demosAt('?tab=accordions')}/>);

    const tab = await screen.findByRole('region', {name: 'Accordions'});

    expect(within(tab).getAllByRole('heading', {level: 3}).map(part => part.textContent)).toEqual(parts);
  });

  test.each([
    [parts[0], ['Accordion using checkboxes', 'Accordion using a radio group']],
    [parts[1], ['Exclusive accordion using details elements']],
    [parts[2], ['Exclusive accordion using checkboxes', 'Exclusive accordion using radio group']]
  ])('should show under "%s" the builds it is about', async (part, builds) => {
    render(<TestApp at={demosAt('?tab=accordions')}/>);

    const explained = await screen.findByRole('region', {name: part});

    expect(within(explained).getAllByRole('heading', {level: 4}).map(build => build.textContent)).toEqual(builds);
  });
});

describe('the accordions explanation', () => {
  const codeIn = async (part: string): Promise<string[]> => {
    render(<TestApp at={demosAt('?tab=accordions')}/>);
    const explained = await screen.findByRole('region', {name: part});
    return within(explained).getAllByRole('code').map(code => code.textContent ?? '');
  };

  test.each([
    [parts[0], /Neither build has any script/],
    [parts[1], /There is no script here either/]
  ])('should say under "%s" that its builds have no script', async (part, says) => {
    render(<TestApp at={demosAt('?tab=accordions')}/>);

    const explained = await screen.findByRole('region', {name: part});

    expect(within(explained).getByText(says)).toBeInTheDocument();
  });

  test('should show the one attribute that keeps one details open, as the build writes it', async () => {
    expect((await codeIn(parts[1])).join('\n')).toContain('name="exclusive-toggle-accordion"');
  });

  test('should show the state, the grid rows and :has that let the React builds slide', async () => {
    const code = (await codeIn(parts[2])).join('\n');

    expect(code).toContain('useState');
    expect(code).toContain('grid-template-rows: min-content 0fr');
    expect(code).toContain('&:has(:checked)');
  });
});
