import {not} from '@ryandur/sand';
import {RoomModule, siteOpenedBy} from '../routes';

const modules = import.meta.glob<RoomModule>('../pages/**/{route,tab}.tsx', {eager: true});

describe('the rooms the site opens', () => {
  test('should each be a file the build finds, with a Room to draw', () => {
    const named: string[] = [];
    siteOpenedBy(file => {
      named.push(file);
      return {};
    });

    const roomless = named.filter(file => not(`../${file}` in modules) || typeof modules[`../${file}`].Room !== 'function');

    expect(roomless).toEqual([]);
  });
});
