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
    expect(homePage.paragraph(/^A webpage is three languages working in concert/)).toHaveTextContent('A webpage is three languages working in concert. HTML says what things are, CSS says how they show, and JavaScript says how they respond. They were designed apart, on purpose. When one could not yet do a job, another covered for it until the standard caught up, which is what HTML’s own principles ask: “consider adopting it rather than forbidding it or inventing something new”.');
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

  test('the page offers three concerns, each named by its responsibility', () => {
    expect(homePage.concernHeadings()).toEqual(['Structure', 'Presentation', 'Dynamic']);
    expect(homePage.quotation(/identifies the meaning, purpose, and structure/)).toBeVisible();
    expect(homePage.quotation(/separation of HTML from CSS/)).toBeVisible();
    expect(homePage.quotation(/a much livelier Web/)).toBeVisible();
  });

  test.each([
    ['Structure', 'HTML says what each thing on the page is: a heading, a list, a button, a form. Berners-Lee borrowed its grammar and invented one tag, the anchor, and the browsers added the rest, written down only after it was in use. The standard followed the pages, left them for XML in 1998, and came back to them with HTML5, whose objectives, as html.com summarizes them, put semantic markup first. So the rule is to choose the element that means what the content is, and add the look and the behaviour on top of it. The element brings its meaning and its behaviour with it, and a reader’s tools read the meaning before anything else arrives.', 'structure'],
    ['Presentation', 'CSS says how things look. Authors asked for the look in 1994 and the browsers answered with tags; Håkon Wium Lie and Bert Bos answered with a sheet and a cascade, in which the author’s wishes, the reader’s and the browser’s combine, and the browsers took a decade of tests to render it alike. So a look belongs in the sheet, named for what the element needs, and nothing in the HTML says how it looks. When the sheet cannot say it yet, the workaround stays beside the rule and goes when the platform catches up.', 'presentation'],
    ['Dynamic', 'JavaScript says how things respond. Brendan Eich wrote its first interpreter in about ten days to touch a page the server had already sent; the page then became the program, and the cost came with the growth, until the document came first again with script only where a region must respond. So the document comes first and the program only where the page needs one. Inside the program, the state is what is true, an event is what happened, and the page is drawn from the two, so a framework can change under it and the core stays.', 'dynamic']
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
});
