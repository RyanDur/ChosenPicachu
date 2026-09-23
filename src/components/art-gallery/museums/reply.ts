export type MuseumReply<Answer> =
  | {reply: 'unasked'; standing?: Answer}
  | {reply: 'asked'; standing?: Answer}
  | {reply: 'answered'; answer: Answer}
  | {reply: 'refused'};

export const standingOf = <Answer>(reply: MuseumReply<Answer>): Answer | undefined => {
  switch (reply.reply) {
    case 'answered': return reply.answer;
    case 'refused': return undefined;
    default: return reply.standing;
  }
};
