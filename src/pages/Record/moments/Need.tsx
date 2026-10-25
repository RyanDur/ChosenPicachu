import {FC} from 'react';
import {Moment} from './Moment';
import {moments} from './moments';

const proposal = 'https://www.w3.org/History/1989/proposal.html';

export const Need: FC = () =>
  <Moment of={moments.need}
    tells={<>Several thousand people at CERN, two-year stays, and what one project learned{' '}
      <a className="signpost" href={proposal}>“sometimes lost forever, or only recovered after a detective
        investigation in an emergency”</a>. Tim Berners-Lee{' '}
      <a className="signpost" href={proposal}>proposed a web of notes with links between them</a>, shaped like
      the organization that would use it.</>}>
    <p className="paragraph muted-ink hyphenated">Berners-Lee wrote the proposal in March 1989 to answer a practical
      question: how several thousand people at CERN, spread across institutes and experiments and staying about two
      years each, could share what they knew. Knowledge moved by corridor talk and newsletters, which worked until
      people left; <a className="signpost" href={proposal}>“often, the information has been recorded, it just cannot be
        found.”</a> He took CERN as a small model of what every large organization would soon face.</p>
    <p className="paragraph muted-ink hyphenated">He had built the answer once already. In 1980 he wrote Enquire, a
      program that stored notes and linked them to each other in any way, so finding something meant following
      links <a className="signpost" href={proposal}>“rather like in the old computer game ‘adventure’”</a>. He built it
      before he knew the idea had a name, hypertext; the proposal credits Ted Nelson with the word.</p>
    <p className="paragraph muted-ink hyphenated">The argument is against trees. CERNDOC, the Unix file system and VMS HELP each forced knowledge into one hierarchy, and work does not connect that way. His alternative was a diagram anyone could draw, circles and arrows, where <a className="signpost" href={proposal}>“circles and arrows can stand for anything”</a>: a person, a project, a document, a piece of hardware, joined by links that say depends on, is part of, uses, refers to. The first web in the document is the organization itself, <a className="signpost" href={proposal}>“a multiply connected ‘web’”</a>, and the system had to match it. That is what set it apart from CERNDOC, a document system that lived on one central machine, and from every scheme that asked physicists to file their work one prescribed way. He had watched those fail, and wrote later that the rules had to be <a className="signpost" href="https://www.ppd.stfc.ac.uk/news/unravelling-the-web-how-particle-physics-launched-the-invention-that-changed-the-world/">“as close as possible to no rules at all”</a>. The proposal makes it a requirement: systems <a className="signpost" href={proposal}>“start isolated and then merge”</a>, so <a className="signpost" href={proposal}>“a new system must allow existing systems to be linked together without requiring any central control or coordination.”</a></p>
    <p className="paragraph muted-ink hyphenated">Most of the document is requirements, and they are the ones the web kept. Access from remote machines. The same data on VM, Macintosh, VAX and Unix. Existing databases shown as hypertext. Private links a reader can add. Plain text on a 24-by-80 screen before any graphics. And a defined interface between the software that stores and the software that shows, so servers and browsers could be built in parallel. The conclusion asked for a universal linked information system in which <a className="signpost" href={proposal}>“generality and portability are more important than fancy graphics techniques”</a>, and the plan was two people for six to twelve months. Nothing in it was called World Wide Web; Berners-Lee later wrote that the only name he had for it then was Mesh. His manager, Mike Sendall, pencilled on the cover a note quoted ever since: <a className="signpost" href="https://worldwideweb.cern.ch/history/">“Vague, but exciting.”</a></p>
  </Moment>;
