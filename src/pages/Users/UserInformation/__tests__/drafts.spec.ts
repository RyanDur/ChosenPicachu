import {aUser} from '@pages/Users/__test_support';
import {draftActions} from '../draftActions';
import {drafts} from '../drafts';

const typing = drafts.of(aUser());

describe('a draft and the adds it sends', () => {
  test('a draft that sent no add stays when an add is confirmed', () => {
    expect(drafts.sentAddConfirmed(typing, 1)).toBe(false);
  });

  test('a draft that sent an add stays while that add is in flight', () => {
    const sent = drafts.reduce(typing, draftActions.addSent(3));

    expect(drafts.sentAddConfirmed(sent, 3)).toBe(false);
  });

  test('a draft that sent an add clears once the count of confirmed adds moves on', () => {
    const sent = drafts.reduce(typing, draftActions.addSent(3));

    expect(drafts.sentAddConfirmed(sent, 4)).toBe(true);
  });

  test('a reset draft has sent nothing', () => {
    const sent = drafts.reduce(typing, draftActions.addSent(3));

    const fresh = drafts.reduce(sent, draftActions.formReset(aUser()));

    expect(drafts.sentAddConfirmed(fresh, 4)).toBe(false);
  });
});
