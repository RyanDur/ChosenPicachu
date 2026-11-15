import {render} from '@testing-library/react';
import {TestApp} from '@__test_support/TestApp';
import {Paths} from '@navigation';
import {aicArtResponse} from '@pages/Gallery/__test_support/fixtures';
import {setupAICAllArtResponse} from '@pages/Gallery/__test_support';
import {setupUsersResponse} from '@pages/Users/__test_support';
import {landmarks} from '../__test_support';

describe('the frame’s landmarks a reader meets, in order', () => {
  test('on the home page', async () => {
    render(<TestApp at={Paths.home}/>);
    await landmarks.arrived();

    expect(landmarks.ofTheFrame()).toEqual([
      ['region', '', 'pages and feedback'],
      ['navigation', 'side-nav', 'site'],
      ['banner', 'app-header', ''],
      ['main', '', '']
    ]);
  });

  test('on the gallery, with its filters and its footer', async () => {
    setupAICAllArtResponse(aicArtResponse);
    render(<TestApp at={Paths.artGallery}/>);
    await landmarks.footerArrived();

    expect(landmarks.ofTheFrame()).toEqual([
      ['region', '', 'pages and feedback'],
      ['navigation', 'side-nav', 'site'],
      ['banner', 'app-header', ''],
      ['complementary', 'filter', 'gallery settings'],
      ['main', '', ''],
      ['contentinfo', 'app-footer', ''],
      ['navigation', 'gallery-nav', 'pagination']
    ]);
  });

  test('on the users page', async () => {
    setupUsersResponse([]);
    render(<TestApp at={Paths.users}/>);
    await landmarks.arrived();

    expect(landmarks.ofTheFrame()).toEqual([
      ['region', '', 'pages and feedback'],
      ['navigation', 'side-nav', 'site'],
      ['banner', 'app-header', ''],
      ['main', '', '']
    ]);
  });

  test('in a room that does not exist', async () => {
    render(<TestApp at="/no-such-room/"/>);
    await landmarks.arrived();

    expect(landmarks.ofTheFrame()).toEqual([
      ['region', '', 'pages and feedback'],
      ['navigation', 'side-nav', 'site'],
      ['banner', 'app-header', ''],
      ['main', '', '']
    ]);
  });
});
