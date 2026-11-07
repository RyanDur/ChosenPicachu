import {Maybe, nothing, some} from '@ryandur/sand';
import {ReplyChange} from '@pages/Gallery/museums/replyChange';

export type MuseumReply<Answer> =
  | {reply: 'unasked'; standing: Maybe<Answer>}
  | {reply: 'asked'; standing: Maybe<Answer>}
  | {reply: 'answered'; answer: Answer}
  | {reply: 'refused'};

type Unasked = Extract<MuseumReply<never>, {reply: 'unasked'}>;

type MuseumReplies = {
  readonly initial: Unasked;
  readonly reduce: <Answer>(reply: MuseumReply<Answer>, change: ReplyChange<Answer>) => MuseumReply<Answer>;
  readonly standingOf: <Answer>(reply: MuseumReply<Answer>) => Maybe<Answer>;
  readonly awaited: <Answer>(reply: MuseumReply<Answer>) => boolean;
};

export const museumReply: MuseumReplies = {
  initial: {reply: 'unasked', standing: nothing()},
  reduce: (reply, change) => {
    switch (change.type) {
      case 'asked': return {reply: 'asked', standing: museumReply.standingOf(reply)};
      case 'answered': return {reply: 'answered', answer: change.answer};
      case 'refused': return {reply: 'refused'};
      case 'abandoned': return {reply: 'unasked', standing: museumReply.standingOf(reply)};
    }
  },
  standingOf: reply => {
    switch (reply.reply) {
      case 'answered': return some(reply.answer);
      case 'refused': return nothing();
      default: return reply.standing;
    }
  },
  awaited: ({reply}) => reply === 'unasked' || reply === 'asked'
};
