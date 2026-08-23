import {FC} from 'react';
import {Moment} from './Moment';

export const Html5SaysIt: FC = () =>
  <Moment year="2014"
          title="The philosophy needs writing down"
          tells={<>The specification era restated the philosophy:{' '}
            <a className="signpost" href="https://www.infoq.com/news/2011/05/html5-design/">design principles</a>{' '}
            for how a standard should behave, and stated objectives for the language: semantic
            markup, separation of design from content, and, in one summary’s words,{' '}
            <a className="signpost" href="https://html.com/html5/">reducing the overlap between HTML, CSS, and
              JavaScript</a>.</>}>
    <p className="paragraph">The objectives, as html.com summarizes them: encouraging semantic markup;
      separating design from content; promoting accessibility and responsiveness; reducing
      the overlap between the three languages; and supporting rich media without plugins.
      The reasoning is the 1994 settlement restated for new devices: content is read{' '}
      <a className="signpost" href="https://html.com/html5/">“in a lot of different contexts — desktops, laptops,
        tablets, mobile phones, RSS readers”</a>,
      so provide the meaning and let presentation adapt.</p>
    <p className="paragraph">The W3C’s design principles, as Jeremy Keith presented them, are six: avoid
      needless complexity; support existing content; solve real problems; pave the cowpaths,
      adopting what is{' '}
      <a className="signpost" href="https://www.infoq.com/news/2011/05/html5-design/">“widely accepted”</a> instead of
      inventing anew; degrade
      gracefully; and priority of constituencies, the cascade’s settlement written into the
      constitution:{' '}
      <a className="signpost"
         href="https://www.infoq.com/news/2011/05/html5-design/">“users &gt; authors &gt; implementors &gt; specifiers &gt; theoretical
        purity”</a>.</p>
    <p className="paragraph">And there was a quiet break with the past: HTML5 is no longer an SGML
      application. The specification defines its own parsing, including what a browser must
      do with broken markup, so parsing stopped being a vendor’s guess; the doctype
      collapsed to fifteen characters because its remaining job was triggering standards
      mode. Even Berners-Lee’s 1991 wish for{' '}
      <a className="signpost" href="https://www.infoq.com/news/2011/05/html5-design/">“a
        nestable &lt;SECTION&gt;..&lt;/SECTION&gt; element”</a>
      resurfaced as the new outline model. Paved cowpaths, twenty-three years long.</p>
  </Moment>;
