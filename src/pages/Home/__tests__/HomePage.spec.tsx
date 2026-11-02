import {TestApp} from '@__test_support/TestApp';
import {render} from '@testing-library/react';
import {Paths} from '@pages/Paths';
import {outOfReadingOrder} from '@__test_support/reading-order';
import {homePage} from '@pages/Home/__test_support/home';

describe('the home page', () => {
  const opener = [/^I made this site/, /^Each language has its own job/, /^I wrote this for developers/, /^More code rarely fixes/, /^Below, each language has a section/, /^The Demos put that practice/];

  beforeEach(async () => {
    render(<TestApp at={Paths.home}/>);
    await homePage.arrived();
  });

  test('should link the opener to the book it names, then its map to the Record, Practice and the Demos, and nothing else', () => {
    expect(opener.flatMap(opening => homePage.linksIn(homePage.paragraph(opening)))
      .map(link => [link.textContent, link.getAttribute('href')])).toEqual([
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

  test('should send the Structure claim\'s details element to the accordions demo', () => {
    expect(homePage.claimLinks('Structure').map(link => [link.textContent, link.getAttribute('href')]))
      .toEqual([['a details element', `${Paths.demos}accordions/`]]);
  });

  test('should send the Behavior claim’s quotation from Vue to Vue’s guide on single-file components', () => {
    expect(homePage.claimLinks('Behavior').map(link => [link.textContent, link.getAttribute('href')]))
      .toEqual([['“a natural extension of the classic trio of HTML, CSS and JavaScript”', 'https://vuejs.org/guide/scaling-up/sfc']]);
  });

  test('should send the Presentation naming sentence to Practice, the motion claim to web.dev\'s account of which animations stay cheap, and the fold to the accordions demo', () => {
    expect(homePage.claimLinks('Presentation').map(link => [link.textContent, link.getAttribute('href')])).toEqual([
      ['Practice', Paths.practice],
      ['A browser can animate transform and opacity cheaply', 'https://web.dev/articles/animations-overview'],
      ['the accordions', `${Paths.demos}accordions/`]
    ]);
  });
});
