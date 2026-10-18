import {render, screen, within} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {TestApp} from '@__test_support/TestApp';
import {Paths} from '@pages/Paths';
import {momentAddress} from '@pages/Record/MomentLink';
import {site} from '@pages/__test_support/site';

const practice = (): HTMLElement => screen.getByRole('region', {name: 'how I organize it'});

const tabs = (): HTMLElement => screen.getByRole('navigation', {name: 'development'});

const practices = [
  ['Structure', 'structure', /^I start from what the content is and pick the element for it/, /^The test is to read the page with the styles turned off/],
  ['Presentation', 'presentation', /^I write CSS in two kinds of sheet/, /^The test is to read a class list on its own/],
  ['Dynamic Interaction', 'dynamic-interaction', /^Behaviour splits into what is true and what happened/, /^The test is to read the state on its own/]
] as const;

describe('the development page', () => {
  test('should open on Structure when no tab is named', async () => {
    render(<TestApp at={Paths.development}/>);

    expect(await screen.findByRole('heading', {name: 'Development Structure', level: 1})).toBeInTheDocument();
    expect(within(tabs()).getByRole('link', {name: 'Structure', current: 'page'})).toBeInTheDocument();
  });

  test('should open on Structure, marked as the current tab, when the address names a tab the page does not have', async () => {
    render(<TestApp at={`${Paths.development}?tab=behaviour`}/>);

    expect(await screen.findByRole('heading', {name: 'Development Structure', level: 1})).toBeInTheDocument();
    expect(within(tabs()).getByRole('link', {name: 'Structure', current: 'page'})).toBeInTheDocument();
  });

  test('should say above the tabs what each one holds', async () => {
    render(<TestApp at={Paths.development}/>);
    const opener = await screen.findByText(/^Each tab below is one of the three concerns/);

    expect(opener).toHaveTextContent(
      'Each tab below is one of the three concerns and says how I organize it: the rules I keep, the moments in the record that taught them, and the test that tells me a rule holds. The demos show the rules at work.');
    expect(opener.compareDocumentPosition(tabs()) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
  });

  test.each(practices)('should open the %s tab from its address, reading how I organize it from its first rule to its test', async (concern, param, firstRule, theTest) => {
    render(<TestApp at={`${Paths.development}?tab=${param}`}/>);

    expect(await screen.findByRole('heading', {name: `Development ${concern}`, level: 1})).toBeInTheDocument();
    expect(within(tabs()).getByRole('link', {name: concern, current: 'page'})).toBeInTheDocument();
    expect(within(practice()).getByText(firstRule)).toBeInTheDocument();
    expect(within(practice()).getByText(theTest)).toBeInTheDocument();
  });

  test.each([
    ['Presentation', 'Structure', Paths.development],
    ['Dynamic Interaction', 'Presentation', `${Paths.development}?tab=presentation`],
    ['Structure', 'Dynamic Interaction', `${Paths.development}?tab=dynamic-interaction`]
  ])('should read %s’s practice when the reader picks its tab from %s', async (concern, _from, at) => {
    const [, , firstRule] = practices.find(([named]) => named === concern) ?? practices[0];
    render(<TestApp at={at}/>);

    await userEvent.click(within(tabs()).getByRole('link', {name: concern}));

    expect(await screen.findByRole('heading', {name: `Development ${concern}`, level: 1})).toBeInTheDocument();
    expect(within(practice()).getByText(firstRule)).toBeInTheDocument();
  });

  test('should land a moment link on its moment in the record', async () => {
    render(<TestApp at={Paths.development}/>);
    const moment = within(practice()).getByRole('link', {name: '2014 moment'});

    expect(moment).toHaveAttribute('href', momentAddress('html5SaysIt'));

    await userEvent.click(moment);

    expect(await site.pageTitled()).toHaveTextContent('The record');
  });
});
