import {FC} from 'react';
import {Mdn, Tell} from '../../../Recipe';
import type {World} from '../../../Controls';

export const OwnedPixels: FC<{world: World}> = ({world}) =>
  <Tell>Leaving the pixels to the code does not mean building in JavaScript. The markup stays a
    normal table. Every visible change (the cursors, the hiding, every slide) is a CSS
    rule a class switches on. JavaScript only decides what the state is,
    and {world === 'react'
    ? 'React affords nothing the DOM does not give you'
    : 'there is no framework in the document'}: a move of a node, one element or piece of text in the DOM,
    is <Mdn path="Web/API/Node/insertBefore">insertBefore</Mdn>, the handlers are
    events, the state is a value. Each code block below is labeled with which of the
    three languages is doing the work.</Tell>;
