import {TestApp} from '@__test_support/TestApp';
import {render} from '@testing-library/react';
import {Paths} from '@navigation';
import {homePage} from '@pages/Home/__test_support/home';
import {outOfReadingOrder} from '@__test_support/reading-order';

describe('the home page', () => {
  beforeEach(async () => {
    render(<TestApp at={Paths.home}/>);
    await homePage.arrived();
  });

  test('should link the opener to the book it names, the Record and each language\'s story on it, Practice and the Demos, and nothing else', () => {
    expect(homePage.openerLinks()).toEqual([
      ['Resilient Web Design', 'https://resilientwebdesign.com/'],
      ['The Record', Paths.record],
      ['the Structure story', `${Paths.record}#structure`],
      ['the Presentation story', `${Paths.record}#presentation`],
      ['the Behavior story', `${Paths.record}#behavior`],
      ['Practice', Paths.practice],
      ['The Demos', Paths.demos]
    ]);
  });

  test('should show a page pulled apart into its three languages, named by its title and caption', () => {
    expect(homePage.drawing()).toBeVisible();
  });

  test('should come to the drawing after the opener', () => {
    expect(outOfReadingOrder([homePage.openerLink('The Demos'), homePage.drawing()]))
      .toEqual([]);
  });

  test('should keep the drawing’s lettering from a screen reader', () => {
    expect(homePage.letteringHeard()).toEqual([]);
  });
});
