import {FC, KeyboardEvent, MouseEvent, ReactNode, SubmitEvent, SyntheticEvent, useEffect, useReducer} from 'react';
import {useLocation, useSearchParams} from 'react-router';
import {empty, has, maybe, not} from '@ryandur/sand';
import {useEnv} from '@components/Env';
import {usePageName} from '@components/PageName';
import {troubleWith} from '@transport/trouble';
import {sent, threadFor} from './github';
import {
  noteRefused,
  noteSent,
  noteSubmitted,
  opened,
  reachEdited,
  threadFound,
  threadUnknown,
  wordsEdited
} from './actions';
import {draftAt, feedbackReducer, Sending} from './reducer';
import {classNames} from '@components/class-names';
import './Feedback.css';

const invokersMissing = not('command' in HTMLButtonElement.prototype);
const lightDismissMissing = not('closedBy' in HTMLDialogElement.prototype);

const commandWithoutInvokers = (event: MouseEvent<HTMLButtonElement>) => {
  const button = event.currentTarget;
  const dialog = document.getElementById(button.getAttribute('commandfor') ?? '');
  if (invokersMissing && dialog instanceof HTMLDialogElement) {
    if (button.getAttribute('command') === 'show-modal') {
      dialog.showModal();
    } else {
      dialog.close();
    }
  }
};

const sendsOnEnter = (event: KeyboardEvent<HTMLTextAreaElement>) => {
  if (event.key === 'Enter' && !event.shiftKey && !event.nativeEvent.isComposing) {
    event.preventDefault();
    event.currentTarget.form?.requestSubmit();
  }
};

const closesOnTheVeil = (event: MouseEvent<HTMLDialogElement>) => {
  const box = event.currentTarget.getBoundingClientRect();
  const onTheVeil = event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom;
  if (lightDismissMissing && event.target === event.currentTarget && onTheVeil) {
    event.currentTarget.close();
  }
};

const fieldFirst = (event: SyntheticEvent<HTMLDialogElement>) => {
  const words = event.currentTarget.querySelector('textarea');
  if (event.currentTarget.open && has(words)) {
    words.focus();
  }
};

const said = (sending: Sending): ReactNode => {
  switch (sending.state) {
    case 'sending':
      return 'Sending the note to GitHub.';
    case 'sent':
      return <>Sent. <a className="signpost" href={sending.to}>Read it on GitHub</a></>;
    case 'refused':
      return `${troubleWith('GitHub')(sending.why)}. Your words are still here.`;
  }
  return '';
};

export const Feedback: FC = () => {
  const {feedbackToken} = useEnv();
  const {pathname} = useLocation();
  const [params] = useSearchParams();
  const pageName = usePageName();
  const [draft, dispatch] = useReducer(feedbackReducer, pathname, draftAt);

  useEffect(() => {
    const dialog = document.getElementById('feedback');
    if (draft.sentOnScreen > 0 && dialog instanceof HTMLDialogElement) {
      dialog.close();
    }
  }, [draft.sentOnScreen]);

  if (!has(feedbackToken)) {
    return null;
  }

  const key = maybe(params.get('tab')).map(tab => `${pathname}?tab=${tab}`).orElse(pathname);

  const opening = (event: MouseEvent<HTMLButtonElement>) => {
    event.currentTarget.focus();
    commandWithoutInvokers(event);
    const here = {key, name: pageName};
    dispatch(opened(key));
    threadFor(feedbackToken, here)
      .onSuccess(found => dispatch(found.either(({url}) => threadFound(here.key, url), () => threadUnknown(here.key))))
      .onFailure(() => dispatch(threadUnknown(here.key)));
  };

  const send = (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (draft.sending.state === 'sending') {
      return;
    }
    const {openings, words, reach} = draft;
    dispatch(noteSubmitted());
    sent(feedbackToken, {page: {key: draft.key, name: pageName}, words, from: window.location.href, ...(empty(reach) ? {} : {reach})})
      .onSuccess(url => dispatch(noteSent(openings, url)))
      .onFailure(why => dispatch(noteRefused(why)));
  };

  return <>
    <p className="feedback-item field">
      <button type="button" className="feedback-open path rail-aside bold attentive field reachable" commandfor="feedback" command="show-modal" onClick={opening}>Feedback</button>
      <output className="feedback-sent caption">{has(draft.sentTo) && <>Sent. <a className="signpost" href={draft.sentTo}>Read it on GitHub</a></>}</output>
    </p>
    <dialog id="feedback" className="feedback-dialog backdrop" closedby="any" aria-labelledby="feedback-title" onClick={closesOnTheVeil} onToggle={fieldFirst}>
      <form className="feedback-form" onSubmit={send}>
        <hgroup className="feedback-heading field">
          <h2 id="feedback-title" className="sub-title bold">Feedback</h2>
          <p className="paragraph">About: {pageName}</p>
        </hgroup>
        <p className="feedback-thread field paragraph">It goes to <a className="signpost" href={draft.thread}>this page’s thread on GitHub</a>, where you can read what others said.</p>
        <label className="feedback-field">
          <span className="feedback-label field bold">What did you find?</span>
          <textarea className="feedback-words bare card borderless paragraph" name="words" required enterKeyHint="send" value={draft.words}
            onChange={event => dispatch(wordsEdited(event.currentTarget.value))} onKeyDown={sendsOnEnter}/>
        </label>
        <label className="feedback-field">
          <span className="feedback-label field bold">A way to reach you, if you like</span>
          <input className="feedback-reach bare card borderless paragraph" type="text" name="reach" autoComplete="email" enterKeyHint="send" value={draft.reach}
            onChange={event => dispatch(reachEdited(event.currentTarget.value))}/>
        </label>
        <fieldset className="feedback-actions field">
          <legend className="feedback-actions-name off-screen">Send or cancel</legend>
          <output className={classNames('feedback-status', 'paragraph', draft.sending.state === 'refused' && 'alarm-ink')}>{said(draft.sending)}</output>
          <button type="button" className="feedback-cancel path sub-title bold attentive field hairline-outline reachable" commandfor="feedback" command="close" onClick={commandWithoutInvokers}>Cancel</button>
          <button type="submit" className="feedback-send path sub-title bold attentive borderless reachable" disabled={draft.sending.state === 'sending'}>Send</button>
        </fieldset>
      </form>
    </dialog>
  </>;
};
