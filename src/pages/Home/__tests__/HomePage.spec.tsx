import {TestApp} from '@__test_support/TestApp';
import {render} from '@testing-library/react';
import {Paths} from '@pages/Paths';
import {outOfReadingOrder} from '@__test_support/reading-order';
import {homePage} from '@pages/Home/__test_support/home';
import {recordPage} from '@pages/Record/__test_support/record';
import {britishSpellingsOnThePage} from '@__test_support/spelling';
import {topicNames} from '@pages/Demos/types';
import {spelledOut} from '@pages/Record/moments/spelled-out';

describe('the home page', () => {
  const opener = [/^I made this site/, /^Each language has its own job/, /^I wrote this for developers/, /^More code rarely fixes/, /^Below, each language has a section/, /^The Demos put that practice/];

  beforeEach(async () => {
    render(<TestApp at={Paths.home}/>);
    await homePage.arrived();
  });

  test('should spell its own prose the American way', () => {
    expect(britishSpellingsOnThePage()).toEqual([]);
  });

  test('should say why the site was made, then each language’s job, who it’s for, what fixes their bugs, where each part of the site is, then the Demos', () => {
    expect(homePage.paragraph(/^I made this site/)).toHaveTextContent('I made this site because I couldn’t find one about how HTML, CSS and JavaScript work together. There is plenty on each. MDN documents all three in depth, the standards define each in its own specification, and most courses teach them one at a time. But a page is built from all three at once, and each has a job the others can’t do. The closest thing I found is Jeremy Keith’s Resilient Web Design, which treats the three as layers and tells their history, without code, by design. This site follows the same languages through working code.');
    expect(homePage.paragraph(/^Each language has its own job/)).toHaveTextContent('Each language has its own job. HTML says what things are, CSS says how they look, and JavaScript says how they respond: structure, presentation and behavior.');
    expect(homePage.paragraph(/^I wrote this for developers/)).toHaveTextContent('I wrote this for developers who learned the three the way most of us did, one at a time and on the job, asking one language to do most of the work. Jobs then end up wherever they can be done: a div standing in for a button, a look written on the element itself, a script taking over scrolling, focus or the back button. Each of those works well enough to ship. The bugs come later, when someone uses the page with a keyboard, with a screen reader, or on a phone.');
    expect(homePage.paragraph(/^More code rarely fixes/)).toHaveTextContent('More code rarely fixes those bugs. Much of the work is already done by the platform: the browser and the standards it follows. The platform keeps getting better, too, because the people who write the standards listen to developers, watch what they build, and adopt what proves itself across the browsers. Putting the job where it belongs lets each language do what it already does.');
    expect(homePage.paragraph(/^Below, each language has a section/)).toHaveTextContent('Below, each language has a section of its own: what it says, what its history teaches, and where to read more. The Record tells that history in full: a story for each language, then every moment in order, then the three read together, and the pattern they follow, which HTML’s own design principles wrote down in 2007. Practice shows how I organize each language, with a tab for each.');
    expect(homePage.paragraph(/^The Demos put that practice/)).toHaveTextContent('The Demos put that practice to work on features built from this site’s own code and explained beside it, running from simple to expert. Some compare the trick we used before the platform could do the job with what it does now; the rest show what the platform does with no library for the job.');
    expect(outOfReadingOrder(opener.map(homePage.paragraph))).toEqual([]);
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

  test('should offer three concerns, each named by its responsibility and opened by its quotation, then close on where the page is made', () => {
    expect(homePage.sectionHeadings()).toEqual(['Structure', 'Presentation', 'Behavior', 'Where the page is made']);
    expect(homePage.quotationIn('Structure')).toHaveTextContent(/identifies the meaning, purpose, and structure/);
    expect(homePage.quotationIn('Presentation')).toHaveTextContent(/separation of HTML from CSS/);
    expect(homePage.quotationIn('Behavior')).toHaveTextContent(/a much livelier Web/);
  });

  const sendOn = (concern: string) => ({
    signposts: homePage.concernText(concern).slice(-2),
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
    signposts: ['Its story is on the Record.', 'How I organize it is on Practice.'],
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

  test('should close on where the page is made, after Behavior, its one paragraph sending the reader to the Behavior story', () => {
    expect(homePage.sectionText('Where the page is made')).toEqual(['What changes between sites is where the HTML is made, and that is a trade. A server can send each page as a document, so it can be read before any script runs, and the browser handles moving between pages: scrolling, focus, the back button. That needs a server, or a build step that renders each page ahead of time. Or a script can make the page in the browser, as a single-page application does. That can be served as plain files and keeps its state as the reader moves around, and the browser’s jobs between pages become the app’s, done by hand or designed around. This site is one, and it also renders each page ahead of time when it is built: GitHub Pages serves it as plain files, and it talks to GitHub’s APIs and the browser directly. How the web moved between the two, and back, is the Behavior story on the Record. Knowing what HTML, CSS and the browser already do is what makes the trade visible: which jobs come free, which take work, and which are worth leaning into.']);
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

describe('the Demos, as the home page and the Record describe them', () => {
  const topicsNamedIn = (text: string): string[] =>
    Object.values(topicNames).filter(name => new RegExp(`\\b${name}\\b`, 'i').test(text));
  const countsIn = (text: string): string[] =>
    Array.from({length: 100}, (_, count) => spelledOut(count)).filter(word => new RegExp(`\\b${word}\\b`, 'i').test(text));

  test('should stay true when a demo is added: the home names no tab and the Record only the accordions and the tables, and neither counts them', async () => {
    const {unmount} = render(<TestApp at={Paths.home}/>);
    await homePage.arrived();
    const opener = homePage.paragraph(/^The Demos put that practice/).textContent ?? '';
    unmount();

    render(<TestApp at={Paths.record}/>);
    await recordPage.arrived();
    const bridge = recordPage.paragraphOpening(/^The Demos run from simple to expert/).textContent ?? '';

    expect(topicsNamedIn(opener)).toEqual([]);
    expect(topicsNamedIn(bridge)).toEqual(['Accordions', 'Tables']);
    expect([...countsIn(opener), ...countsIn(bridge)]).toEqual([]);
  });
});
