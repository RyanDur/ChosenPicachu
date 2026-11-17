import {createMemoryRouter} from 'react-router';
import {currentLocation} from '../currentLocation';

const readAt = (path: string): string =>
  currentLocation.of(createMemoryRouter([{path: '*'}], {basename: '/ChosenPicachu/', initialEntries: [path]}))().pathname;

describe('the current location', () => {
  test('drops the site base the way the router does, whatever its case', () => {
    expect(readAt('/chosenpicachu/demos')).toBe('/demos');
  });

  test('keeps a path whose first part only starts with the site base', () => {
    expect(readAt('/ChosenPicachuX/demos')).toBe('/ChosenPicachuX/demos');
  });
});
