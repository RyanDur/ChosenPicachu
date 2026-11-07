import {Maybe, nothing, some} from '@ryandur/sand';

export type MuseumReply<Answer> =
  | {reply: 'unasked'; standing: Maybe<Answer>}
  | {reply: 'asked'; standing: Maybe<Answer>}
  | {reply: 'answered'; answer: Answer}
  | {reply: 'refused'};

export const standingOf = <Answer>(reply: MuseumReply<Answer>): Maybe<Answer> => {
  switch (reply.reply) {
    case 'answered': return some(reply.answer);
    case 'refused': return nothing();
    default: return reply.standing;
  }
};

export const awaited = <Answer>({reply}: MuseumReply<Answer>): boolean => reply === 'unasked' || reply === 'asked';
