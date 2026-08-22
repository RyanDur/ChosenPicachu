import {screen, within} from '@testing-library/react';
import {renderWithMemoryRouter} from '@test-support';
import {Home} from '@pages/Home';
import {Paths} from '@pages/Paths';

describe('the home page', () => {
  beforeEach(() => renderWithMemoryRouter(Home, {path: Paths.home}));

  test('the web opens on its founding need', () => {
    expect(screen.getByText(/a web of nodes in which the user can browse at will/)).toBeVisible();
    expect(screen.getByText(/Tim Berners-Lee and Robert Cailliau/)).toBeVisible();
    expect(screen.getByText(/three languages working in concert/)).toBeVisible();
    expect(screen.getByText(/The history below is the evidence/)).toBeVisible();
  });

  test('the timeline walks the drift and the correction', () => {
    const timeline = within(screen.getByRole('list', {name: 'the timeline'}));

    expect(timeline.getAllByRole('listitem')).toHaveLength(10);
    ['1989', '1990', '1995', '1996', '2003', '2014', 'Today'].forEach(year =>
      expect(timeline.getAllByText(year).length).toBeGreaterThan(0));
    [/Someone needed something/, /on purpose/, /The blur/, /Zen Garden/, /says it out loud/]
      .forEach(beat => expect(timeline.getByRole('heading', {name: beat})).toBeVisible());
  });

  test('three doors, each named by its responsibility', () => {
    ['Structure', 'Presentation', 'Dynamic Interaction'].forEach(door =>
      expect(screen.getByRole('heading', {name: door})).toBeVisible());
    expect(screen.getByText(/identifies the meaning, purpose, and structure/)).toBeVisible();
    expect(screen.getByText(/separation of HTML from CSS/)).toBeVisible();
    expect(screen.getByText(/a much livelier Web/)).toBeVisible();
  });

  test('each door and the closing walk into the demos', () => {
    expect(screen.getByRole('link', {name: /carry the still table/}))
      .toHaveAttribute('href', expect.stringContaining('tab=tables#station-4'));
    expect(screen.getByRole('link', {name: /play the theater/}))
      .toHaveAttribute('href', expect.stringContaining('tab=tables#station-6'));
    expect(screen.getByRole('link', {name: /carry the drag/}))
      .toHaveAttribute('href', expect.stringContaining('tab=dragAndDrop'));
    expect(screen.getByRole('link', {name: /Start with the tables/}))
      .toHaveAttribute('href', expect.stringContaining(Paths.demos));
  });
});
