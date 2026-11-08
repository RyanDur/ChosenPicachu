import {HTTPError} from '@transport/types';

export type Opened = {readonly type: 'opened'; readonly key: string};
export type ThreadFound = {readonly type: 'threadFound'; readonly key: string; readonly url: string};
export type ThreadUnknown = {readonly type: 'threadUnknown'; readonly key: string};
export type WordsEdited = {readonly type: 'wordsEdited'; readonly words: string};
export type ReachEdited = {readonly type: 'reachEdited'; readonly reach: string};
export type NoteSubmitted = {readonly type: 'noteSubmitted'};
export type NoteSent = {readonly type: 'noteSent'; readonly openings: number; readonly url: string};
export type NoteRefused = {readonly type: 'noteRefused'; readonly why: HTTPError};

export type FeedbackChange =
  | Opened
  | ThreadFound
  | ThreadUnknown
  | WordsEdited
  | ReachEdited
  | NoteSubmitted
  | NoteSent
  | NoteRefused;

export const feedbackChange = {
  opened: (key: string): Opened => ({type: 'opened', key}),
  threadFound: (key: string, url: string): ThreadFound => ({type: 'threadFound', key, url}),
  threadUnknown: (key: string): ThreadUnknown => ({type: 'threadUnknown', key}),
  wordsEdited: (words: string): WordsEdited => ({type: 'wordsEdited', words}),
  reachEdited: (reach: string): ReachEdited => ({type: 'reachEdited', reach}),
  noteSubmitted: (): NoteSubmitted => ({type: 'noteSubmitted'}),
  noteSent: (openings: number, url: string): NoteSent => ({type: 'noteSent', openings, url}),
  noteRefused: (why: HTTPError): NoteRefused => ({type: 'noteRefused', why})
};
