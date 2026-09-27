import {HTTPError} from '@transport/types';
import {Page} from './github';

export enum FeedbackActions {
  OPENED = 'OPENED',
  THREAD_FOUND = 'THREAD_FOUND',
  THREAD_UNKNOWN = 'THREAD_UNKNOWN',
  WORDS_EDITED = 'WORDS_EDITED',
  REACH_EDITED = 'REACH_EDITED',
  NOTE_SENDING = 'NOTE_SENDING',
  NOTE_SENT = 'NOTE_SENT',
  NOTE_REFUSED = 'NOTE_REFUSED'
}

type Action<T> = {
  type: T;
};

export type Opened = Action<FeedbackActions.OPENED> & {page: Page};
export type ThreadFound = Action<FeedbackActions.THREAD_FOUND> & {key: string; url: string};
export type ThreadUnknown = Action<FeedbackActions.THREAD_UNKNOWN> & {key: string};
export type WordsEdited = Action<FeedbackActions.WORDS_EDITED> & {words: string};
export type ReachEdited = Action<FeedbackActions.REACH_EDITED> & {reach: string};
export type NoteSending = Action<FeedbackActions.NOTE_SENDING>;
export type NoteSent = Action<FeedbackActions.NOTE_SENT> & {openings: number; url: string};
export type NoteRefused = Action<FeedbackActions.NOTE_REFUSED> & {openings: number; why: HTTPError};

export type FeedbackAction =
  | Opened
  | ThreadFound
  | ThreadUnknown
  | WordsEdited
  | ReachEdited
  | NoteSending
  | NoteSent
  | NoteRefused;

export const opened = (page: Page): Opened => ({type: FeedbackActions.OPENED, page});
export const threadFound = (key: string, url: string): ThreadFound => ({type: FeedbackActions.THREAD_FOUND, key, url});
export const threadUnknown = (key: string): ThreadUnknown => ({type: FeedbackActions.THREAD_UNKNOWN, key});
export const wordsEdited = (words: string): WordsEdited => ({type: FeedbackActions.WORDS_EDITED, words});
export const reachEdited = (reach: string): ReachEdited => ({type: FeedbackActions.REACH_EDITED, reach});
export const noteSending = (): NoteSending => ({type: FeedbackActions.NOTE_SENDING});
export const noteSent = (openings: number, url: string): NoteSent => ({type: FeedbackActions.NOTE_SENT, openings, url});
export const noteRefused = (openings: number, why: HTTPError): NoteRefused => ({type: FeedbackActions.NOTE_REFUSED, openings, why});
