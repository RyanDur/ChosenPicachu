import {HTTPError} from '@transport';
import {feedbackChange, type FeedbackChange} from '../feedbackChange';
import {github} from '../github';
import {feedbackDraft, type Draft} from '../feedbackDraft';

const tables = '/demos/tables/';
const gallery = '/gallery';

const openOn = feedbackDraft.reduce(feedbackDraft.initial(tables), feedbackChange.opened(tables));
const noteAt = 'https://github.test/github.discussions/9';
const inTurn = (draft: Draft, ...changes: FeedbackChange[]): Draft => changes.reduce(feedbackDraft.reduce, draft);

describe('the feedback reducer', () => {
  test('should start a new opening on the page it was opened on, linking to Discussions', () => {
    const draft = feedbackDraft.reduce({...feedbackDraft.initial(gallery), thread: 'https://github.test/github.discussions/1'}, feedbackChange.opened(tables));

    expect(draft.key).toBe(tables);
    expect(draft.thread).toBe(github.discussions);
  });

  test('should keep the words a reader typed across a close and a reopening', () => {
    const draft = feedbackDraft.reduce(feedbackDraft.reduce(openOn, feedbackChange.wordsEdited('A step does not build.')), feedbackChange.opened(tables));

    expect(draft.words).toBe('A step does not build.');
  });

  test('should link to the thread found for the page the dialog is about', () => {
    const draft = feedbackDraft.reduce(openOn, feedbackChange.threadFound(tables, 'https://github.test/github.discussions/7'));

    expect(draft.thread).toBe('https://github.test/github.discussions/7');
  });

  test('should ignore a thread found for a page the dialog has moved on from', () => {
    const onTheGallery = feedbackDraft.reduce(openOn, feedbackChange.opened(gallery));

    const draft = feedbackDraft.reduce(onTheGallery, feedbackChange.threadFound(tables, 'https://github.test/github.discussions/7'));

    expect(draft.thread).toBe(github.discussions);
  });

  test('should link to Discussions when the page has no thread it can find', () => {
    const draft = feedbackDraft.reduce({...openOn, thread: 'https://github.test/github.discussions/7'}, feedbackChange.threadUnknown(tables));

    expect(draft.thread).toBe(github.discussions);
  });

  test('should hold the words and the way to reach the reader as they are typed', () => {
    const draft = feedbackDraft.reduce(feedbackDraft.reduce(openOn, feedbackChange.wordsEdited('It hides.')), feedbackChange.reachEdited('reader@example.test'));

    expect(draft.words).toBe('It hides.');
    expect(draft.reach).toBe('reader@example.test');
  });

  test('should clear the sent note and link to it', () => {
    const typed = feedbackDraft.reduce(feedbackDraft.reduce(openOn, feedbackChange.wordsEdited('It hides.')), feedbackChange.noteSubmitted());

    const draft = feedbackDraft.reduce(typed, feedbackChange.noteSent('https://github.test/github.discussions/9'));

    expect(draft.words).toBe('');
    expect(draft.sending).toEqual({state: 'writing'});
    expect(draft.sentNote).toEqual({state: 'unread', url: 'https://github.test/github.discussions/9'});
  });

  test('should keep words typed while the note was sending, once GitHub answers', () => {
    const sending = inTurn(openOn, feedbackChange.wordsEdited('The sort menu hides.'), feedbackChange.noteSubmitted());
    const typedOn = inTurn(sending, feedbackChange.wordsEdited('The sort menu hides. It also flickers.'));

    const draft = inTurn(typedOn, feedbackChange.noteSent(noteAt));

    expect(draft.words).toBe('The sort menu hides. It also flickers.');
  });

  test('should keep the link to a sent note through the next opening', () => {
    const sending = inTurn(openOn, feedbackChange.wordsEdited('It hides.'), feedbackChange.noteSubmitted());

    const draft = inTurn(sending, feedbackChange.noteSent(noteAt), feedbackChange.opened(tables));

    expect(draft.sentNote).toEqual({state: 'read', url: noteAt});
  });

  test('should drop the link to a sent note on the opening after that', () => {
    const sending = inTurn(openOn, feedbackChange.wordsEdited('It hides.'), feedbackChange.noteSubmitted());
    const reopened = inTurn(sending, feedbackChange.noteSent(noteAt), feedbackChange.opened(tables));

    const draft = inTurn(reopened, feedbackChange.opened(tables));

    expect(draft.sentNote).toEqual({state: 'none'});
  });

  test('should say why GitHub refused the note on screen', () => {
    const sending = feedbackDraft.reduce(openOn, feedbackChange.noteSubmitted());

    const draft = feedbackDraft.reduce(sending, feedbackChange.noteRefused(HTTPError.FORBIDDEN));

    expect(draft.sending).toEqual({state: 'refused', why: HTTPError.FORBIDDEN});
  });

  test('should say why GitHub refused a note even after the dialog was reopened', () => {
    const sending = feedbackDraft.reduce(openOn, feedbackChange.noteSubmitted());
    const reopened = feedbackDraft.reduce(sending, feedbackChange.opened(tables));

    const draft = feedbackDraft.reduce(reopened, feedbackChange.noteRefused(HTTPError.FORBIDDEN));

    expect(draft.sending).toEqual({state: 'refused', why: HTTPError.FORBIDDEN});
  });

  test('should drop a refusal on the second opening after it arrived', () => {
    const refused = inTurn(openOn, feedbackChange.noteSubmitted(), feedbackChange.noteRefused(HTTPError.FORBIDDEN));

    const draft = inTurn(refused, feedbackChange.opened(tables), feedbackChange.opened(tables));

    expect(draft.sending).toEqual({state: 'writing'});
  });
});
