import {FC, KeyboardEvent, MouseEvent, ReactNode, RefObject, SubmitEvent, SyntheticEvent, useContext, useEffect, useRef} from 'react';
import {useHref, useLocation, useSearchParams} from 'react-router';
import {empty, has, maybe, not} from '@ryandur/sand';
import {useEnv, useHydrated, usePageName} from '@frame/state';
import {Paths} from '@frame/navigation';
import {troubleWith} from '@transport';
import {github} from './github';
import {feedbackChange} from './feedbackChange';
import {Draft} from './feedbackDraft';
import {drafting} from './drafting';
import {classNames} from '@components/class-names';
import './Feedback.css';

const invokersMissing = (): boolean => not('command' in HTMLButtonElement.prototype);
const lightDismissMissing = (): boolean => not('closedBy' in HTMLDialogElement.prototype);

type Dialog = RefObject<HTMLDialogElement | null>;

const commandWithoutInvokers = (dialog: Dialog) => (event: MouseEvent<HTMLButtonElement>) => {
  const showing = event.currentTarget.getAttribute('command') === 'show-modal';
  if (invokersMissing()) {
    maybe(dialog.current).map(shown => showing ? shown.showModal() : shown.close());
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
  const onTheVeil = event.clientX < box.left || event.clientX > box.right
    || event.clientY < box.top || event.clientY > box.bottom;
  if (lightDismissMissing() && event.target === event.currentTarget && onTheVeil) {
    event.currentTarget.close();
  }
};

const fieldFirst = (event: SyntheticEvent<HTMLDialogElement>) => {
  const words = event.currentTarget.querySelector('textarea');
  if (event.currentTarget.open && has(words)) {
    words.focus();
  }
};

const said = ({sending, sentTo}: Draft): ReactNode => {
  switch (sending.state) {
    case 'sending':
      return 'Sending the note to GitHub.';
    case 'sent':
      return <>Sent. <a className="signpost" href={sentTo}>Read it on GitHub</a></>;
    case 'refused':
      return `${troubleWith('GitHub')(sending.why)}. Your words are still here.`;
  }
  return '';
};

export const Feedback: FC = () => {
  const hydrated = useHydrated();
  const {feedbackToken, feedbackEndpoint} = useEnv();
  const location = useLocation();
  const {pathname} = location;
  const sentFrom = `${Paths.site}${useHref(location)}`;
  const [params] = useSearchParams();
  const pageName = usePageName();
  const [draft, dispatch] = useContext(drafting);
  const dialog = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    if (draft.sentOnScreen > 0) {
      maybe(dialog.current).map(shown => shown.close());
    }
  }, [draft.sentOnScreen]);

  if (!has(feedbackToken)) {
    return null;
  }

  const key = maybe(params.get('tab')).map(tab => `${pathname}?tab=${tab}`).orElse(pathname);

  const opening = (event: MouseEvent<HTMLButtonElement>) => {
    event.currentTarget.focus();
    commandWithoutInvokers(dialog)(event);
    const here = {key, name: pageName};
    dispatch(feedbackChange.opened(key));
    github.threadFor({endpoint: feedbackEndpoint, token: feedbackToken}, here)
      .onSuccess(found => dispatch(found.either(
        ({url}) => feedbackChange.threadFound(here.key, url),
        () => feedbackChange.threadUnknown(here.key))))
      .onFailure(() => dispatch(feedbackChange.threadUnknown(here.key)));
  };

  const send = (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (draft.sending.state === 'sending') {
      return;
    }
    const {openings, words, reach} = draft;
    dispatch(feedbackChange.noteSubmitted());
    github.sent(
      {endpoint: feedbackEndpoint, token: feedbackToken},
      {page: {key: draft.key, name: pageName}, words, from: sentFrom, ...(empty(reach) ? {} : {reach})}
    )
      .onSuccess(url => dispatch(feedbackChange.noteSent(openings, url)))
      .onFailure(why => dispatch(feedbackChange.noteRefused(why)));
  };

  return <>
    <p className={classNames('feedback-item', 'field', !hydrated && 'gap-filled')}>
      <button type="button" className="feedback-open path rail-aside bold attentive field borderless reachable"
        inert={!hydrated} commandfor={hydrated ? 'feedback' : undefined} command="show-modal"
        onClick={opening}>Feedback</button>
      <output className="feedback-sent caption">{has(draft.sentTo) && <>Sent. <a className="signpost" href={draft.sentTo}>Read it on GitHub</a></>}</output>
    </p>
    {hydrated && <dialog ref={dialog} id="feedback" className="feedback-dialog backdrop veiled ink" closedby="any" aria-labelledby="feedback-title" onClick={closesOnTheVeil} onToggle={fieldFirst}>
      <form className="feedback-form" onSubmit={send}>
        <hgroup className="feedback-heading field">
          <h2 id="feedback-title" className="sub-title bold">Feedback</h2>
          <p className="paragraph">About: {pageName}</p>
        </hgroup>
        <p className="feedback-thread field paragraph">It goes to <a className="signpost" href={draft.thread}>this
          page’s thread on GitHub</a>, where you can read what others said.</p>
        <label className="feedback-field">
          <span className="feedback-label field bold approached">What did you find?</span>
          <textarea className="feedback-words bare card borderless paragraph ink" name="words" required enterKeyHint="send" value={draft.words}
            onChange={event => dispatch(feedbackChange.wordsEdited(event.currentTarget.value))}
            onKeyDown={sendsOnEnter}/>
        </label>
        <label className="feedback-field">
          <span className="feedback-label field bold approached">A way to reach you, if you like</span>
          <input className="feedback-reach bare card borderless paragraph ink" type="text" name="reach" autoComplete="email" enterKeyHint="send" value={draft.reach}
            onChange={event => dispatch(feedbackChange.reachEdited(event.currentTarget.value))}/>
        </label>
        <fieldset className="feedback-actions field">
          <legend className="feedback-actions-name off-screen">Send or cancel</legend>
          <output className={classNames('feedback-status', 'paragraph', draft.sending.state === 'refused' && 'alarm-ink')}>{said(draft)}</output>
          <button type="button" className="feedback-cancel path sub-title bold attentive field hairline-outline ink reachable" commandfor="feedback" command="close" onClick={commandWithoutInvokers(dialog)}>Cancel</button>
          <button type="submit" className="feedback-send path sub-title bold attentive inverse-filled borderless reachable" disabled={draft.sending.state === 'sending'}>Send</button>
        </fieldset>
      </form>
    </dialog>}
  </>;
};
