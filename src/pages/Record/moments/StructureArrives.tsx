import {FC} from 'react';
import {Moment} from './Moment';
import {moments} from './moments';

const worldWideWebProposal = 'https://www.w3.org/History/19921103-hypertext/hypertext/WWW/Proposal.html';
const htmlTags = 'https://info.cern.ch/hypertext/WWW/MarkUp/Tags.html';
const httpAsImplemented = 'https://www.w3.org/Protocols/HTTP/AsImplemented.html';
const worldWideWebBrowser = 'https://worldwideweb.cern.ch/worldwideweb/';
const nexusHistory = 'https://worldwideweb.cern.ch/history/';

export const StructureArrives: FC = () =>
  <Moment heading={moments.headings.structureArrives}
    summary={<>In November 1990 Tim Berners-Lee and Robert Cailliau proposed{' '}
      <a className="signpost" href={worldWideWebProposal}>“WorldWideWeb (or W3)”</a>, and Berners-Lee wrote the server and the
      browser. HTML’s tags came from CERN’s guide to SGML, the markup standard publishers and technical writers already
      used, so they would recognize them. The one tag of his own was <a className="signpost" href={htmlTags}>the anchor</a>,
      an idea hypertext already had; the new thing was what his could carry, the address of a document on another
      machine.</>}>
    <p className="paragraph muted-ink hyphenated">The second proposal came in November 1990, twenty months after the
      first, and Robert Cailliau wrote it with him. It names the need from the reader’s side: CERN’s information sat in
      systems that could not read each other, and <a className="signpost" href={worldWideWebProposal}>“the current incompatibilities
        of the platforms and tools make it impossible to access existing information through a common interface”</a>.
      The answer was hypertext, defined in the sentence this page opens with, and a scheme in which the stores CERN
      already had, among them its news and file servers, could be read through one browser as one web. The document
      names the project <a className="signpost" href={worldWideWebProposal}>“WorldWideWeb (or W3)”</a>, asks
      for <a className="signpost" href={worldWideWebProposal}>“4 software engineers and a programmer”</a>, and plans two
      phases of three months each. First, browsers for dumb terminals, the Macintosh and the NeXT, with a
      server <a className="signpost" href={worldWideWebProposal}>“which may be installed on any machine to allow files on
        that machine to be accessed as hypertext”</a>. Then editing, at which
      point <a className="signpost" href={worldWideWebProposal}>“authorship becomes universal”</a>. It gives the
      software away <a className="signpost" href={worldWideWebProposal}>“free of charge to anyone”</a>, and lists what
      it will not do, among it <a className="signpost" href={worldWideWebProposal}>“research into fancy multimedia
        facilities such as sound and video”</a>. Neither this proposal nor the 1989 one mentions a
      language running in the page.</p>
    <p className="paragraph muted-ink hyphenated">Links inside a document were already for sale; the proposal budgets
      licenses for Guide and KMS, two commercial hypertext systems. The new thing fits in one line:{' '}
    <a className="signpost" href={worldWideWebProposal}>“Nodes do not need to be on the same machine: links may point across
      machine boundaries.”</a> A link is an address a browser knows how to fetch, so each server serves its own
      documents and nothing more; the proposal says the server{' '}
    <a className="signpost" href={worldWideWebProposal}>“has nothing to know about other servers or other webs and can be kept
      simple”</a>. That is the 1989 requirement, no central control, carried into the design. The anchor as first
      written had three attributes: HREF, NAME, and a TYPE for the relationship a link describes, the job rel does
      today, whose values were to be <a className="signpost" href={htmlTags}>“registered by the W3 team”</a>.</p>
    <p className="paragraph muted-ink hyphenated">The protocol was almost nothing. A client sent{' '}
      <a className="signpost" href={httpAsImplemented}>“a line of ASCII characters terminated by a CR LF”</a>, which{' '}
      <a className="signpost" href={httpAsImplemented}>“consists of the word "GET", a space, the document address”</a>, and the
      server answered with the document;{' '}
      <a className="signpost" href={httpAsImplemented}>“the message is terminated by the closing of the connection by the
        server.”</a> There was no status line, so an error came back as another page; the specification says{' '}
      <a className="signpost" href={httpAsImplemented}>“there is no way to distinguish an error response from a satisfactory response
        except for the content of the text.”</a> The page that preserves it calls this HTTP 0.9.</p>
    <p className="paragraph muted-ink hyphenated">The earliest surviving list of tags is short. It has a title, the
      anchor, the paragraph, six levels of heading, an address, a glossary and three kinds of list, with tags for an
      index node, plain text and example sections, and two more, a base address and highlighting, marked not currently
      used. There is no html, head or body, no img, and no tag for an ordered list. The headings were kept as CERN’s
      SGML guide defined them, and the page says their definition is <a className="signpost" href={htmlTags}>“completely
        historical, deriving from the AAP tag set”</a>. The file keeps the editor’s fingerprint too: a NEXTID
      tag <a className="signpost" href={htmlTags}>“read and generated by hypertext editors”</a>, because the first
      program, WorldWideWeb on a NeXT machine, <a className="signpost" href={worldWideWebBrowser}>“was a browser and
        editor”</a>. Links opened on a double click because <a className="signpost" href={worldWideWebBrowser}>“a single click
          was used for editing”</a>. CERN’s history of the browser says
      it <a className="signpost" href={nexusHistory}>“was later renamed Nexus to avoid confusion with the World
        Wide Web project”</a>. The program’s central expectation
      failed: <a className="signpost" href={worldWideWebBrowser}>“it turned out that people were quite happy to
        write HTML by hand”</a>, something Berners-Lee and his colleagues had not expected.</p>
  </Moment>;
