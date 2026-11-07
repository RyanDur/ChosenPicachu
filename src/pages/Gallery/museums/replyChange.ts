type Asked = {readonly type: 'asked'};
type Answered<Answer> = {readonly type: 'answered'; readonly answer: Answer};
type Refused = {readonly type: 'refused'};
type Abandoned = {readonly type: 'abandoned'};

export type ReplyChange<Answer> = Asked | Answered<Answer> | Refused | Abandoned;

export const replyChange = {
  asked: (): Asked => ({type: 'asked'}),
  answered: <Answer>(answer: Answer): Answered<Answer> => ({type: 'answered', answer}),
  refused: (): Refused => ({type: 'refused'}),
  abandoned: (): Abandoned => ({type: 'abandoned'})
};
