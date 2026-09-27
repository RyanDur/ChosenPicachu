import {HTTPError} from '@transport/types';
import {FeedbackAction, FeedbackActions} from './actions';
import {discussions} from './github';

export type Sending = {state: 'writing'} | {state: 'sending'; words: string; reach: string} | {state: 'sent'} | {state: 'refused'; why: HTTPError};

export type Draft = {
  key: string;
  openings: number;
  thread: string;
  words: string;
  reach: string;
  sending: Sending;
  sentTo?: string;
  sentOnScreen: number;
};

export const draftAt = (key: string): Draft =>
  ({key, openings: 0, thread: discussions, words: '', reach: '', sending: {state: 'writing'}, sentOnScreen: 0});

const aboutPage = (draft: Draft, key: string): boolean => draft.key === key;
const onScreen = (draft: Draft, openings: number): boolean => draft.openings === openings;
const unsentWords = ({sending, words, reach}: Draft): Pick<Draft, 'words' | 'reach'> =>
  sending.state === 'sending' && sending.words === words && sending.reach === reach ? {words: '', reach: ''} : {words, reach};
const stillSending = ({sending}: Draft): Sending => sending.state === 'sending' ? sending : {state: 'writing'};

export const feedbackReducer = (draft: Draft, action: FeedbackAction): Draft => {
  switch (action.type) {
    case FeedbackActions.OPENED:
      return {...draft, key: action.key, openings: draft.openings + 1, thread: discussions, sending: stillSending(draft), sentTo: undefined};
    case FeedbackActions.THREAD_FOUND:
      return aboutPage(draft, action.key) ? {...draft, thread: action.url} : draft;
    case FeedbackActions.THREAD_UNKNOWN:
      return aboutPage(draft, action.key) ? {...draft, thread: discussions} : draft;
    case FeedbackActions.WORDS_EDITED:
      return {...draft, words: action.words};
    case FeedbackActions.REACH_EDITED:
      return {...draft, reach: action.reach};
    case FeedbackActions.NOTE_SUBMITTED:
      return {...draft, sending: {state: 'sending', words: draft.words, reach: draft.reach}};
    case FeedbackActions.NOTE_SENT:
      return onScreen(draft, action.openings)
        ? {...draft, sentTo: action.url, words: '', reach: '', sending: {state: 'writing'}, sentOnScreen: draft.sentOnScreen + 1}
        : {...draft, ...unsentWords(draft), sentTo: action.url, sending: {state: 'sent'}};
    case FeedbackActions.NOTE_REFUSED:
      return {...draft, sending: {state: 'refused', why: action.why}};
  }
  return draft;
};
