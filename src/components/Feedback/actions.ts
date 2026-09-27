import {HTTPError} from '@transport/types';

export enum FeedbackActions {
  OPENED = 'OPENED',
  THREAD_FOUND = 'THREAD_FOUND',
  THREAD_UNKNOWN = 'THREAD_UNKNOWN',
  WORDS_EDITED = 'WORDS_EDITED',
  REACH_EDITED = 'REACH_EDITED',
  NOTE_SUBMITTED = 'NOTE_SUBMITTED',
  NOTE_SENT = 'NOTE_SENT',
  NOTE_REFUSED = 'NOTE_REFUSED'
}

type Action<T> = {
  type: T;
};

export type Opened = Action<FeedbackActions.OPENED> & {key: string};
export type ThreadFound = Action<FeedbackActions.THREAD_FOUND> & {key: string; url: string};
export type ThreadUnknown = Action<FeedbackActions.THREAD_UNKNOWN> & {key: string};
export type WordsEdited = Action<FeedbackActions.WORDS_EDITED> & {words: string};
export type ReachEdited = Action<FeedbackActions.REACH_EDITED> & {reach: string};
export type NoteSubmitted = Action<FeedbackActions.NOTE_SUBMITTED>;
export type NoteSent = Action<FeedbackActions.NOTE_SENT> & {openings: number; url: string};
export type NoteRefused = Action<FeedbackActions.NOTE_REFUSED> & {why: HTTPError};

export type FeedbackAction =
  | Opened
  | ThreadFound
  | ThreadUnknown
  | WordsEdited
  | ReachEdited
  | NoteSubmitted
  | NoteSent
  | NoteRefused;

export const opened = (key: string): Opened => ({type: FeedbackActions.OPENED, key});
export const threadFound = (key: string, url: string): ThreadFound => ({type: FeedbackActions.THREAD_FOUND, key, url});
export const threadUnknown = (key: string): ThreadUnknown => ({type: FeedbackActions.THREAD_UNKNOWN, key});
export const wordsEdited = (words: string): WordsEdited => ({type: FeedbackActions.WORDS_EDITED, words});
export const reachEdited = (reach: string): ReachEdited => ({type: FeedbackActions.REACH_EDITED, reach});
export const noteSubmitted = (): NoteSubmitted => ({type: FeedbackActions.NOTE_SUBMITTED});
export const noteSent = (openings: number, url: string): NoteSent => ({type: FeedbackActions.NOTE_SENT, openings, url});
export const noteRefused = (why: HTTPError): NoteRefused => ({type: FeedbackActions.NOTE_REFUSED, why});
