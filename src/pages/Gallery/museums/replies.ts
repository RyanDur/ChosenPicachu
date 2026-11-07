import {nothing} from '@ryandur/sand';
import {MuseumReply, standingOf} from '@pages/Gallery/museums/reply';
import {ReplyChange} from '@pages/Gallery/museums/replyChange';

type Replies<Answer> = {
  readonly initial: MuseumReply<Answer>;
  readonly reduce: (reply: MuseumReply<Answer>, change: ReplyChange<Answer>) => MuseumReply<Answer>;
};

export const replies = <Answer>(): Replies<Answer> => ({
  initial: {reply: 'unasked', standing: nothing()},
  reduce: (reply, change) => {
    switch (change.type) {
      case 'asked': return {reply: 'asked', standing: standingOf(reply)};
      case 'answered': return {reply: 'answered', answer: change.answer};
      case 'refused': return {reply: 'refused'};
      case 'abandoned': return {reply: 'unasked', standing: standingOf(reply)};
    }
  }
});
