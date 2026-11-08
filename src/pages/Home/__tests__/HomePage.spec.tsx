import {TestApp} from '@__test_support/TestApp';
import {render} from '@testing-library/react';
import {Paths} from '@frame/navigation';
import {homePage} from '@pages/Home/__test_support/home';

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

  test('should close on where the page is made, its one section', () => {
    expect(homePage.sectionHeadings()).toEqual(['Where the page is made']);
  });

  test('should send the reader on from where the page is made to the Behavior story', () => {
    expect(homePage.sectionLinks('Where the page is made').map(link => [link.textContent, link.getAttribute('href')]))
      .toEqual([['the Behavior story', `${Paths.record}#behavior`]]);
  });
});
