import {FC} from 'react';
import {has} from '@ryandur/sand';
import {classNames} from '@components';
import {Kind, Label} from './highlight';
import {excerpts} from './excerpts';
import {Line} from './sample';

type Props = {
  label: Label;
  lines: readonly Line[];
};

const splitIndent = (text: string): {indent: string; code: string} => {
  const code = text.trimStart();
  return {indent: text.slice(0, text.length - code.length), code};
};

const inkOf: Record<Exclude<Kind, 'plain'>, string> = {
  keyword: 'keyword-ink bold',
  string: 'string-ink',
  number: 'number-ink',
  comment: 'comment-ink italic',
  tag: 'tag-ink',
  attribute: 'attribute-ink',
  type: 'type-ink',
  call: 'call-ink'
};

export const InkedLines: FC<Props> = ({label, lines}) => {
  const indented = lines.map(({text}) => splitIndent(text));
  const inked = excerpts.tokensOf(label, lines.map((line, at) => ({...line, text: indented[at].code})));
  return <>{lines.map(({dim = false, marked = false}, at) => {
    const {indent} = indented[at];
    const Holder = marked ? 'mark' : 'span';
    return <Holder className={classNames('line', dim && inkOf.comment, marked && 'code-marked-filled inverse-ink')}
      key={at}>
      {has(indent) && <span className="indent">{indent}</span>}
      {marked ? indented[at].code : inked[at].map(({text: piece, kind}, part) =>
        kind === 'plain' ? piece : <span className={inkOf[kind]} key={part}>{piece}</span>)}
      {'\n'}
    </Holder>;
  })}</>;
};
