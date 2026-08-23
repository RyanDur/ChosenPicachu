import {FC} from 'react';

export const Opener: FC = () => <>
  <blockquote className="feedback">
    <p className="quote">
      HyperText is a way to link and access information of various kinds as a web of nodes
      in which the user can browse at will.
    </p>
    <footer className="attribution">Tim Berners-Lee and Robert Cailliau,{' '}
      <a className="signpost" href="https://www.w3.org/History/19921103-hypertext/hypertext/WWW/Proposal.html">proposing
      the WorldWideWeb, 1990</a></footer>
  </blockquote>
  <p className="thesis paragraph">
    Someone needed something: researchers, scattered across institutes, losing each other’s
    documents. Everything on the web is layered onto that one need.
  </p>
  <p className="thesis paragraph">
    A webpage is three languages working in concert. HTML says what things are. CSS says how
    they show. JavaScript says how they respond. They were designed apart, on purpose, by
    people who said so at the time, and every time the web blurred them, it cost something.
    Most of the blurs were walked back; some are still standing. The history below is the
    evidence. The rest of the site is the practice.
  </p>
</>;
