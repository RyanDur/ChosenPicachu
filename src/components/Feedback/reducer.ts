import {HTTPError} from '@transport/types';
import {FeedbackAction, FeedbackActions} from './actions';
import {discussions, Page} from './github';

export type Sending = {state: 'writing'} | {state: 'sending'} | {state: 'refused'; why: HTTPError};

export type Draft = {
  page: Page;
  openings: number;
  thread: string;
  words: string;
  reach: string;
  sending: Sending;
  sentTo?: string;
  sentOnScreen: number;
};

export const draftAt = (page: Page): Draft =>
  ({page, openings: 0, thread: discussions, words: '', reach: '', sending: {state: 'writing'}, sentOnScreen: 0});

const aboutPage = (draft: Draft, key: string): boolean => draft.page.key === key;
const onScreen = (draft: Draft, openings: number): boolean => draft.openings === openings;
const stillSending = ({sending}: Draft): Sending => sending.state === 'sending' ? sending : {state: 'writing'};

export const feedbackReducer = (draft: Draft, action: FeedbackAction): Draft => {
  switch (action.type) {
    case FeedbackActions.OPENED:
      return {...draft, page: action.page, openings: draft.openings + 1, thread: discussions, sending: stillSending(draft), sentTo: undefined};
    case FeedbackActions.THREAD_FOUND:
      return aboutPage(draft, action.key) ? {...draft, thread: action.url} : draft;
    case FeedbackActions.THREAD_UNKNOWN:
      return aboutPage(draft, action.key) ? {...draft, thread: discussions} : draft;
    case FeedbackActions.WORDS_EDITED:
      return {...draft, words: action.words};
    case FeedbackActions.REACH_EDITED:
      return {...draft, reach: action.reach};
    case FeedbackActions.NOTE_SENDING:
      return {...draft, sending: {state: 'sending'}};
    case FeedbackActions.NOTE_SENT:
      return onScreen(draft, action.openings)
        ? {...draft, sentTo: action.url, words: '', reach: '', sending: {state: 'writing'}, sentOnScreen: draft.sentOnScreen + 1}
        : {...draft, sentTo: action.url, sending: {state: 'writing'}};
    case FeedbackActions.NOTE_REFUSED:
      return {...draft, sending: {state: 'refused', why: action.why}};
  }
  return draft;
};
