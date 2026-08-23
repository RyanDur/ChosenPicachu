import {FC} from 'react';
import {Moment} from './Moment';

export const Need: FC = () =>
  <Moment year="1989"
          title="Someone needs something"
          tells={<>Thousands of researchers at CERN, two-year stays, and the technical details of
            past projects{' '}
            <a className="signpost" href="https://www.w3.org/History/1989/proposal.html">“sometimes lost forever,
            or only recovered after a detective investigation in an emergency”</a>. Tim
            Berners-Lee{' '}
            <a className="signpost" href="https://www.w3.org/History/1989/proposal.html">proposed a web of notes
            with links between them</a>, so what was known could be found.</>}>
            <p className="paragraph">Berners-Lee’s proposal begins by measuring the loss. CERN held several thousand
    creative people, the typical stay was two years, and the knowledge walked out the door
    faster than it could be written down. The sharpest sentence in the document is not
    about technology at all: <a className="signpost" href="https://www.w3.org/History/1989/proposal.html">“often, the information has been recorded, it just cannot be found.”</a></p>
    <p className="paragraph">He had solved this once before, for himself. In 1980 he wrote Enquire, a program
    that stored snippets of information and linked related pieces together in any way, so
    that finding something meant following links <a className="signpost" href="https://www.w3.org/History/1989/proposal.html">“rather like in the old computer game ‘adventure’”</a>.
    He built it, he admits, before he knew the idea already had a name: hypertext.</p>
    <p className="paragraph">The proposal’s argument is against trees. CERNDOC, the Unix file system, VMS/HELP:
    every hierarchy forced knowledge into one shape and could not model how work really
    connected. His alternative was a diagram anyone could draw: circles and arrows, where
    <a className="signpost" href="https://www.w3.org/History/1989/proposal.html">“circles and arrows can stand for anything”</a>: call the circles
    nodes and the arrows links. Tellingly, the first “web” in the document describes the
    people, not the software: the organisation’s real structure was already{' '}
    <a className="signpost" href="https://www.w3.org/History/1989/proposal.html">“a multiply connected ‘web’”</a>; the system just needed to match
    it.</p>
    <p className="paragraph">Nothing in it said World Wide Web; the only name in the air was “Mesh.”
    Berners-Lee’s manager, Mike Sendall, pencilled onto the cover the most quoted margin
    note in computing: <a className="signpost" href="https://worldwideweb.cern.ch/history/">“Vague, but exciting.”</a> The conclusion asked
    for the opposite of excitement: a universal linked information system in which{' '}
    <a className="signpost" href="https://www.w3.org/History/1989/proposal.html">“generality and portability are more important than fancy graphics techniques”</a>.</p>
  </Moment>;
