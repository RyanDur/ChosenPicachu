import {HTTPError} from '@transport/types';
import {
  noteRefused,
  noteSent,
  noteSubmitted,
  opened,
  reachEdited,
  threadFound,
  threadUnknown,
  wordsEdited
} from '../actions';
import {discussions} from '../github';
import {draftAt, feedbackReducer} from '../reducer';

const tables = '/demos/?tab=tables';
const gallery = '/gallery';

const openOn = feedbackReducer(draftAt(tables), opened(tables));

describe('the feedback reducer', () => {
  test('should start a new opening on the page it was opened on, linking to Discussions', () => {
    const draft = feedbackReducer({...draftAt(gallery), thread: 'https://github.test/discussions/1'}, opened(tables));

    expect(draft.key).toBe(tables);
    expect(draft.thread).toBe(discussions);
  });

  test('should keep the words a reader typed across a close and a reopening', () => {
    const draft = feedbackReducer(feedbackReducer(openOn, wordsEdited('A step does not build.')), opened(tables));

    expect(draft.words).toBe('A step does not build.');
  });

  test('should link to the thread found for the page the dialog is about', () => {
    const draft = feedbackReducer(openOn, threadFound(tables, 'https://github.test/discussions/7'));

    expect(draft.thread).toBe('https://github.test/discussions/7');
  });

  test('should ignore a thread found for a page the dialog has moved on from', () => {
    const onTheGallery = feedbackReducer(openOn, opened(gallery));

    const draft = feedbackReducer(onTheGallery, threadFound(tables, 'https://github.test/discussions/7'));

    expect(draft.thread).toBe(discussions);
  });

  test('should link to Discussions when the page has no thread it can find', () => {
    const draft = feedbackReducer({...openOn, thread: 'https://github.test/discussions/7'}, threadUnknown(tables));

    expect(draft.thread).toBe(discussions);
  });

  test('should hold the words and the way to reach the reader as they are typed', () => {
    const draft = feedbackReducer(feedbackReducer(openOn, wordsEdited('It hides.')), reachEdited('reader@example.test'));

    expect(draft.words).toBe('It hides.');
    expect(draft.reach).toBe('reader@example.test');
  });

  test('should clear the sent note and link to it', () => {
    const typed = feedbackReducer(feedbackReducer(openOn, wordsEdited('It hides.')), noteSubmitted());

    const draft = feedbackReducer(typed, noteSent(typed.openings, 'https://github.test/discussions/9'));

    expect(draft.words).toBe('');
    expect(draft.sending).toEqual({state: 'writing'});
    expect(draft.sentTo).toBe('https://github.test/discussions/9');
  });

  test('should say why GitHub refused the note on screen', () => {
    const sending = feedbackReducer(openOn, noteSubmitted());

    const draft = feedbackReducer(sending, noteRefused(HTTPError.FORBIDDEN));

    expect(draft.sending).toEqual({state: 'refused', why: HTTPError.FORBIDDEN});
  });

  test('should say why GitHub refused a note even after the dialog was reopened', () => {
    const sending = feedbackReducer(openOn, noteSubmitted());
    const reopened = feedbackReducer(sending, opened(tables));

    const draft = feedbackReducer(reopened, noteRefused(HTTPError.FORBIDDEN));

    expect(draft.sending).toEqual({state: 'refused', why: HTTPError.FORBIDDEN});
  });
});
