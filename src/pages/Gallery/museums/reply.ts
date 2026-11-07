import {Maybe, nothing, Result, some} from '@ryandur/sand';
import {ReplyChange, replyChange} from '@pages/Gallery/museums/replyChange';

export type MuseumReply<Answer> =
  | {reply: 'unasked'; standing: Maybe<Answer>}
  | {reply: 'asked'; standing: Maybe<Answer>}
  | {reply: 'answered'; answer: Answer}
  | {reply: 'refused'};

type Unasked = Extract<MuseumReply<never>, {reply: 'unasked'}>;
type Question<Answer, Failure> = () => Result.Async<Answer, Failure>;

type MuseumReplies = {
  readonly initial: Unasked;
  readonly reduce: <Answer>(reply: MuseumReply<Answer>, change: ReplyChange<Answer>) => MuseumReply<Answer>;
  readonly standingOf: <Answer>(reply: MuseumReply<Answer>) => Maybe<Answer>;
  readonly awaited: <Answer>(reply: MuseumReply<Answer>) => boolean;
  readonly ask: <Answer, Failure>(
    question: Maybe<Question<Answer, Failure>>,
    dispatch: (change: ReplyChange<Answer>) => void,
    refused: (failure: Failure) => void
  ) => () => void;
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
  awaited: ({reply}) => reply === 'unasked' || reply === 'asked',
  ask: (question, dispatch, refused) => question
    .map(asked => {
      const {cancel} = asked()
        .onPending(pending => pending && dispatch(replyChange.asked()))
        .onSuccess(answer => dispatch(replyChange.answered(answer)))
        .onFailure(failure => {
          dispatch(replyChange.refused());
          refused(failure);
        });
      return () => {
        cancel();
        dispatch(replyChange.abandoned());
      };
    })
    .orElse(() => dispatch(replyChange.abandoned()))
};
