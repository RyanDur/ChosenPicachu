import {FC, KeyboardEvent, MouseEvent, SubmitEvent, SyntheticEvent, useState} from 'react';
import {useLocation, useSearchParams} from 'react-router';
import {empty, has, maybe, not} from '@ryandur/sand';
import {useEnv} from '@components/Env';
import {troubleWith} from '@transport/trouble';
import {HTTPError} from '@transport/types';
import {Page, discussions, sent, threadFor} from './github';
import './Feedback.css';
import cancelIcon from '../../assets/icons/cancel.svg?url';

type Sending = {state: 'writing'} | {state: 'sending'} | {state: 'refused'; why: HTTPError};

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

const pageName = (): string =>
  maybe(document.querySelector<HTMLElement>('#app-header .app-title')).map(title => title.innerText).orElse('this page');

export const Feedback: FC = () => {
  const {feedbackToken} = useEnv();
  const {pathname} = useLocation();
  const [params] = useSearchParams();
  const [page, setPage] = useState<Page>({key: pathname, name: 'this page'});
  const [thread, setThread] = useState(discussions);
  const [sending, setSending] = useState<Sending>({state: 'writing'});
  const [sentTo, setSentTo] = useState<string>();

  if (!has(feedbackToken)) {
    return null;
  }

  const key = maybe(params.get('tab')).map(tab => `${pathname}?tab=${tab}`).orElse(pathname);

  const opening = (event: MouseEvent<HTMLButtonElement>) => {
    event.currentTarget.focus();
    commandWithoutInvokers(event);
    const here = {key, name: pageName()};
    setPage(here);
    setSentTo(undefined);
    setSending({state: 'writing'});
    setThread(discussions);
    threadFor(feedbackToken, here)
      .onSuccess(found => found.map(({url}) => setThread(url)))
      .onFailure(() => setThread(discussions));
  };

  const send = (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const written = new FormData(form);
    const typed = (name: string): string => {
      const value = written.get(name);
      return typeof value === 'string' ? value : '';
    };
    setSending({state: 'sending'});
    const reach = typed('reach');
    sent(feedbackToken, {page, words: typed('words'), from: window.location.href, ...(empty(reach) ? {} : {reach})})
      .onSuccess(url => {
        setSentTo(url);
        setSending({state: 'writing'});
        form.reset();
        maybe(form.closest('dialog')).map(dialog => dialog.close());
      })
      .onFailure(why => setSending({state: 'refused', why}));
  };

  return <>
    <p className="feedback-item field">
      <button type="button" className="feedback-open path attentive field reachable" commandfor="feedback" command="show-modal" onClick={opening}>Feedback</button>
      {has(sentTo) && <output className="feedback-sent caption">Sent. <a className="signpost" href={sentTo}>Read it on GitHub</a></output>}
    </p>
    <dialog id="feedback" className="feedback-dialog backdrop" closedby="any" aria-labelledby="feedback-title" onClick={closesOnTheVeil} onToggle={fieldFirst}>
      <form className="feedback-form" onSubmit={send}>
        <hgroup className="feedback-heading field">
          <h2 id="feedback-title" className="sub-title bold">Feedback</h2>
          <p className="caption">It goes to <a className="signpost" href={thread}>this page’s thread on GitHub</a>, where you can read what others said.</p>
          <p className="paragraph">About: {page.name}</p>
        </hgroup>
        <button type="button" className="feedback-close button icon-button borderless field attentive reachable" commandfor="feedback" command="close" aria-label="Close" onClick={commandWithoutInvokers}>
          <img className="icon" src={cancelIcon} width="24" height="24" alt=""/>
        </button>
        <label className="feedback-field">
          <span className="feedback-label field bold">What did you find?</span>
          <textarea className="feedback-words bare card borderless paragraph" name="words" required enterKeyHint="send" onKeyDown={sendsOnEnter}/>
        </label>
        <label className="feedback-field">
          <span className="feedback-label field bold">A way to reach you, if you like</span>
          <input className="feedback-reach bare card borderless paragraph" type="text" name="reach" autoComplete="email" enterKeyHint="send"/>
        </label>
        {sending.state === 'refused' && <output className="feedback-refused field alarm-ink paragraph">{troubleWith('GitHub')(sending.why)}. Your words are still here.</output>}
        <button type="submit" className="feedback-send path attentive field borderless bold reachable" disabled={sending.state === 'sending'}>Send</button>
        <button type="button" className="feedback-cancel path attentive field borderless bold reachable" commandfor="feedback" command="close" onClick={commandWithoutInvokers}>Cancel</button>
      </form>
    </dialog>
  </>;
};
