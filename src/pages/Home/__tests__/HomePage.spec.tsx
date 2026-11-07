import {TestApp} from '@__test_support/TestApp';
import {render} from '@testing-library/react';
import {Paths} from '@pages/Paths';
import {outOfReadingOrder} from '@__test_support/reading-order';
import {homePage} from '@pages/Home/__test_support/home';

describe('the home page', () => {
  beforeEach(async () => {
    render(<TestApp at={Paths.home}/>);
    await homePage.arrived();
  });

  test('should link the opener to the book it names, then its map to the Record, Practice and the Demos, and nothing else', () => {
    expect(homePage.openerLinks()).toEqual([
      ['Resilient Web Design', 'https://resilientwebdesign.com/'],
      ['The Record', Paths.record],
      ['Practice', Paths.practice],
      ['The Demos', Paths.demos]
    ]);
  });

  test('should offer three concerns, each named by its responsibility, then close on where the page is made', () => {
    expect(homePage.sectionHeadings()).toEqual(['Structure', 'Presentation', 'Behavior', 'Where the page is made']);
  });

  const sendOn = (concern: string) => ({
    story: homePage.storySignpost(concern).getAttribute('href'),
    practice: homePage.practiceSignpost(concern).getAttribute('href'),
    outOfReadingOrder: outOfReadingOrder([
      homePage.sectionHeading(concern),
      homePage.quotationIn(concern),
      ...homePage.claim(concern),
      homePage.storySignpost(concern),
      homePage.practiceSignpost(concern)
    ])
  });
  const sentOnTo = (id: string) => ({
    story: `${Paths.record}#${id}`,
    practice: `${Paths.practice}${id}/`,
    outOfReadingOrder: []
  });

  test('should send the reader on from the Structure claim, to its story on the Record and to how I organize it on Practice', () => {
    expect(sendOn('Structure')).toEqual(sentOnTo('structure'));
  });

  test('should send the reader on from the Presentation claim, to its story on the Record and to how I organize it on Practice', () => {
    expect(sendOn('Presentation')).toEqual(sentOnTo('presentation'));
  });

  test('should send the reader on from the Behavior claim, to its story on the Record and to how I organize it on Practice', () => {
    expect(sendOn('Behavior')).toEqual(sentOnTo('behavior'));
  });

  test('should close on where the page is made, after Behavior, sending the reader to the Behavior story', () => {
    expect(homePage.sectionLinks('Where the page is made').map(link => [link.textContent, link.getAttribute('href')]))
      .toEqual([['the Behavior story', `${Paths.record}#behavior`]]);
    expect(outOfReadingOrder([homePage.practiceSignpost('Behavior'), homePage.sectionHeading('Where the page is made')])).toEqual([]);
  });

  test('should send the Behavior quotation\'s source to the Internet Archive\'s copy of Eich\'s interview, the live page being gone', () => {
    expect(homePage.quotationSource('Behavior')).toHaveAttribute('href', 'https://web.archive.org/web/20191215100745/https://www.computerworld.com/article/3458282/the-a-z-of-programming-languages-javascript.html');
  });

  test('should state the Structure rule in a claim that links nowhere, leaving the deeper reading to its story and to Practice', () => {
    expect(homePage.claimLinks('Structure')).toEqual([]);
  });

  test('should state the Presentation rule in a claim that links nowhere, leaving the deeper reading to its story and to Practice', () => {
    expect(homePage.claimLinks('Presentation')).toEqual([]);
  });

  test('should state the Behavior rule in a claim that links nowhere, leaving the deeper reading to its story and to Practice', () => {
    expect(homePage.claimLinks('Behavior')).toEqual([]);
  });
});
