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

  test('should open on the thesis, then say who the site is for, then what the concerns, the record and the demos give', () => {
    expect(homePage.paragraph(/^A webpage is three languages working in concert/)).toHaveTextContent('A webpage is three languages working in concert. HTML says what things are, CSS says how they show, and JavaScript says how they respond. Each was designed to handle a specific concern. When one could not yet do a job, another covered for it until the standard caught up, which is what HTML’s own principles ask: “consider adopting it rather than forbidding it or inventing something new”.');
    expect(homePage.paragraph(/^This site is for the developer/)).toHaveTextContent('This site is for the developer who has hit a bug on a page and wants to know what the platform meant. Many of us write one of the three languages well and the other two by habit, and the bug lives where the habit and the platform disagree. The habit is a div where a button was meant, a class that names a margin instead of the reason for it, a script that rebuilds what the browser already does: scrolling, focus, the back button. Each one works on the day it is written. The fix, when it stops working, is rarely more code. It is finding which language the job belonged to, and letting that language do it.');
    expect(homePage.paragraph(/^Each language is one concern below/)).toHaveTextContent('Each language is one concern below: what it says, the rule its history teaches, and where the rest is. The record tells each language’s story, then every moment in order, then reads the three together. How I organize each one is on the Practice page, one tab for each. The demos are where I work the practice: five features built from this site’s own code and explained beside it. Two set the trick we used before the platform could do the job beside what it gives now, and the other three show what the platform does with no library at all.');
    expect(outOfReadingOrder([
      homePage.paragraph(/^A webpage is three languages working in concert/),
      homePage.paragraph(/^This site is for the developer/),
      homePage.paragraph(/^Each language is one concern below/)
    ])).toEqual([]);
  });

  test('should carry one quotation in the opening, linked to HTML’s design principles', () => {
    const links = homePage.linksIn(homePage.paragraph(/^A webpage is three languages working in concert/));

    expect(links).toHaveLength(1);
    expect(links[0]).toHaveAccessibleName('“consider adopting it rather than forbidding it or inventing something new”');
    expect(links[0]).toHaveAttribute('href', 'https://www.w3.org/TR/html-design-principles/');
  });

  test('should offer three concerns, each named by its responsibility and opened by its quotation', () => {
    expect(homePage.concernHeadings()).toEqual(['Structure', 'Presentation', 'Dynamic']);
    expect(homePage.quotationIn('Structure')).toHaveTextContent(/identifies the meaning, purpose, and structure/);
    expect(homePage.quotationIn('Presentation')).toHaveTextContent(/separation of HTML from CSS/);
    expect(homePage.quotationIn('Dynamic')).toHaveTextContent(/a much livelier Web/);
  });

  test.each([
    ['Structure', 'HTML says what each thing on the page is: a heading, a list, a button, a form. Choose the element that means the content and its behaviour comes with it: a button presses from the keyboard, a details opens and shuts, and a screen reader is told the role and the state, before any script arrives. The same markup tells the next person what the page is, and a search engine, a reader mode and a screen reader read the meaning first. Build those from other parts and script instead and each has to be written again, with varying success. On the accordions tab the checkbox trick shuts on a second press but lets every fold stay open, the radio trick keeps one open but cannot shut itself, and a screen reader calls each what it is made of, a checkbox or a radio. The details element does both and is read as a disclosure, collapsed or expanded. So the rule is to choose the element that means what the content is, and add the look and the behaviour on top of it.', 'structure'],
    ['Presentation', 'CSS says how things look. Put a look in the sheet, under a name that says what the element needs, and it is written once. Change the rule and every element with that name changes. An inline style, or one set from script, lives on the element it was set on, so the same look is written again for the next. The sheet is also where three sources meet, the author’s styles, the reader’s and the browser’s, and the cascade settles which applies. Motion belongs in the sheet too. A browser can animate transform and opacity cheaply, in many cases on its compositor thread rather than the one the script runs on. So a transition the sheet owns can keep going while the script is busy, and a script that moves things frame by frame cannot. Script names the state, and the sheet says how the state looks. When the sheet cannot yet say a look, the workaround stays beside the rule and goes when the platform catches up. So the rule is that a look belongs in the sheet, and nothing in the HTML says how it looks.', 'presentation'],
    ['Dynamic', 'JavaScript says how things respond. Script adds what the elements lack: a behaviour no element has yet, which is what Eich built it for, and a request that brings new information into the page without a new page, which Garrett named Ajax in 2005. The costs arrive when the script becomes the whole page: until it runs there is a blank first paint and a document no crawler or screen reader can read, and the back button is rebuilt by hand. So the document comes first, and a program runs only where a part of the page must respond. Inside that program the state is what is true, an event is what happened, and the page is drawn from the two, so a framework can change under it and the core stays.', 'dynamic']
  ])('should introduce %s in one paragraph and send the reader on, to its story on the record and to how I organize it on Practice', (concern, summary, id) => {
    expect(homePage.concernText(concern)).toEqual([summary, 'Its story is on the record.', 'How I organize it is on Practice.']);
    expect(homePage.storySignpost(concern)).toHaveAttribute('href', `${Paths.record}#${id}`);
    expect(homePage.practiceSignpost(concern)).toHaveAttribute('href', `${Paths.practice}?tab=${id}`);
    expect(outOfReadingOrder([
      homePage.concernHeading(concern),
      homePage.quotationIn(concern),
      homePage.summary(concern),
      homePage.storySignpost(concern),
      homePage.practiceSignpost(concern)
    ])).toEqual([]);
  });

  test('should send the Dynamic quotation\'s source to the Internet Archive\'s copy of Eich\'s interview, the live page being gone', () => {
    expect(homePage.quotationSource('Dynamic')).toHaveAttribute('href', 'https://web.archive.org/web/20191215100745/https://www.computerworld.com/article/3458282/the-a-z-of-programming-languages-javascript.html');
  });

  test('should send the Presentation summary\'s motion claim to web.dev\'s account of which animations stay cheap', () => {
    expect(homePage.linksIn(homePage.summary('Presentation')).map(link => [link.textContent, link.getAttribute('href')]))
      .toEqual([['A browser can animate transform and opacity cheaply', 'https://web.dev/articles/animations-overview']]);
  });
});
