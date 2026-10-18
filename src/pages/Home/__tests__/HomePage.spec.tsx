import {TestApp} from '@__test_support/TestApp';
import {render, screen, within} from '@testing-library/react';
import {Paths} from '@pages/Paths';
import {outOfReadingOrder} from '@__test_support/reading-order';

describe('the home page', () => {
  beforeEach(() => {
    render(<TestApp at={Paths.home}/>);
  });

  test('should open on the thesis, then say who the site is for, then what the concerns, the record and the demos give', () => {
    expect(screen.getByText(/^A webpage is three languages working in concert/)).toHaveTextContent('A webpage is three languages working in concert. HTML says what things are, CSS says how they show, and JavaScript says how they respond. They were designed apart, on purpose. When one could not yet do a job, another covered for it until the standard caught up, which is what HTML’s own principles ask: “consider adopting it rather than forbidding it or inventing something new”.');
    expect(screen.getByText(/^This site is for the developer/)).toHaveTextContent('This site is for the developer who has hit a bug on a page and wants to know what the platform meant. Many of us write one of the three languages well and the other two by habit, and the bug lives where the habit and the platform disagree. The habit is a div where a button was meant, a class that names a margin instead of the reason for it, a script that rebuilds what the browser already does: scrolling, focus, the back button. Each one works on the day it is written. The fix, when it stops working, is rarely more code. It is finding which language the job belonged to, and letting that language do it.');
    expect(screen.getByText(/^Each language is one concern below/)).toHaveTextContent('Each language is one concern below: what it is for, what the record taught it, and the moments where that happened. How I organize each one is on the Practice page, one tab for each. The record tells how the web got the three languages, in twenty moments and a closing essay. The demos are where I work the practice: five features built from this site’s own code and explained beside it. Two set the trick we used before the platform could do the job beside what it gives now, and the other three show what the platform does with no library at all.');
    expect(outOfReadingOrder([
      screen.getByText(/^A webpage is three languages working in concert/),
      screen.getByText(/^This site is for the developer/),
      screen.getByText(/^Each language is one concern below/)
    ])).toEqual([]);
  });

  test('should carry one quotation in the opening, linked to HTML’s design principles', () => {
    const thesis = within(screen.getByText(/^A webpage is three languages working in concert/));

    expect(thesis.getAllByRole('link')).toHaveLength(1);
    expect(thesis.getByRole('link', {name: '“consider adopting it rather than forbidding it or inventing something new”'}))
      .toHaveAttribute('href', 'https://www.w3.org/TR/html-design-principles/');
  });

  test('the page offers three concerns, each named by its responsibility', () => {
    ['Structure', 'Presentation', 'Dynamic Interaction'].forEach(concern =>
      expect(screen.getByRole('heading', {name: concern, level: 2})).toBeVisible());
    expect(screen.getByText(/identifies the meaning, purpose, and structure/)).toBeVisible();
    expect(screen.getByText(/separation of HTML from CSS/)).toBeVisible();
    expect(screen.getByText(/a much livelier Web/)).toBeVisible();
  });

  test.each([
    ['Structure', 'HTML says what each thing on the page is: a heading, a list, a button, a form. Berners-Lee’s tags already did that job. They came from CERN’s SGML guide so the documents world would recognise them, and the one tag of his own, the anchor, carried the address of a document on another machine. Twice since, the structure left the document, and twice the standard brought it back. Through 1993 and early 1994 the browsers added tags of their own until, in Dave Raggett’s words, “the language was becoming ill-defined”; HTML 2.0 wrote down the tags in use in 1995, and from 2004 the browser makers wrote the standard themselves, the one that calls a div an element “of last resort”. In 2013 script built the components, and links and the back button became state. HTML5 became a Recommendation in 2014, and html.com’s summary of its objectives puts semantic markup first; in 2016 the document came first again and the program second.', 'I take one rule from that. Choose the element that means what the content is, and add the look and the behaviour on top of it.'],
    ['Presentation', 'CSS says how things look. The need was an author’s: to set the look of a page without writing it into the structure. In October 1994 Håkon Wium Lie drafted Cascading HTML Style Sheets for that, encouraged by Dave Raggett, who had realized HTML should never become a page-description language. The browsers answered the same need with a font tag, and designers with tables for layout. The browsers then took a decade to render the standard to the pixel, pushed by tests and failures named in public. In 2003 Dave Shea’s CSS Zen Garden showed what the separation buys: one document in many designs, by sheets alone. In 2013 components arrived in script, and in 2014 Christopher Chedeau’s talk listed seven problems with CSS at that scale, isolation last.', 'I take a rule from that too. A look belongs in the sheet, named for what the element needs, and nothing in the HTML says how it looks.'],
    ['Dynamic Interaction', 'JavaScript says how things respond. It was not in the 1989 proposal. Brendan Eich wrote the interpreter at Netscape in May 1995 so a page could, in his words above, “touch elements of the page, change their properties, and respond to events”. In 2005 Ajax let a page fetch data and rewrite itself without reloading, and the page became an application. From 2010 each framework moved more of the page into script, and in 2013 React said a component is a description of what the DOM should look like, redrawn from data that changes over time. In 2016 the server rendered first again and the script arrived second.', 'I take one rule from that thread. The state is what is true right now, an event is what just happened, and the page is drawn from the two, so a framework can change under it and the core stays.']
  ])('should tell %s as one essay, from what its language does to the rule I take', (concern, thread, rule) => {
    const essay = within(screen.getByRole('region', {name: concern}));

    expect(essay.getByText(thread.slice(0, 30), {exact: false})).toHaveTextContent(thread);
    expect(essay.getByText(rule.slice(0, 30), {exact: false})).toHaveTextContent(rule);
  });

  test('should leave how I organize each language to the Practice page', () => {
    expect(screen.queryByRole('heading', {name: 'how I organize it'})).not.toBeInTheDocument();
    expect(screen.queryByRole('region', {name: /how I organize it/})).not.toBeInTheDocument();
  });

  test.each([
    ['Structure', '“the language was becoming ill-defined”', 'https://www.w3.org/People/Raggett/book4/ch02.html'],
    ['Structure', '“of last resort”', 'https://html.spec.whatwg.org/multipage/grouping-content.html#the-div-element'],
    ['Dynamic Interaction', '“touch elements of the page, change their properties, and respond to events”', 'https://www.computerworld.com/article/3458282/the-a-z-of-programming-languages-javascript.html']
  ])('should link the %s essay\'s quotation %s to its source', (concern, quoted, source) => {
    expect(within(screen.getByRole('region', {name: concern})).getByRole('link', {name: quoted})).toHaveAttribute('href', source);
  });

  test('should hold the opening and the three languages, one after another, and nothing else', () => {
    const sections = within(screen.getByRole('article')).getAllByRole('heading', {level: 2}).map(heading => heading.textContent);

    expect(screen.getByText(/^A webpage is three languages working in concert/)).toBeVisible();
    expect(sections).toEqual(['Structure', 'Presentation', 'Dynamic Interaction']);
  });

  test.each([
    ['Structure', [
      '1989 CERN needs to share what it knows',
      '1990 The information needs one interface',
      '1991 The web needs collaborators',
      '1995 The browsers’ tags need a standard',
      '1996 The pages need to look the same',
      '2004 The standard needs the real world',
      '2013 Someone needs components',
      '2014 The rules need writing down',
      '2016 The document needs to come first'
    ]],
    ['Presentation', [
      '1994 Authors need control of the look',
      '1996 The pages need to look the same',
      '1996 The style sheet needs a standard',
      '1998 The browsers need to agree',
      '2002 Someone needs to go first',
      '2003 The separation needs proof',
      '2011 The specification needs its tests',
      '2013 Someone needs components'
    ]],
    ['Dynamic Interaction', [
      '1995 Pages need to respond',
      '1997 The language needs a standard',
      '2005 The page needs to update in place',
      '2009 The standard needs to move again',
      '2010 The application needs a frame',
      '2013 Someone needs components',
      '2016 The document needs to come first'
    ]]
  ] as const)('should list %s\'s moments from the record, in the record\'s order', (section, lines) => {
    const moments = within(screen.getByRole('list', {name: `${section}, from the record`})).getAllByRole('link');

    expect(moments.map(moment => moment.textContent)).toEqual(lines);
  });

  test('should send a moment\'s line straight to that moment on the record', () => {
    const presentation = within(screen.getByRole('list', {name: 'Presentation, from the record'}));

    expect(presentation.getByRole('link', {name: '1994 Authors need control of the look'})).toHaveAttribute('href', `${Paths.record}#authors-need-control-of-the-look`);
    expect(within(screen.getByRole('list', {name: 'Structure, from the record'})).getByRole('link', {name: '1995 The browsers’ tags need a standard'}))
      .toHaveAttribute('href', `${Paths.record}#the-browsers-tags-need-a-standard`);
  });

  test.each(['Structure', 'Presentation', 'Dynamic Interaction'])('should set %s\'s moments after its essay, and end them with the whole record', section => {
    const concern = screen.getByRole('region', {name: section});
    const list = within(concern).getByRole('list', {name: `${section}, from the record`});
    const wholeRecord = within(concern).getByRole('link', {name: 'the whole record'});

    expect(within(concern).getByRole('heading', {level: 3, name: 'from the record'})).toBeVisible();
    expect(wholeRecord).toHaveAttribute('href', Paths.record);
    expect(outOfReadingOrder([
      within(concern).getByText(/^(HTML|CSS|JavaScript) says/),
      list,
      wholeRecord
    ])).toEqual([]);
  });

  test.each(['Structure', 'Presentation', 'Dynamic Interaction'])('should name %s\'s moments as a region of their own', section => {
    const evidence = screen.getByRole('region', {name: `${section} from the record`});

    expect(within(evidence).getByRole('list', {name: `${section}, from the record`})).toBeVisible();
  });
});
