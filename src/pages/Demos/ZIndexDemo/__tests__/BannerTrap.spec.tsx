import {render, waitFor} from '@testing-library/react';
import {TestApp} from '@__test_support/TestApp';
import {appAddress} from '@__test_support/address';
import {demoPage, demosAt} from '@pages/Demos/__test_support';
import {explanation, recipeFolds, recipeSteps} from '@pages/Demos/Recipe/__test_support';
import {bannerExhibit, exhibit, oldBanner, wayLabeled, zIndexTab} from '@pages/Demos/ZIndexDemo/__test_support';

const fixedBanner = 'z-index/why-a-fixed-banner-still-loses';

describe('the banner exhibit', () => {
  test('should give its steps before any control', async () => {
    render(<TestApp at={demosAt(fixedBanner)}/>);
    const banners = await bannerExhibit.find();

    expect(exhibit.controlsBeforeTheSteps(banners, bannerExhibit.controls(banners))).toEqual([]);
  });

  test('should show Raise a banner on both buttons, under the way each is built', async () => {
    render(<TestApp at={demosAt(fixedBanner)}/>);
    const banners = await bannerExhibit.find();

    const oldWay = bannerExhibit.button(banners, 'Raise a banner, the old way');
    const sites = bannerExhibit.button(banners, 'Raise a banner, the site’s own');

    expect(wayLabeled(banners, 'The old way')).toContainElement(oldWay);
    expect(wayLabeled(banners, 'The old way')).not.toContainElement(sites);
    expect(wayLabeled(banners, 'The site’s banner')).toContainElement(sites);
    expect(oldWay).toHaveTextContent(/^Raise a banner$/);
    expect(sites).toHaveTextContent(/^Raise a banner$/);
  });
});

describe('the old banner', () => {
  test('should say nothing until it is raised', async () => {
    render(<TestApp at={demosAt(fixedBanner)}/>);

    await oldBanner.findRaiser();

    expect(oldBanner.standing()).not.toBeInTheDocument();
  });

  test('should be announced when raised from card one', async () => {
    render(<TestApp at={demosAt(fixedBanner)}/>);

    await oldBanner.raise();

    expect(oldBanner.raised()).toHaveRole('alert');
  });

  test('should leave when dismissed by keyboard, and give focus back to the button that raised it', async () => {
    render(<TestApp at={demosAt(fixedBanner)}/>);
    await oldBanner.raiseByKeyboard();
    await oldBanner.tabToDismiss();
    expect(oldBanner.dismissButton()).toHaveFocus();

    await oldBanner.dismissByKeyboard();

    expect(oldBanner.standing()).not.toBeInTheDocument();
    expect(oldBanner.raiser()).toHaveFocus();
  });
});

describe('why a fixed banner still loses', () => {
  test('should link Let’s build this feature to the banner’s story on its page, keeping the reader’s choices', async () => {
    render(<TestApp at={demosAt(fixedBanner, '?raised=second')}/>);

    const part = await explanation.part('Why a fixed banner still loses');

    expect(zIndexTab.linkToTheBannerStory(part))
      .toHaveAttribute('href', `${demosAt('z-index/lets-build-this-feature', '?raised=second')}#news-top-story`);
  });

  test('should open the banner tutorial at the step that makes the panel a popover, keeping the reader’s choices', async () => {
    render(<TestApp at={demosAt(fixedBanner, '?raised=second')}/>);
    const part = await explanation.part('Why a fixed banner still loses');

    await zIndexTab.followToTheBannerStory(part);

    await waitFor(() => expect(demoPage.says('Make the panel a popover')).toBeVisible());
    expect(appAddress.search()).toHaveTextContent('raised=second');
  });

  test('should link, where it tells of the site’s own banner, Why the popover wins to its page, with the raised card carried', async () => {
    render(<TestApp at={demosAt(fixedBanner, '?raised=second')}/>);

    const part = await explanation.part('Why a fixed banner still loses');
    const run = explanation.saying(part, /^The site’s own banner sets no z-index/);

    expect(explanation.linkNamed(run, 'Why the popover wins'))
      .toHaveAttribute('href', demosAt('z-index/why-the-popover-wins', '?raised=second'));
  });

  test('should take the keyboard to the banner’s story in Let’s build this feature', async () => {
    render(<TestApp at={demosAt(fixedBanner)}/>);
    const part = await explanation.part('Why a fixed banner still loses');

    await zIndexTab.followToTheBannerStory(part);

    const story = recipeFolds.story(document.body, 'The user sees the news over the page');
    await waitFor(() => expect(recipeFolds.itemOf(story)).toHaveFocus());
  });

  test('should link the old menu it compares itself with to that menu’s page, with the raised card carried', async () => {
    render(<TestApp at={demosAt(fixedBanner, '?raised=second')}/>);

    const part = await explanation.part('Why a fixed banner still loses');
    const run = explanation.saying(part, /It is the old menu in/);

    expect(explanation.linkNamed(run, 'Why the popover wins')).toHaveAttribute('href', demosAt('z-index/why-the-popover-wins', '?raised=second'));
  });
});

describe('the gap step, on a term part one defines', () => {
  test('should link selector, with the stack growing downward, to part one’s page with the raised card carried', async () => {
    render(<TestApp at={demosAt('z-index/lets-build-this-feature', '?raised=second&stack=down')}/>);

    const step = await recipeSteps.findWords('Open a gap in the stack first');

    expect(explanation.linkNamed(step, 'selector')).toHaveAttribute('href', demosAt('z-index/why-third-is-on-top', '?raised=second&stack=down'));
  });

  test('should link selector, with the stack growing leftward, to part one’s page with the raised card carried', async () => {
    render(<TestApp at={demosAt('z-index/lets-build-this-feature', '?raised=second&stack=left')}/>);

    const step = await recipeSteps.findWords('Open a gap in the stack first');

    expect(explanation.linkNamed(step, 'selector')).toHaveAttribute('href', demosAt('z-index/why-third-is-on-top', '?raised=second&stack=left'));
  });
});
