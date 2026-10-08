import {render, screen, waitFor, within} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {TestApp} from '@__test_support/TestApp';
import {chartPageAt, demosAt} from '@pages/Demos/__test_support';
import {Paths} from '@pages/Paths';
import names from '@pages/names.json';

const described = (): string | null => document.head.querySelector('meta[name="description"]')?.getAttribute('content') ?? null;

describe('each page is named where a search shows it', () => {
  test.each([
    ['the home page', Paths.home, names.home],
    ['the accordions tab', demosAt('?tab=accordions'), names.demos.accordions],
    ['the z-index tab', demosAt('?tab=z-index'), names.demos['z-index']],
    ['the drag sort tab', demosAt('?tab=dragAndDrop'), names.demos.dragAndDrop],
    ['the charts tab', demosAt('?tab=charts'), names.demos.charts],
    ['the tables tab', demosAt('?tab=tables'), names.demos.tables],
    ['the price line’s page', chartPageAt('price'), names.charts.price],
    ['the pie’s page', chartPageAt('pie'), names.charts.pie],
    ['the users page', Paths.users, names.users],
    ['the gallery', `${Paths.artGallery}?page=1&size=8&tab=aic`, names.gallery],
    ['the games page', Paths.games, names.games]
  ])('should give %s its own title and description', async (_page, path, {title, description}) => {
    render(<TestApp at={path}/>);

    await waitFor(() => expect(document.title).toBe(title));
    expect(described()).toBe(description);
  });

  test('should carry the new tab’s title and description when the reader moves to it', async () => {
    render(<TestApp at={demosAt('?tab=accordions')}/>);
    await waitFor(() => expect(document.title).toBe(names.demos.accordions.title));

    await userEvent.click(within(await screen.findByRole('navigation', {name: 'demos'})).getByText('Z-index'));

    await waitFor(() => expect(document.title).toBe(names.demos['z-index'].title));
    expect(described()).toBe(names.demos['z-index'].description);
  });

  test.each(Object.entries(names.charts))('should describe the %s chart’s page with the story its tutorial tells', async (kind, {description}) => {
    render(<TestApp at={chartPageAt(kind, `?graph=${kind}`)}/>);

    expect(await screen.findByRole('heading', {name: description.replace(/\.$/, '')})).toBeInTheDocument();
    await waitFor(() => expect(described()).toBe(description));
  });
});
