import {FC, PropsWithChildren} from 'react';
import './AnnotatedListing.css';

export const AnnotatedListing: FC<PropsWithChildren<{heading: string}>> = ({heading, children}) =>
  <figure className="annotated-listing card ink hairline-outline rounded-corners">
    <figcaption className="heading code-paper-filled caption tracked uppercase inverse-ink">{heading}</figcaption>
    <ol className="pieces">{children}</ol>
  </figure>;
