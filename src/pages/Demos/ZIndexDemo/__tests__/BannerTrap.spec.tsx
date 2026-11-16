import {render, waitFor} from '@testing-library/react';
import {TestApp} from '@__test_support/TestApp';
import {appAddress} from '@__test_support/address';
import {demoPage, demosAt} from '@pages/Demos/__test_support';
import {explanation, recipeFolds} from '@pages/Demos/Recipe/__test_support';
import {bannerExhibit, exhibit, oldBanner, wayLabelled, zIndexTab} from '@pages/Demos/ZIndexDemo/__test_support';

describe('the banner exhibit', () => {
  test('should give its steps before any control', async () => {
    render(<TestApp at={demosAt('z-index')}/>);
    const banners = await bannerExhibit.find();

    expect(exhibit.controlsBeforeTheSteps(banners)).toEqual([]);
  });

  test('should show Raise a banner on both buttons, under the way each is built', async () => {
    render(<TestApp at={demosAt('z-index')}/>);
    const banners = await bannerExhibit.find();

    const oldWay = bannerExhibit.button(banners, 'Raise a banner, the old way');
    const sites = bannerExhibit.button(banners, 'Raise a banner, the site’s own');

    expect(wayLabelled(banners, 'The old way')).toContainElement(oldWay);
    expect(wayLabelled(banners, 'The old way')).not.toContainElement(sites);
    expect(wayLabelled(banners, 'The site’s banner')).toContainElement(sites);
    expect(oldWay).toHaveTextContent(/^Raise a banner$/);
    expect(sites).toHaveTextContent(/^Raise a banner$/);
  });
});

describe('the old banner', () => {
  test('should say nothing until it is raised', async () => {
    render(<TestApp at={demosAt('z-index')}/>);

    await oldBanner.findRaiser();

    expect(oldBanner.query()).not.toBeInTheDocument();
  });

  test('should be announced when raised from card one', async () => {
    render(<TestApp at={demosAt('z-index')}/>);

    await oldBanner.raise();

    expect(oldBanner.shown()).toHaveRole('alert');
  });

  test('should leave when dismissed by keyboard, and give focus back to the button that raised it', async () => {
    render(<TestApp at={demosAt('z-index')}/>);
    await oldBanner.raiseByKeyboard();
    await oldBanner.tab();
    await oldBanner.tab();
    expect(oldBanner.dismissButton()).toHaveFocus();

    await oldBanner.pressEnter();

    expect(oldBanner.query()).not.toBeInTheDocument();
    expect(oldBanner.raiser()).toHaveFocus();
  });
});

describe('why a fixed banner still loses', () => {
  test('should open the banner tutorial at the step that writes the panel at the page’s root, keeping the reader’s choices', async () => {
    render(<TestApp at={demosAt('z-index', '?raised=second')}/>);
    const part = await explanation.part('Why a fixed banner still loses');

    await zIndexTab.follow(part, 'the tutorial below');

    expect(demoPage.says('Write the panel last, at the page’s root')).toBeVisible();
    expect(appAddress.search()).toHaveTextContent('raised=second');
  });

  test('should take the keyboard to the story the tutorial below names', async () => {
    render(<TestApp at={demosAt('z-index')}/>);
    const part = await explanation.part('Why a fixed banner still loses');

    await zIndexTab.follow(part, 'the tutorial below');

    const story = recipeFolds.story(document.body, 'The user sees the news over the page');
    await waitFor(() => expect(recipeFolds.itemOf(story)).toHaveFocus());
  });
});
