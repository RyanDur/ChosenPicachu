import {render, screen, within} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {TestApp} from '@__test_support/TestApp';
import {Paths} from '@pages/Paths';
import {momentAddress} from '@pages/Home/MomentLink';
import {site} from '@pages/__test_support/site';

const practice = (): HTMLElement => screen.getByRole('region', {name: 'how I organize it'});

const tabs = (): HTMLElement => screen.getByRole('navigation', {name: 'development'});

const howTheHomeReads = async (concern: string): Promise<string> => {
  const home = render(<TestApp at={Paths.home}/>);
  const read = (await screen.findByRole('region', {name: `${concern} how I organize it`})).textContent;
  home.unmount();
  return read;
};

describe('the development page', () => {
  test('should open on Structure when no tab is named', async () => {
    render(<TestApp at={Paths.development}/>);

    expect(await screen.findByRole('heading', {name: 'Development Structure', level: 1})).toBeInTheDocument();
    expect(within(tabs()).getByRole('link', {name: 'Structure', current: 'page'})).toBeInTheDocument();
  });

  test('should say above the tabs what each one holds', async () => {
    render(<TestApp at={Paths.development}/>);

    expect(await screen.findByText(/^Each tab below is one of the three concerns/)).toHaveTextContent(
      'Each tab below is one of the three concerns and says how I organize it: the rules I keep, the moment in the record where each was learned, and the test that tells me a rule holds. The demos show the rules at work.');
  });

  test.each([
    ['Structure', 'structure', /^The test is to read the page with the styles turned off/],
    ['Presentation', 'presentation', /^The test is to read a class list on its own/],
    ['Dynamic Interaction', 'dynamic-interaction', /^The test is to read the state on its own/]
  ])('should open the %s tab from its address, reading how I organize it as the home reads it, test included', async (concern, param, theTest) => {
    const asTheHomeReads = await howTheHomeReads(concern);
    render(<TestApp at={`${Paths.development}?tab=${param}`}/>);

    expect(await screen.findByRole('heading', {name: `Development ${concern}`, level: 1})).toBeInTheDocument();
    expect(within(tabs()).getByRole('link', {name: concern, current: 'page'})).toBeInTheDocument();
    expect(practice().textContent).toBe(asTheHomeReads);
    expect(within(practice()).getByText(theTest)).toBeInTheDocument();
  });

  test.each([
    ['Presentation', 'Structure', Paths.development],
    ['Dynamic Interaction', 'Presentation', `${Paths.development}?tab=presentation`],
    ['Structure', 'Dynamic Interaction', `${Paths.development}?tab=dynamic-interaction`]
  ])('should read %s’s practice when the reader picks its tab from %s', async (concern, _from, at) => {
    const asTheHomeReads = await howTheHomeReads(concern);
    render(<TestApp at={at}/>);

    await userEvent.click(within(tabs()).getByRole('link', {name: concern}));

    expect(await screen.findByRole('heading', {name: `Development ${concern}`, level: 1})).toBeInTheDocument();
    expect(practice().textContent).toBe(asTheHomeReads);
  });

  test('should land a moment link on its moment in the record', async () => {
    render(<TestApp at={Paths.development}/>);
    const moment = within(practice()).getByRole('link', {name: '2014 moment'});

    expect(moment).toHaveAttribute('href', momentAddress('html5SaysIt'));

    await userEvent.click(moment);

    expect(await site.pageTitled()).toHaveTextContent('The record');
  });
});
