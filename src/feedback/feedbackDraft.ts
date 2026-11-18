import {HTTPError} from '@transport';
import {FeedbackChange} from './feedbackChange';
import {github} from './github';

export type Sending =
  | {state: 'writing'}
  | {state: 'sending'; words: string; reach: string}
  | {state: 'refused'; why: HTTPError}
  | {state: 'refusedBefore'; why: HTTPError};

export type SentNote = {state: 'none'} | {state: 'unread'; url: string} | {state: 'read'; url: string};

export type Draft = {
  key: string;
  thread: string;
  words: string;
  reach: string;
  sending: Sending;
  sentNote: SentNote;
};

const draftAt = (key: string): Draft =>
  ({key, thread: github.discussions, words: '', reach: '', sending: {state: 'writing'}, sentNote: {state: 'none'}});

const aboutPage = (draft: Draft, key: string): boolean => draft.key === key;
const unsentWords = ({sending, words, reach}: Draft): Pick<Draft, 'words' | 'reach'> =>
  sending.state === 'sending' && sending.words === words && sending.reach === reach ? {words: '', reach: ''} : {words, reach};
const sendingOnOpening = ({sending}: Draft): Sending => {
  switch (sending.state) {
    case 'sending':
      return sending;
    case 'refused':
      return {state: 'refusedBefore', why: sending.why};
  }
  return {state: 'writing'};
};
const readOnOpening = ({sentNote}: Draft): SentNote => sentNote.state === 'unread' ? {state: 'read', url: sentNote.url} : {state: 'none'};

const reduce = (draft: Draft, action: FeedbackChange): Draft => {
  switch (action.type) {
    case 'opened':
      return {
        ...draft,
        key: action.key,
        thread: github.discussions,
        sending: sendingOnOpening(draft),
        sentNote: readOnOpening(draft)
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
      return {...draft, sentNote: {state: 'none'}, sending: {state: 'sending', words: draft.words, reach: draft.reach}};
    case 'noteSent':
      return {...draft, ...unsentWords(draft), sentNote: {state: 'unread', url: action.url}, sending: {state: 'writing'}};
    case 'noteRefused':
      return {...draft, sending: {state: 'refused', why: action.why}};
  }
  return draft;
};

export const feedbackDraft = {initial: draftAt, reduce};
