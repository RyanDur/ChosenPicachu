import {TestApp} from '@__test_support/TestApp';
import {appAddress} from '@__test_support/address';
import {render} from '@testing-library/react';
import {Paths} from '@navigation';
import {homePage} from '@pages/Home/__test_support/home';
import {outOfReadingOrder} from '@__test_support/reading-order';

describe('the home page', () => {
  beforeEach(async () => {
    render(<TestApp at={Paths.home}/>);
    await homePage.arrived();
  });

  test('should come to the claim before the drawing', () => {
    expect(outOfReadingOrder([homePage.claim(), homePage.drawing()])).toEqual([]);
  });

  test('should link only the book the opener names and the three doors', () => {
    expect(homePage.pageLinks()).toEqual([
      ['Resilient Web Design', 'https://resilientwebdesign.com/'],
      ['Read the Record', Paths.record],
      ['Read the Practice', Paths.practice],
      ['Open the Demos', Paths.demos]
    ]);
  });

  test('should open the Record from its door', async () => {
    await homePage.followPageLink('Read the Record');

    expect(appAddress.shown()).toBe(Paths.record);
  });

  test('should open Practice from its door', async () => {
    await homePage.followPageLink('Read the Practice');

    expect(appAddress.shown()).toContain(Paths.practice);
  });

  test('should open the Demos from its door', async () => {
    await homePage.followPageLink('Open the Demos');

    expect(appAddress.shown()).toContain(Paths.demos);
  });

  test('should show a figure named by its caption', () => {
    expect(homePage.drawing()).toBeVisible();
  });

  test('should keep the drawing’s lettering from a screen reader', () => {
    expect(homePage.letteringHeard(['structure', 'section', 'click', 'dialog'])).toEqual([]);
  });
});
