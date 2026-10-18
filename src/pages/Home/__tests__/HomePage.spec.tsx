import {TestApp} from '@__test_support/TestApp';
import {render, screen, within} from '@testing-library/react';
import {Paths} from '@pages/Paths';
import {outOfReadingOrder} from '@__test_support/reading-order';
import {homePage} from '@pages/Home/__test_support/home';

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
    ['Structure', 'Presentation', 'Dynamic'].forEach(concern =>
      expect(screen.getByRole('heading', {name: concern, level: 2})).toBeVisible());
    expect(screen.getByText(/identifies the meaning, purpose, and structure/)).toBeVisible();
    expect(screen.getByText(/separation of HTML from CSS/)).toBeVisible();
    expect(screen.getByText(/a much livelier Web/)).toBeVisible();
  });

  test.each([
    ['Presentation', 'CSS says how things look. The need was an author’s: to set the look of a page without writing it into the structure. In October 1994 Håkon Wium Lie drafted Cascading HTML Style Sheets for that, encouraged by Dave Raggett, who had realized HTML should never become a page-description language. The browsers answered the same need with a font tag, and designers with tables for layout. The browsers then took a decade to render the standard to the pixel, pushed by tests and failures named in public. In 2003 Dave Shea’s CSS Zen Garden showed what the separation buys: one document in many designs, by sheets alone. In 2013 components arrived in script, and in 2014 Christopher Chedeau’s talk listed seven problems with CSS at that scale, isolation last.', 'I take a rule from that too. A look belongs in the sheet, named for what the element needs, and nothing in the HTML says how it looks.'],
    ['Dynamic', 'JavaScript says how things respond. It was not in the 1989 proposal. Brendan Eich wrote the interpreter at Netscape in May 1995 so a page could, in his words above, “touch elements of the page, change their properties, and respond to events”. In 2005 Ajax let a page fetch data and rewrite itself without reloading, and the page became an application. From 2010 each framework moved more of the page into script, and in 2013 React said a component is a description of what the DOM should look like, redrawn from data that changes over time. In 2016 the server rendered first again and the script arrived second.', 'I take one rule from that thread. The state is what is true right now, an event is what just happened, and the page is drawn from the two, so a framework can change under it and the core stays.']
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
    ['Dynamic', '“touch elements of the page, change their properties, and respond to events”', 'https://www.computerworld.com/article/3458282/the-a-z-of-programming-languages-javascript.html']
  ])('should link the %s essay\'s quotation %s to its source', (concern, quoted, source) => {
    expect(within(screen.getByRole('region', {name: concern})).getByRole('link', {name: quoted})).toHaveAttribute('href', source);
  });

  test('should hold the opening and the three languages, one after another, and nothing else', () => {
    const sections = within(screen.getByRole('article')).getAllByRole('heading', {level: 2}).map(heading => heading.textContent);

    expect(screen.getByText(/^A webpage is three languages working in concert/)).toBeVisible();
    expect(sections).toEqual(['Structure', 'Presentation', 'Dynamic']);
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
    ['Dynamic', [
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

  test.each(['Structure', 'Presentation', 'Dynamic'])('should set %s\'s moments after its essay, and end them with the whole record', section => {
    const concern = screen.getByRole('region', {name: section});
    const list = within(concern).getByRole('list', {name: `${section}, from the record`});
    const wholeRecord = within(concern).getByRole('link', {name: 'the whole record'});

    expect(within(concern).getByRole('heading', {level: 3, name: 'from the record'})).toBeVisible();
    expect(wholeRecord).toHaveAttribute('href', Paths.record);
    expect(outOfReadingOrder([
      homePage.essayOpening(section),
      list,
      wholeRecord
    ])).toEqual([]);
  });

  test.each(['Structure', 'Presentation', 'Dynamic'])('should name %s\'s moments as a region of their own', section => {
    const evidence = screen.getByRole('region', {name: `${section} from the record`});

    expect(within(evidence).getByRole('list', {name: `${section}, from the record`})).toBeVisible();
  });
});

describe('the home page’s Structure essay', () => {
  beforeEach(() => {
    render(<TestApp at={Paths.home}/>);
  });

  test('should read as the words give it, 8 paragraphs, paragraph for paragraph', () => {
    expect(homePage.essay('Structure')).toEqual([
      'In March 1989 Tim Berners-Lee had a problem to solve at CERN, and a language was the smallest part of it. Several thousand people, spread across institutes and experiments and staying about two years each, could not find what the last ones had written down; “often, the information has been recorded, it just cannot be found”. His proposal asked for a system in which “generality and portability are more important than fancy graphics techniques”, and set one requirement above the rest: “a new system must allow existing systems to be linked together without requiring any central control or coordination”. So when he came to write the markup the next year, he did not design it. He took the tags from CERN’s SGML guide so that the documents world would recognise them, and the page that keeps the list says the headings’ definition is “completely historical, deriving from the AAP tag set”. He did not like the grammar, and said so in a parenthesis, “SGML (ugh! but standard)”. Standard counted for more than taste.',
      'One tag was his own. Links inside a document were already for sale, and the 1990 proposal he wrote with Robert Cailliau budgets licences for two commercial hypertext systems. What those systems could not do fits in one line of that proposal: “Nodes do not need to be on the same machine: links may point across machine boundaries.” The anchor carried an address, with the access method, the machine and the path inside it, so a browser could fetch the page from wherever it lived, and the project could aim “to allow links to be made to any information anywhere”. Each server served its own documents and nothing more; the proposal says it “has nothing to know about other servers or other webs and can be kept simple”. That was the 1989 requirement made into markup. Nobody kept an index. A web was pages pointing at pages, and “making a web is as simple as writing a few SGML files which point to your existing data”. The first anchor even carried a TYPE for the relationship a link describes, the job rel does today.',
      'In August 1991 he posted the project to a newsgroup, and the whole specification of HTML was the program that read the tags and a one-page list. He had expected people to need an editor; “it turned out that people were quite happy to write HTML by hand”. Then they wrote browsers, and each browser added to the language. Dave Raggett, who wrote HTML+, records that “During 1993 and early 1994, lots of browsers had added their own bits to HTML; the language was becoming ill-defined”. Marc Andreessen brought Mosaic’s IMG tag to the mailing list while the others were still debating how images should go into a page, shipped it as proposed, and it “remains to this day firmly implanted in HTML”. By 1994 an author could not know what HTML was. Dan Connolly’s answer was not to get ahead of the browsers but to catch up with them. He collected the tags in use and wrote “a Document Type Definition for HTML 2, a kind of mathematically precise description of the language”, in SGML’s own terms, and RFC 1866, the IETF’s standard of November 1995, says what it is: it “brings together, clarifies, and formalizes a set of features that roughly corresponds to the capabilities of HTML in common use prior to June 1994”, named 2.0 “to distinguish it from the previous informal specifications”. Netscape, formed in November 1994, meanwhile “began inventing its own HTML tags as it pleased without first openly discussing them with the Web community”, and when the W3C took the pen, HTML 3.2 in January 1997 “took the existing IETF HTML 2 standard and incorporated features from HTML+ and HTML 3”. From the first list to the first standard, HTML was written down after it was in use. On paper it was still an application of SGML.',
      'In 1998 the W3C stopped working on HTML. The HTML Standard’s own history records that “the W3C membership decided to stop evolving HTML and instead begin work on an XML-based equivalent, called XHTML”, and when that was done, on XHTML2, “a new language that was not compatible with the earlier HTML and XHTML languages”. For five years the standard and the web went different ways. XML was taken up for new things like RSS, “rather than as a replacement for existing deployed technologies (like HTML)”, and the pages people wrote stayed HTML. In 2003 the W3C’s own XForms, its XML forms language, “sparked a renewed interest in evolving HTML itself, rather than finding replacements for it”, and a draft extending HTML4’s forms appeared under Opera’s copyright.',
      'In June 2004 the browser makers brought that draft to the W3C’s workshop on web applications and asked for HTML back. Mozilla and Opera’s position paper warned of “a rising threat of single-vendor solutions” and opened its principles with “Backwards compatibility, clear migration path”. The room voted. On extending HTML and CSS the summary records “8 voted Yes. 14 voted No.”, and the W3C “does not intend to put any resources into” it; its history says the proposal “conflicted with the previously chosen direction for the web’s evolution”, so it “voted to continue developing XML-based replacements instead”. Shortly after, Apple, Mozilla and Opera founded the WHATWG, a working group of their own, and took the draft with them. Their method was three principles, and the second is the 1995 habit stated as a rule: “specifications and implementations need to match even if this means changing the specification rather than the implementations”. The W3C came round. It chartered a group to work with them in 2007, and that group’s design principles settle a conflict in one sentence: “In case of conflict, consider users over authors over implementors over specifiers over theoretical purity.” The two split again in 2011, over a finished HTML5 against a standard “continuously updated”, and in 2019 signed for “a single version of HTML going forward”.',
      'HTML5 became a Recommendation on 28 October 2014, and its text admits what the browsers had done since Mosaic. “While the HTML syntax described in this specification bears a close resemblance to SGML and XML, it is a separate language with its own parsing rules”, and “few (if any) web browsers ever implemented true SGML parsing for HTML documents”. The grammar Berners-Lee had borrowed had never been enforced in a browser. The standard now describes the parser the browsers had, and “defines the parsing rules for HTML documents, whether they are syntactically correct or not”, so what a browser does with broken markup stopped being a vendor’s guess. The doctype collapsed to fifteen characters, <!DOCTYPE html>, kept “for legacy reasons”. html.com’s summary of HTML5’s objectives puts semantic markup first, because content is read “in a lot of different contexts — desktops, laptops, tablets, mobile phones, RSS readers”, so a page provides the meaning and lets the presentation adapt. Berners-Lee’s 1991 wish for “a nestable <SECTION>..</SECTION> element” resurfaced as the section element, twenty-three years later.',
      'From 1991 a server had sent the whole page as HTML and a browser had read it, and the document was about to leave the page. In 2013 the single-page application, a page that never reloads, moved the document into the program: the server sent an empty body and a bundle, and until the program ran there was no page. A crawler, a reader mode or a screen reader had nothing to read until the program had run, and the first paint was blank until the script had built it. In 2016 the HTML came first again. Next.js opened as “a small framework for server-rendered universal JavaScript webapps”, and the islands pattern Jason Miller described in 2020 is to “render HTML pages on the server, and inject placeholders or slots around highly dynamic regions”, so that a page is “like a static HTML document that contains multiple separate embedded applications”. Osmani and Miller’s survey says it for the trade: “It’s fine to mostly ship HTML with minimal JavaScript to get an experience interactive.”',
      'I take one rule from that, and the story says why it holds. HTML began as a way for physicists to share documents and grew into what the pages needed by taking in what authors had already done with it. Mosaic’s IMG tag shipped as proposed and “remains to this day firmly implanted in HTML”, the browsers’ tags became HTML 3.2, and the 2007 principles made the habit a rule, pave the cowpaths, adopting what is “widely accepted” instead of inventing anew. What that growth produced is a language whose elements carry their meaning with them. html.com’s summary of HTML5’s objectives is semantic markup, the separation of design from content, accessibility and responsiveness, less overlap between the three languages, and rich media without plugins, which is why audio and video have elements of their own. The right element brings its behaviour too, “built-in keyboard accessibility, roles and states” in MDN’s words, and a div brings nothing, which is why the standard calls it an element “of last resort”. So the rule: choose the element that means what the content is, and add the look and the behaviour on top of it. The element already carries the first draft of both, and a reader’s tools, a search engine, a reader mode, a screen reader, read the meaning before anything else arrives. What the rule costs is the case where no element means the thing yet. Then I write the plainest element that does, and say in the page what is missing.'
    ]);
  });

  test.each([
    ['“often, the information has been recorded, it just cannot be found”', 'https://www.w3.org/History/1989/proposal.html'],
    ['“generality and portability are more important than fancy graphics techniques”', 'https://www.w3.org/History/1989/proposal.html'],
    ['“a new system must allow existing systems to be linked together without requiring any central control or coordination”', 'https://www.w3.org/History/1989/proposal.html'],
    ['“completely historical, deriving from the AAP tag set”', 'https://info.cern.ch/hypertext/WWW/MarkUp/Tags.html'],
    ['“SGML (ugh! but standard)”', 'https://www.w3.org/People/Berners-Lee/1991/08/art-6484.txt'],
    ['“Nodes do not need to be on the same machine: links may point across machine boundaries.”', 'https://www.w3.org/History/19921103-hypertext/hypertext/WWW/Proposal.html'],
    ['“to allow links to be made to any information anywhere”', 'https://www.w3.org/People/Berners-Lee/1991/08/art-6484.txt'],
    ['“has nothing to know about other servers or other webs and can be kept simple”', 'https://www.w3.org/History/19921103-hypertext/hypertext/WWW/Proposal.html'],
    ['“making a web is as simple as writing a few SGML files which point to your existing data”', 'https://www.w3.org/People/Berners-Lee/1991/08/art-6487.txt'],
    ['“it turned out that people were quite happy to write HTML by hand”', 'https://worldwideweb.cern.ch/worldwideweb/'],
    ['“During 1993 and early 1994, lots of browsers had added their own bits to HTML; the language was becoming ill-defined”', 'https://www.w3.org/People/Raggett/book4/ch02.html'],
    ['“remains to this day firmly implanted in HTML”', 'https://www.w3.org/People/Raggett/book4/ch02.html'],
    ['“a Document Type Definition for HTML 2, a kind of mathematically precise description of the language”', 'https://www.w3.org/People/Raggett/book4/ch02.html'],
    ['“brings together, clarifies, and formalizes a set of features that roughly corresponds to the capabilities of HTML in common use prior to June 1994”', 'https://www.rfc-editor.org/rfc/rfc1866'],
    ['“to distinguish it from the previous informal specifications”', 'https://www.rfc-editor.org/rfc/rfc1866'],
    ['“began inventing its own HTML tags as it pleased without first openly discussing them with the Web community”', 'https://www.w3.org/People/Raggett/book4/ch02.html'],
    ['“took the existing IETF HTML 2 standard and incorporated features from HTML+ and HTML 3”', 'https://www.w3.org/People/Raggett/book4/ch02.html'],
    ['“the W3C membership decided to stop evolving HTML and instead begin work on an XML-based equivalent, called XHTML”', 'https://html.spec.whatwg.org/multipage/introduction.html'],
    ['“a new language that was not compatible with the earlier HTML and XHTML languages”', 'https://html.spec.whatwg.org/multipage/introduction.html'],
    ['“rather than as a replacement for existing deployed technologies (like HTML)”', 'https://html.spec.whatwg.org/multipage/introduction.html'],
    ['“sparked a renewed interest in evolving HTML itself, rather than finding replacements for it”', 'https://html.spec.whatwg.org/multipage/introduction.html'],
    ['“a rising threat of single-vendor solutions”', 'https://whatwg.org/position-paper'],
    ['“Backwards compatibility, clear migration path”', 'https://whatwg.org/position-paper'],
    ['“8 voted Yes. 14 voted No.”', 'https://www.w3.org/2004/04/webapps-cdf-ws/summary'],
    ['“does not intend to put any resources into”', 'https://www.w3.org/2004/04/webapps-cdf-ws/summary'],
    ['“conflicted with the previously chosen direction for the web’s evolution”', 'https://html.spec.whatwg.org/multipage/introduction.html'],
    ['“voted to continue developing XML-based replacements instead”', 'https://html.spec.whatwg.org/multipage/introduction.html'],
    ['“specifications and implementations need to match even if this means changing the specification rather than the implementations”', 'https://html.spec.whatwg.org/multipage/introduction.html'],
    ['“In case of conflict, consider users over authors over implementors over specifiers over theoretical purity.”', 'https://www.w3.org/TR/html-design-principles/'],
    ['“continuously updated”', 'https://whatwg.org/faq'],
    ['“a single version of HTML going forward”', 'https://html.spec.whatwg.org/multipage/introduction.html'],
    ['“While the HTML syntax described in this specification bears a close resemblance to SGML and XML, it is a separate language with its own parsing rules”', 'https://html.spec.whatwg.org/multipage/parsing.html'],
    ['“few (if any) web browsers ever implemented true SGML parsing for HTML documents”', 'https://html.spec.whatwg.org/multipage/parsing.html'],
    ['“defines the parsing rules for HTML documents, whether they are syntactically correct or not”', 'https://html.spec.whatwg.org/multipage/parsing.html'],
    ['“for legacy reasons”', 'https://html.spec.whatwg.org/multipage/syntax.html'],
    ['“in a lot of different contexts — desktops, laptops, tablets, mobile phones, RSS readers”', 'https://html.com/html5/'],
    ['“a nestable <SECTION>..</SECTION> element”', 'https://www.infoq.com/news/2011/05/html5-design/'],
    ['“a small framework for server-rendered universal JavaScript webapps”', 'https://vercel.com/blog/next'],
    ['“render HTML pages on the server, and inject placeholders or slots around highly dynamic regions”', 'https://jasonformat.com/islands-architecture/'],
    ['“like a static HTML document that contains multiple separate embedded applications”', 'https://jasonformat.com/islands-architecture/'],
    ['“It’s fine to mostly ship HTML with minimal JavaScript to get an experience interactive.”', 'https://web.dev/rendering-on-the-web/'],
    ['“widely accepted”', 'https://www.infoq.com/news/2011/05/html5-design/'],
    ['“built-in keyboard accessibility, roles and states”', 'https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA'],
    ['“of last resort”', 'https://html.spec.whatwg.org/multipage/grouping-content.html#the-div-element']
  ])('should link the quotation %s to the page it was taken from', (quoted, page) => {
    homePage.quotations('Structure', quoted).forEach(link => expect(link).toHaveAttribute('href', page));
  });
});
