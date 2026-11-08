import {HTTPError} from '@transport/types';
import {FeedbackChange} from './feedbackChange';
import {github} from './github';

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

const draftAt = (key: string): Draft =>
  ({key, openings: 0, thread: github.discussions, words: '', reach: '', sending: {state: 'writing'}, sentOnScreen: 0});

const aboutPage = (draft: Draft, key: string): boolean => draft.key === key;
const onScreen = (draft: Draft, openings: number): boolean => draft.openings === openings;
const unsentWords = ({sending, words, reach}: Draft): Pick<Draft, 'words' | 'reach'> =>
  sending.state === 'sending' && sending.words === words && sending.reach === reach ? {words: '', reach: ''} : {words, reach};
const stillSending = ({sending}: Draft): Sending => sending.state === 'sending' ? sending : {state: 'writing'};

const reduce = (draft: Draft, action: FeedbackChange): Draft => {
  switch (action.type) {
    case 'opened':
      return {
        ...draft,
        key: action.key,
        openings: draft.openings + 1,
        thread: github.discussions,
        sending: stillSending(draft),
        sentTo: undefined
      };
    case 'threadFound':
      return aboutPage(draft, action.key) ? {...draft, thread: action.url} : draft;
    case 'threadUnknown':
      return aboutPage(draft, action.key) ? {...draft, thread: github.discussions} : draft;
    case 'wordsEdited':
      return {...draft, words: action.words};
    case 'reachEdited':
      return {...draft, reach: action.reach};
    case 'noteSubmitted':
      return {...draft, sending: {state: 'sending', words: draft.words, reach: draft.reach}};
    case 'noteSent':
      return onScreen(draft, action.openings)
        ? {...draft, sentTo: action.url, words: '', reach: '', sending: {state: 'writing'}, sentOnScreen: draft.sentOnScreen + 1}
        : {...draft, ...unsentWords(draft), sentTo: action.url, sending: {state: 'sent'}};
    case 'noteRefused':
      return {...draft, sending: {state: 'refused', why: action.why}};
  }
  return draft;
};

export const feedbackDraft = {initial: draftAt, reduce};
