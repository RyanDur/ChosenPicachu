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
    expect(homePage.paragraph(/^Each language is one concern below/)).toHaveTextContent('Each language is one concern below: what it is for, what the record taught it, and the moments where that happened. How I organize each one is on the Practice page, one tab for each. The record tells how the web got the three languages, in twenty moments and a closing essay. The demos are where I work the practice: five features built from this site’s own code and explained beside it. Two set the trick we used before the platform could do the job beside what it gives now, and the other three show what the platform does with no library at all.');
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

  test('should leave how I organize each language to the Practice page', () => {
    expect(homePage.practiceHeading()).not.toBeInTheDocument();
    expect(homePage.practiceRegion()).not.toBeInTheDocument();
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
    expect(homePage.momentLines(section)).toEqual(lines);
  });

  test('should send a moment\'s line straight to that moment on the record', () => {
    expect(homePage.momentLine('Presentation', '1994 Authors need control of the look')).toHaveAttribute('href', `${Paths.record}#authors-need-control-of-the-look`);
    expect(homePage.momentLine('Structure', '1995 The browsers’ tags need a standard')).toHaveAttribute('href', `${Paths.record}#the-browsers-tags-need-a-standard`);
  });

  test.each(['Structure', 'Presentation', 'Dynamic'])('should set %s\'s moments after its essay, and end them with the whole record', section => {
    expect(homePage.momentsHeading(section)).toBeVisible();
    expect(homePage.wholeRecord(section)).toHaveAttribute('href', Paths.record);
    expect(outOfReadingOrder([
      homePage.essayOpening(section),
      homePage.momentList(section),
      homePage.wholeRecord(section)
    ])).toEqual([]);
  });

  test.each(['Structure', 'Presentation', 'Dynamic'])('should name %s\'s moments as a region of their own', section => {
    expect(homePage.moments(section)).toBeVisible();
  });

  test('should send the Dynamic quotation\'s source to the Internet Archive\'s copy of Eich\'s interview, the live page being gone', () => {
    expect(homePage.quotationSource('Dynamic')).toHaveAttribute('href', 'https://web.archive.org/web/20191215100745/https://www.computerworld.com/article/3458282/the-a-z-of-programming-languages-javascript.html');
  });
});

describe('the home page’s Structure essay', () => {
  beforeEach(async () => {
    render(<TestApp at={Paths.home}/>);
    await homePage.arrived();
  });

  test('should read as the words give it, 8 paragraphs, paragraph for paragraph', () => {
    expect(homePage.essay('Structure')).toEqual([
      'In March 1989 Tim Berners-Lee had a problem to solve at CERN, and a language was the smallest part of it. Several thousand people, spread across institutes and experiments and staying about two years each, could not find what the last ones had written down; “often, the information has been recorded, it just cannot be found”. His proposal asked for a system in which “generality and portability are more important than fancy graphics techniques”, and set one requirement above the rest: “a new system must allow existing systems to be linked together without requiring any central control or coordination”. So when he came to write the markup the next year, he did not design it. He took the tags from CERN’s SGML guide so that the documents world would recognise them, and the page that keeps the list says the headings’ definition is “completely historical, deriving from the AAP tag set”. He did not like the grammar, and said so in a parenthesis, “SGML (ugh! but standard)”. Standard counted for more than taste.',
      'One tag was his own. Links inside a document were already for sale, and the 1990 proposal he wrote with Robert Cailliau budgets licences for two commercial hypertext systems. What those systems could not do fits in one line of that proposal: “Nodes do not need to be on the same machine: links may point across machine boundaries.” The anchor carried an address, with the access method, the machine and the path inside it, so a browser could fetch the page from wherever it lived, and the project could aim “to allow links to be made to any information anywhere”. Each server served its own documents and nothing more; the proposal says it “has nothing to know about other servers or other webs and can be kept simple”. That was the 1989 requirement made into markup. Nobody kept an index. A web was pages pointing at pages, and “making a web is as simple as writing a few SGML files which point to your existing data”. The first anchor even carried a TYPE for the relationship a link describes, the job rel does today.',
      'In August 1991 he posted the project to a newsgroup, and the whole specification of HTML was the program that read the tags and a one-page list. He had expected people to need an editor; “it turned out that people were quite happy to write HTML by hand”. Then they wrote browsers, and each browser added to the language. Dave Raggett, who wrote HTML+, records that “During 1993 and early 1994, lots of browsers had added their own bits to HTML; the language was becoming ill-defined”. Marc Andreessen brought Mosaic’s IMG tag to the mailing list while the others were still debating how images should go into a page, shipped it as proposed, and it “remains to this day firmly implanted in HTML”. By 1994 an author could not know what HTML was. Dan Connolly’s answer was not to get ahead of the browsers but to catch up with them. He collected the tags in use and wrote “a Document Type Definition for HTML 2, a kind of mathematically precise description of the language”, in SGML’s own terms, and RFC 1866, the IETF’s standard of November 1995, says what it is: it “brings together, clarifies, and formalizes a set of features that roughly corresponds to the capabilities of HTML in common use prior to June 1994”, named 2.0 “to distinguish it from the previous informal specifications”. Netscape, formed in November 1994, meanwhile “began inventing its own HTML tags as it pleased without first openly discussing them with the Web community”, and when the W3C took the pen, HTML 3.2 in January 1997 “took the existing IETF HTML 2 standard and incorporated features from HTML+ and HTML 3”. From the first list to the first standard, HTML was written down after it was in use. On paper it was still an application of SGML.',
      'In 1998 the W3C stopped working on HTML. The HTML Standard’s own history records that “the W3C membership decided to stop evolving HTML and instead begin work on an XML-based equivalent, called XHTML”, and when that was done, on XHTML2, “a new language that was not compatible with the earlier HTML and XHTML languages”. For five years the standard and the web went different ways. XML was taken up for new things like RSS, “rather than as a replacement for existing deployed technologies (like HTML)”, and the pages people wrote stayed HTML. In 2003 the W3C’s own XForms, its XML forms language, “sparked a renewed interest in evolving HTML itself, rather than finding replacements for it”, and a draft extending HTML4’s forms appeared under Opera’s copyright.',
      'In June 2004 the browser makers brought that draft to the W3C’s workshop on web applications and asked for HTML back. Mozilla and Opera’s position paper warned of “a rising threat of single-vendor solutions” and opened its principles with “Backwards compatibility, clear migration path”. The room voted. On extending HTML and CSS the summary records “8 voted Yes. 14 voted No.”, and the W3C “does not intend to put any resources into” it; the HTML Standard’s history says the proposal “conflicted with the previously chosen direction for the web’s evolution”, so it “voted to continue developing XML-based replacements instead”. Shortly after, Apple, Mozilla and Opera founded the WHATWG, a working group of their own, and took the draft with them. Their method was three principles, and the second is the habit of 1994 stated as a rule: “specifications and implementations need to match even if this means changing the specification rather than the implementations”. The W3C came round. It chartered a group to work with them in 2007, and that group’s design principles settle a conflict in one sentence: “In case of conflict, consider users over authors over implementors over specifiers over theoretical purity.” The two split again in 2011, over a finished HTML5 against a standard “continuously updated”, and in 2019 signed for “a single version of HTML going forward”.',
      'HTML5 became a Recommendation on 28 October 2014, and the HTML Standard states the break with SGML that the browsers had made since Mosaic. “While the HTML syntax described in this specification bears a close resemblance to SGML and XML, it is a separate language with its own parsing rules”, and “few (if any) web browsers ever implemented true SGML parsing for HTML documents”. The grammar Berners-Lee had borrowed had, on the Standard’s own account, few browsers if any enforcing it. The standard now describes the parser the browsers had, and “defines the parsing rules for HTML documents, whether they are syntactically correct or not”, so what a browser does with broken markup stopped being a vendor’s guess. The doctype collapsed to fifteen characters, <!DOCTYPE html>, kept “for legacy reasons”. html.com’s summary of HTML5’s objectives puts semantic markup first, because content is read “in a lot of different contexts — desktops, laptops, tablets, mobile phones, RSS readers”, so a page provides the meaning and lets the presentation adapt. Berners-Lee’s 1991 wish for “a nestable <SECTION>..</SECTION> element” resurfaced as the section element, twenty-three years later.',
      'From 1991 a server had sent the whole page as HTML and a browser had read it, and the document was about to leave the page. From 2010 the single-page application, a page that never reloads, moved the document into the program, and by 2013 the server sent an empty body and a bundle, and until the program ran there was no page. A crawler, a reader mode or a screen reader had nothing to read until the program had run, and the first paint was blank until the script had built it. In 2016 the HTML came first again. Next.js opened as “a small framework for server-rendered universal JavaScript webapps”, and the islands pattern Jason Miller described in 2020 is to “render HTML pages on the server, and inject placeholders or slots around highly dynamic regions”, so that a page is “like a static HTML document that contains multiple separate embedded applications”. Osmani and Miller’s survey says it for the trade: “It’s fine to mostly ship HTML with minimal JavaScript to get an experience interactive.”',
      'I take one rule from that, and the story says why it holds. HTML began as a way for physicists to share documents and grew into what the pages needed by taking in what authors had already done with it. Mosaic’s IMG tag shipped as proposed and “remains to this day firmly implanted in HTML”, the browsers’ tags became HTML 3.2, the browser makers’ 2004 principle made the habit a rule, and the 2007 principles named it, pave the cowpaths, which Jeremy Keith glosses as adopting what is “widely accepted” instead of inventing anew. What that growth produced is a language whose elements carry their meaning with them. html.com’s summary of HTML5’s objectives is semantic markup, the separation of design from content, accessibility and responsiveness, less overlap between the three languages, and rich media without plugins, which is why audio and video have elements of their own. The right element brings its behaviour too, “built-in keyboard accessibility, roles and states” in MDN’s words, and a div brings nothing, which is why the standard calls it an element “of last resort”. So the rule: choose the element that means what the content is, and add the look and the behaviour on top of it. The element already carries the first draft of both, and a reader’s tools, a search engine, a reader mode, a screen reader, read the meaning before anything else arrives. What the rule costs is the case where no element means the thing yet. Then I write the plainest element that does, and say in the page what is missing.'
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

describe('the home page’s Presentation essay', () => {
  beforeEach(async () => {
    render(<TestApp at={Paths.home}/>);
    await homePage.arrived();
  });

  test('should read as the words give it, 8 paragraphs, paragraph for paragraph', () => {
    expect(homePage.essay('Presentation')).toEqual([
      'In February 1994 Paul Wain of Brunel University asked the www-talk list why Mosaic put a blank line in his nested menus when Lynx did not, and whether there was anything he could do about it. Marc Andreessen, one of Mosaic’s programmers, told him it was “a rendering choice made by the browser”, mocked “the ‘ha ha, you can’t control what your documents look like in HTML’ philosophy”, and answered the question: “What can you do about it? Probably nothing.” Then he named the pressure behind it, the “hordes (literally) of people” who wanted to control what their documents looked like “in ways that would be trivial in TeX, Microsoft Word, and every other common text processing environment”, and signed off: “Sorry, you’re screwed.” HTML said what a thing was and nothing about how it looked, and the authors arriving by the thousand wanted the second as much as the first.',
      'The browsers gave them the look as tags, because tags were what a browser could ship by itself. Three days after Håkon Wium Lie published his style sheet draft, Andreessen announced the first beta of Mozilla, which became Netscape Navigator, and its answer to the same authors was new elements, center among them, “and more tags were to follow shortly”. Netscape, Jay Hoffmann writes, “simply extended HTML to include presentational, unstandardized HTML tags that could be used to design web pages”, and “it wasn’t long before web pages lost all semantic value”. FONT made it into HTML 3.2 itself in January 1997. Where the tags ran out, designers “leaned on HTML data tables (or spacer gifs), which allowed them to lay things out to exact dimensions”. Hoffmann’s verdict on the era is that “at one time, not using CSS was actually a best practice.”',
      'Lie had published the draft on 10 October 1994 because Dave Raggett, then writing HTML 3.0, “had realized that HTML would and should never turn into a page description language and that a more purpose-built mechanism was needed to satisfy requirements from authors”. The draft gave authors “stylistic influence without resorting to page description languages”, and settled the fight Andreessen had named in one line: “if conflicts arise the user should have the last word, but one should also allow the author to attach style hints”. Bert Bos answered it from Argo, a browser he was building for scholars, and the two joined forces. Lie and Bos name the one thing that set their language apart from the other proposals of those years: on the web the look of a document could not be set by the author or the reader alone, so their wishes, and what the device and the browser could do, had to be “combined, or ‘cascaded,’ in some way”. CSS1 became a Recommendation on 17 December 1996, and the settlement is the first thing its abstract states: “authors can attach a preferred style sheet, while the reader may have a personal style sheet”.',
      'Internet Explorer 3 had shipped CSS four months before the Recommendation, with most of the fonts and colours and little of the box model. Netscape “had been sceptical towards style sheets”, and its Navigator 4 ran CSS by “translating CSS rules into snippets of Javascript”, a set of features its developers “did not have time to fully test”; it also let authors write JavaScript Style Sheets, “thereby bypassing CSS entirely”. The standard had fixed the language and not the rendering. The same sheet produced different pages, and in “the chaotic years of mixed browser support, CSS became pretty unpopular among web designers”. So the next decade was the browsers catching up with a document finished in 1996, and the catching up was done by tests. The CSS1 Test Suite grew out of the private suite Eric Meyer had built for his compatibility charts; Tim Boland of NIST went “to the effort of identifying more than five hundred testable statements in the CSS1 specification”; and Todd Fahrner’s box-model acid test told every vendor what passing meant, “All discrepancies should be traceable to CSS1 implementation shortcomings.” None of 1998’s browsers managed it. Tantek Çelik’s doctype switch let a browser keep its old bugs for old pages and render new pages by the book, and his team’s Internet Explorer 5 for the Macintosh, in March 2000, was by Hoffmann’s account “the first browser with full CSS Level 1 support”.',
      'In October 2002 Douglas Bowman relaunched Wired News “using no tables to lay out the page, but instead applying CSS to XHTML”, on a site that “draws between 20 and 25 million page views every month”. He had been one of the table layout’s masters, “nesting them in intricate ways to produce any layout or effect that could be imagined”, and he counted what the separation bought: “A few changes to the CSS can completely alter the presentation of thousands of pages.” He counted the cost too, “as much as 14% of our users” on browsers that would get the unstyled page. Seven months later Dave Shea opened the CSS Zen Garden with one rule, “You may modify the style sheet in any way you wish, but not the HTML.” He had built it because “the widespread perception of CSS was as a language capable only of boxy and boring design”, and hundreds of designers answered with hundreds of designs on one document, which they used, Hoffmann writes, “to show their bosses and clients what CSS could do”. Lie’s 1994 draft had shown the idea as a two-line sheet that mixed the New York Times’ style with Le Monde’s; the garden was that example, industrialised.',
      'The W3C declared CSS 2.1 finished on 7 June 2011, thirteen years after CSS 2, under the headline “Cascading Style Sheets Standard Boasts Unprecedented Interoperability”. The release says why it took so long, “it took many years for implementations and the specification to converge”, and what did the converging: “More than 9000 CSS tests have made it easier for designers to create style sheets that work across browsers, and across devices.” The same day the W3C published a module, Color Level 3, as a Recommendation and said it “expects future additions to CSS to be organized as independent modules, allowing smaller, more focused feature sets to progress and stabilize at their own pace”. CSS1 had been declared finished while no browser rendered all of it. CSS 2.1 was declared finished with nine thousand tests behind it, and the language has shipped in pieces ever since.',
      'In November 2014, a year after components had arrived in script, Christopher Chedeau’s talk at NationJS catalogued the problems of CSS at Facebook’s scale, and the look followed the structure into the program; his own summary is that it “attempts to show that CSS has fundamental flaws and writing styling in JS solves most of the problem without even trying”. Netscape had run that experiment in Navigator 4, and this time the industry’s weight was behind it. The platform answered the same needs in the sheet. Custom properties took over the theme variables. Shadow DOM gave a component’s styles a boundary, since “the styles defined in the shadow DOM tree are scoped to that tree, so just as page styles don’t affect elements in the shadow DOM, shadow DOM styles don’t affect elements in the rest of the page”. And @scope, which “works across the latest devices and browser versions” since March 2026, is the newest arrival in the same direction.',
      'I take a rule from that too, and the story says why it holds. The look left the markup because tags could not do what authors needed, and every hack since has marked a need the sheet could not yet meet: the tables and spacer gifs of the nineties, the styles written in script after 2014. Each time the platform took the need into the sheet, layout in CSS2, custom properties and @scope for the components, and the hack could go. What the sheet gives that the markup never could is the cascade. The author’s sheet, the reader’s and the browser’s combine, so “authors can attach a preferred style sheet, while the reader may have a personal style sheet”, and one document can be presented “to visual browsers, aural devices, printers, braille devices, handheld devices”. Bowman counted what the separation is worth on a site drawing 20 to 25 million page views a month, “A few changes to the CSS can completely alter the presentation of thousands of pages.”, and found them “dramatically more accessible, without much concentrated effort at making it so”. So the rule: a look belongs in the sheet, named for what the element needs, and nothing in the HTML says how it looks. I write two kinds of sheet, one per component for what only it needs and shared sheets for the words every component wears, so the cascade reaches both. What the rule costs is a look the sheet cannot yet express without a workaround. I keep the workaround beside the rule it stands in for, and take it out when the platform catches up, as it has each time so far.'
    ]);
  });

  test.each([
    ['“a rendering choice made by the browser”', 'http://1997.webhistory.org/www.lists/www-talk.1994q1/0648.html'],
    ['“the ‘ha ha, you can’t control what your documents look like in HTML’ philosophy”', 'http://1997.webhistory.org/www.lists/www-talk.1994q1/0648.html'],
    ['“What can you do about it? Probably nothing.”', 'http://1997.webhistory.org/www.lists/www-talk.1994q1/0648.html'],
    ['“hordes (literally) of people”', 'http://1997.webhistory.org/www.lists/www-talk.1994q1/0648.html'],
    ['“in ways that would be trivial in TeX, Microsoft Word, and every other common text processing environment”', 'http://1997.webhistory.org/www.lists/www-talk.1994q1/0648.html'],
    ['“Sorry, you’re screwed.”', 'http://1997.webhistory.org/www.lists/www-talk.1994q1/0648.html'],
    ['“and more tags were to follow shortly”', 'https://www.w3.org/Style/LieBos2e/history/Overview.html'],
    ['“simply extended HTML to include presentational, unstandardized HTML tags that could be used to design web pages”', 'https://thehistoryoftheweb.com/look-back-history-css/'],
    ['“it wasn’t long before web pages lost all semantic value”', 'https://thehistoryoftheweb.com/look-back-history-css/'],
    ['“leaned on HTML data tables (or spacer gifs), which allowed them to lay things out to exact dimensions”', 'https://thehistoryoftheweb.com/the-rise-of-css/'],
    ['“at one time, not using CSS was actually a best practice.”', 'https://thehistoryoftheweb.com/the-rise-of-css/'],
    ['“had realized that HTML would and should never turn into a page description language and that a more purpose-built mechanism was needed to satisfy requirements from authors”', 'https://www.w3.org/Style/LieBos2e/history/Overview.html'],
    ['“stylistic influence without resorting to page description languages”', 'https://www.w3.org/People/howcome/p/cascade.html'],
    ['“if conflicts arise the user should have the last word, but one should also allow the author to attach style hints”', 'https://www.w3.org/People/howcome/p/cascade.html'],
    ['“combined, or ‘cascaded,’ in some way”', 'https://www.w3.org/Style/LieBos2e/history/Overview.html'],
    ['“authors can attach a preferred style sheet, while the reader may have a personal style sheet”', 'https://www.w3.org/TR/REC-CSS1-961217'],
    ['“had been sceptical towards style sheets”', 'https://www.w3.org/Style/LieBos2e/history/Overview.html'],
    ['“translating CSS rules into snippets of Javascript”', 'https://www.w3.org/Style/LieBos2e/history/Overview.html'],
    ['“did not have time to fully test”', 'https://www.w3.org/Style/LieBos2e/history/Overview.html'],
    ['“thereby bypassing CSS entirely”', 'https://www.w3.org/Style/LieBos2e/history/Overview.html'],
    ['“the chaotic years of mixed browser support, CSS became pretty unpopular among web designers”', 'https://thehistoryoftheweb.com/the-rise-of-css/'],
    ['“to the effort of identifying more than five hundred testable statements in the CSS1 specification”', 'https://www.w3.org/Style/CSS/Test/CSS1/current/tsack.html'],
    ['“All discrepancies should be traceable to CSS1 implementation shortcomings.”', 'https://www.w3.org/Style/CSS/Test/CSS1/current/test5526c.htm'],
    ['“the first browser with full CSS Level 1 support”', 'https://thehistoryoftheweb.com/look-back-history-css/'],
    ['“using no tables to lay out the page, but instead applying CSS to XHTML”', 'https://meyerweb.com/eric/thoughts/2002/10/11/wired-with-standards/'],
    ['“draws between 20 and 25 million page views every month”', 'https://web.archive.org/web/2003/http://devedge.netscape.com/viewsource/2002/wired-interview/'],
    ['“nesting them in intricate ways to produce any layout or effect that could be imagined”', 'https://web.archive.org/web/2003/http://devedge.netscape.com/viewsource/2002/wired-interview/'],
    ['“A few changes to the CSS can completely alter the presentation of thousands of pages.”', 'https://web.archive.org/web/2003/http://devedge.netscape.com/viewsource/2002/wired-interview/'],
    ['“as much as 14% of our users”', 'https://web.archive.org/web/2003/http://devedge.netscape.com/viewsource/2002/wired-interview/'],
    ['“You may modify the style sheet in any way you wish, but not the HTML.”', 'https://csszengarden.com/'],
    ['“the widespread perception of CSS was as a language capable only of boxy and boring design”', 'https://csszengarden.com/pages/about/'],
    ['“to show their bosses and clients what CSS could do”', 'https://thehistoryoftheweb.com/the-rise-of-css/'],
    ['“Cascading Style Sheets Standard Boasts Unprecedented Interoperability”', 'https://www.w3.org/2011/05/css-pr.html.en'],
    ['“it took many years for implementations and the specification to converge”', 'https://www.w3.org/2011/05/css-pr.html.en'],
    ['“More than 9000 CSS tests have made it easier for designers to create style sheets that work across browsers, and across devices.”', 'https://www.w3.org/2011/05/css-pr.html.en'],
    ['“expects future additions to CSS to be organized as independent modules, allowing smaller, more focused feature sets to progress and stabilize at their own pace”', 'https://www.w3.org/2011/05/css-pr.html.en'],
    ['“attempts to show that CSS has fundamental flaws and writing styling in JS solves most of the problem without even trying”', 'https://blog.vjeux.com/2014/javascript/react-css-in-js-nationjs.html'],
    ['“the styles defined in the shadow DOM tree are scoped to that tree, so just as page styles don’t affect elements in the shadow DOM, shadow DOM styles don’t affect elements in the rest of the page”', 'https://developer.mozilla.org/en-US/docs/Web/API/Web_components/Using_shadow_DOM'],
    ['“works across the latest devices and browser versions”', 'https://developer.mozilla.org/en-US/docs/Web/CSS/@scope'],
    ['“to visual browsers, aural devices, printers, braille devices, handheld devices”', 'https://www.w3.org/TR/1998/REC-CSS2-19980512/'],
    ['“dramatically more accessible, without much concentrated effort at making it so”', 'https://web.archive.org/web/2003/http://devedge.netscape.com/viewsource/2002/wired-interview/']
  ])('should link the quotation %s to the page it was taken from', (quoted, page) => {
    homePage.quotations('Presentation', quoted).forEach(link => expect(link).toHaveAttribute('href', page));
  });
});

describe('the home page’s Dynamic essay', () => {
  beforeEach(async () => {
    render(<TestApp at={Paths.home}/>);
    await homePage.arrived();
  });

  test('should read as the words give it, 7 paragraphs, paragraph for paragraph', () => {
    expect(homePage.essay('Dynamic')).toEqual([
      'In April 1995 Brendan Eich joined Netscape to put a programming language in the browser, and in about ten days of May he wrote the interpreter. The need, in his words, was that “the lack of programmability of Web pages made them static, text-heavy, with at best images in tables or floating on the right or left”. Netscape had two audiences in mind, component authors writing Java and the scripters, “amateur or pro, who would write code directly embedded in HTML”, and the language was for the second, a “glue language” for “the Web designers and part time programmers who were building Web content from components such as images, plugins, and Java applets”. You could, he said, “buy it by the yard”. The script could touch the page the server had sent, change its properties and respond to events. Some early adopters, “even in late 1995”, built applications from script and frames, but “the means to communicate with servers generally involved reloading whole Web pages”.',
      'Microsoft answered in August 1996 with JScript in Internet Explorer 3, the two dialects differed, and “These differences made it difficult for developers to make their websites work well in both browsers”. So “In November 1996, Netscape submitted JavaScript to Ecma International, as the starting point for a standard specification that all browser vendors could conform to”, and Ecma adopted the first edition of ECMA-262 in June 1997. Eich’s own reading is that the browser war “forced premature standardization after a furious period of innovation”. The standard “codifies just the core language, not the DOM”, the DOM being the objects a script uses to reach the page, so those stayed each browser’s own. The third edition, in December 1999, became the JavaScript the web ran on for a decade, “the programming language that is supported by essentially all web browsers”, and then the standard stood still.',
      'In February 2005 Jesse James Garrett wrote down what the pages Google had just shipped were doing. Desktop applications “have a richness and responsiveness that has seemed out of reach on the Web”, because in the classic model most actions send a request to the server and “the user waits some more”. The new pages put an engine in the page instead, with “JavaScript binding everything together”, and he named the pattern Ajax. He claimed practicality, not invention, “Neither Adaptive Path nor Google invented Ajax”: the object behind it had shipped in Internet Explorer 5 in 1999, and what was new was “the prominent use of these techniques in real-world applications to change the fundamental interaction model of the Web”. The browsers still differed in the objects a script used to reach the page, so libraries came before frameworks to hide the differences: Prototype in 2005, which “smooths over the rough edges of cross-browser development”, and jQuery in 2006, “an easy-to-use API that works across a multitude of browsers”. Eich’s summary of the era: “JS was the tap root.”',
      'Then the frameworks came to organise what the script was building, and each moved more of the page into it. AngularJS said in 2010 that HTML “falters when we try to use it for declaring dynamic views in web-applications”, and answered with “two-way data-binding that allowed for the automatic synchronization of models and views”: change the data and the page changes, change the page and the data changes. A framework is a program that owns the page’s structure and calls your code, the reverse of a library, which your code calls. React said in 2013 that what a component’s render returns is “a lightweight description of what the DOM should look like”, and redrew the page from it. By then the single-page application, a page that never reloads, had moved the whole document into the program, and the frameworks rebuilt the document’s own habits by hand: links as components, the back button as state, routers and scroll managers for what the browser had shipped for twenty years. As the applications grew, Osmani and Miller’s survey of rendering for Chrome put the cost in one line: “the amount of JavaScript required tends to grow as an application grows.”',
      'The language’s committee then spent years on a fourth edition too large to agree on, and by 2008 it had been split for over a year. That August Eich wrote to its list that “A split committee is good for no one and nothing, least of all any language specs that might come out of it”, and it agreed to “target two interoperable implementations by early next year”. The fifth edition came in December 2009 and the sixth, with classes and modules, in June 2015, and since then an edition has shipped every year, admitting a feature only with “Two compatible implementations which pass the Test262 acceptance tests”. The language that had been standardised too early now moves only on what two engines have already proved.',
      'In October 2016 Next.js opened as “a small framework for server-rendered universal JavaScript webapps”, and the program went second again: rendering on the server, SSR for short, sent the markup, and hydration attached the listeners to it afterwards. Islands, which Jason Miller documented in 2020 and credits to Etsy’s Katie Sylor-Miller, “render HTML pages on the server, and inject placeholders or slots around highly dynamic regions”, so that “individual regions of the page become interactive without anything else on the page needing to be loaded first”, and React’s server components, announced in December 2020 and stable in Next.js by May 2023, moved rendering back across the wire. The regions that must respond keep their script, and Miller says what the pattern returns to: progressive enhancement, “to which we’re essentially adding SSR hydration”. The survey’s authors “encourage developers to consider server-side rendering or static rendering over a full rehydration approach”.',
      'I take one rule from that, and the story says why it holds. Script was built to touch a page that already existed, and every time it was asked to be the page instead, the cost arrived with the growth: blank first paints, a document no crawler could read, the back button rebuilt by hand. The platform then took in what the scripts had proved, XMLHttpRequest into every browser, custom elements into the Standard, and the language’s own committee learned to move only on two implementations. So the document comes first and the program only where the page needs one, and the survey says it plainly: “It’s fine to mostly ship HTML with minimal JavaScript to get an experience interactive.” Inside the program, the state is what is true right now, an event is what just happened, and the page is drawn from the two, so a framework can change under it and the core stays. The rule costs two ways of rendering the same page, and the line between them has to stay where I can see it, which is why the tables here are built twice, once in plain HTML, CSS and JavaScript and once in React on the same three.'
    ]);
  });

  test.each([
    ['“the lack of programmability of Web pages made them static, text-heavy, with at best images in tables or floating on the right or left”', 'https://web.archive.org/web/20191215100745/https://www.computerworld.com/article/3458282/the-a-z-of-programming-languages-javascript.html'],
    ['“amateur or pro, who would write code directly embedded in HTML”', 'https://brendaneich.com/2008/04/popularity/'],
    ['“glue language”', 'https://web.archive.org/web/20191215100745/https://www.computerworld.com/article/3458282/the-a-z-of-programming-languages-javascript.html'],
    ['“the Web designers and part time programmers who were building Web content from components such as images, plugins, and Java applets”', 'https://web.archive.org/web/20191215100745/https://www.computerworld.com/article/3458282/the-a-z-of-programming-languages-javascript.html'],
    ['“buy it by the yard”', 'https://www.infoworld.com/article/2653798/javascript-creator-ponders-past--future.html'],
    ['“even in late 1995”', 'https://web.archive.org/web/20191215100745/https://www.computerworld.com/article/3458282/the-a-z-of-programming-languages-javascript.html'],
    ['“the means to communicate with servers generally involved reloading whole Web pages”', 'https://web.archive.org/web/20191215100745/https://www.computerworld.com/article/3458282/the-a-z-of-programming-languages-javascript.html'],
    ['“These differences made it difficult for developers to make their websites work well in both browsers”', 'https://en.wikipedia.org/wiki/JavaScript'],
    ['“In November 1996, Netscape submitted JavaScript to Ecma International, as the starting point for a standard specification that all browser vendors could conform to”', 'https://en.wikipedia.org/wiki/JavaScript'],
    ['“forced premature standardization after a furious period of innovation”', 'https://web.archive.org/web/20191215100745/https://www.computerworld.com/article/3458282/the-a-z-of-programming-languages-javascript.html'],
    ['“codifies just the core language, not the DOM”', 'https://web.archive.org/web/20191215100745/https://www.computerworld.com/article/3458282/the-a-z-of-programming-languages-javascript.html'],
    ['“the programming language that is supported by essentially all web browsers”', 'https://262.ecma-international.org/5.1/'],
    ['“have a richness and responsiveness that has seemed out of reach on the Web”', 'https://web.archive.org/web/20071002213206/http://www.adaptivepath.com/ideas/essays/archives/000385.php'],
    ['“the user waits some more”', 'https://web.archive.org/web/20071002213206/http://www.adaptivepath.com/ideas/essays/archives/000385.php'],
    ['“JavaScript binding everything together”', 'https://web.archive.org/web/20071002213206/http://www.adaptivepath.com/ideas/essays/archives/000385.php'],
    ['“Neither Adaptive Path nor Google invented Ajax”', 'https://web.archive.org/web/20071002213206/http://www.adaptivepath.com/ideas/essays/archives/000385.php'],
    ['“the prominent use of these techniques in real-world applications to change the fundamental interaction model of the Web”', 'https://web.archive.org/web/20071002213206/http://www.adaptivepath.com/ideas/essays/archives/000385.php'],
    ['“smooths over the rough edges of cross-browser development”', 'http://prototypejs.org/'],
    ['“an easy-to-use API that works across a multitude of browsers”', 'https://jquery.com/'],
    ['“JS was the tap root.”', 'https://web.archive.org/web/20191215100745/https://www.computerworld.com/article/3458282/the-a-z-of-programming-languages-javascript.html'],
    ['“falters when we try to use it for declaring dynamic views in web-applications”', 'https://angularjs.org/'],
    ['“two-way data-binding that allowed for the automatic synchronization of models and views”', 'https://en.wikipedia.org/wiki/AngularJS'],
    ['“a lightweight description of what the DOM should look like”', 'https://legacy.reactjs.org/blog/2013/06/05/why-react.html'],
    ['“the amount of JavaScript required tends to grow as an application grows.”', 'https://web.dev/rendering-on-the-web/'],
    ['“A split committee is good for no one and nothing, least of all any language specs that might come out of it”', 'https://web.archive.org/web/2015/https://mail.mozilla.org/pipermail/es-discuss/2008-August/006837.html'],
    ['“target two interoperable implementations by early next year”', 'https://web.archive.org/web/2015/https://mail.mozilla.org/pipermail/es-discuss/2008-August/006837.html'],
    ['“Two compatible implementations which pass the Test262 acceptance tests”', 'https://tc39.es/process-document/'],
    ['“a small framework for server-rendered universal JavaScript webapps”', 'https://vercel.com/blog/next'],
    ['“render HTML pages on the server, and inject placeholders or slots around highly dynamic regions”', 'https://jasonformat.com/islands-architecture/'],
    ['“individual regions of the page become interactive without anything else on the page needing to be loaded first”', 'https://jasonformat.com/islands-architecture/'],
    ['“to which we’re essentially adding SSR hydration”', 'https://jasonformat.com/islands-architecture/'],
    ['“encourage developers to consider server-side rendering or static rendering over a full rehydration approach”', 'https://web.dev/rendering-on-the-web/'],
    ['“It’s fine to mostly ship HTML with minimal JavaScript to get an experience interactive.”', 'https://web.dev/rendering-on-the-web/']
  ])('should link the quotation %s to the page it was taken from', (quoted, page) => {
    homePage.quotations('Dynamic', quoted).forEach(link => expect(link).toHaveAttribute('href', page));
  });
});
