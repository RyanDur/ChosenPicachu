import {FC, PropsWithChildren} from 'react';
import './AnnotatedListing.css';

export const AnnotatedListing: FC<PropsWithChildren<{head: string}>> = ({head, children}) =>
  <figure className="annotated-listing card ink hairline-outline rounded-corners">
    <figcaption className="head code-paper-filled caption tracked inverse-ink">{head}</figcaption>
    <ol className="pieces">{children}</ol>
  </figure>;
