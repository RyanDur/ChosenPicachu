import {FC} from 'react';
import {Moment} from './Moment';
import {moments} from './moments';

export const WebGoesPublic: FC = () =>
  <Moment of={moments.webGoesPublic}
    tells={<>On 6 August 1991 Berners-Lee answered a question on the alt.hypertext newsgroup with the project’s address and
      an invitation. The browser, the editor and the documentation were on info.cern.ch for anyone to fetch. HTML left
      the lab before it had a specification, as a list of tags and a working program.</>}>
    <p className="paragraph muted-ink hyphenated">The post is short. The project, it says, aims <a className="signpost" href="https://www.w3.org/People/Berners-Lee/1991/08/art-6484.txt">“to allow links to be made to any information anywhere”</a>,
      there is a prototype editor for the NeXT and a line-mode browser for everything else, and the code is <a className="signpost" href="https://www.w3.org/People/Berners-Lee/1991/08/art-6484.txt">“available by anonymous FTP from info.cern.ch”</a>.
      It closes with two words: <a className="signpost" href="https://www.w3.org/People/Berners-Lee/1991/08/art-6484.txt">“Collaborators welcome!”</a>.
      A newsgroup is a public discussion board that predates the web; alt.hypertext was the one for people who cared
      about linked documents, and this is the earliest public announcement W3C’s own history lists.</p>
    <p className="paragraph muted-ink hyphenated">In October the project opened its own board: W3C’s history lists the <a className="signpost" href="https://www.w3.org/History.html">www-talk</a> mailing
      list starting that month, and the record of HTML from then on is a record of that list arguing. The tags
      themselves were the <a className="signpost" href="https://info.cern.ch/hypertext/WWW/MarkUp/Tags.html">“Tags used in HTML”</a> document,
      the list the 1990 moment reads, with no specification behind it beyond the program that read it.</p>
    <p className="paragraph muted-ink hyphenated">The public took it up before anyone standardised it. W3C counts <a className="signpost" href="https://www.w3.org/History.html">“Around 50 known HTTP servers”</a> in
      January 1993 and <a className="signpost" href="https://www.w3.org/History.html">“Over 200 known HTTP servers”</a> by
      October, the month after NCSA released <a className="signpost" href="https://www.w3.org/History.html">“working versions of Mosaic browser for all common platforms: X, PC/Windows and Macintosh”</a>.
      Every one of those servers was serving HTML that no standard yet defined; HTML 2.0, in 1995, is the answer to
      that.</p>
  </Moment>;
