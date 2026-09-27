import {FC, FormEvent, KeyboardEvent, MouseEvent, SyntheticEvent, useState} from 'react';
import {useLocation, useSearchParams} from 'react-router';
import {has, maybe} from '@ryandur/sand';
import {useEnv} from '@components/Env';
import {Page, discussions, sent, threadFor} from './github';
import './Feedback.css';

type Sending = {state: 'writing'} | {state: 'sending'} | {state: 'refused'; why: string};

const sendsOnEnter = (event: KeyboardEvent<HTMLTextAreaElement>) => {
  if (event.key === 'Enter' && !event.shiftKey && !event.nativeEvent.isComposing) {
    event.preventDefault();
    event.currentTarget.form?.requestSubmit();
  }
};

const closesOnTheVeil = (event: MouseEvent<HTMLDialogElement>) => {
  if (event.target === event.currentTarget) {
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
    const here = {key, name: pageName()};
    setPage(here);
    setSentTo(undefined);
    setSending({state: 'writing'});
    setThread(discussions);
    void threadFor(feedbackToken, here)
      .then(found => found.map(({url}) => setThread(url)))
      .catch(() => undefined);
  };

  const send = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const written = new FormData(form);
    const typed = (name: string): string => {
      const value = written.get(name);
      return typeof value === 'string' ? value : '';
    };
    setSending({state: 'sending'});
    sent(feedbackToken, {page, words: typed('words'), reach: typed('reach'), from: window.location.href})
      .then(url => {
        setSentTo(url);
        setSending({state: 'writing'});
        form.reset();
        maybe(form.closest('dialog')).map(dialog => dialog.close());
      })
      .catch((refusal: unknown) => setSending({state: 'refused', why: refusal instanceof Error ? refusal.message : 'GitHub did not answer'}));
  };

  return <li className="feedback-item">
    <button type="button" className="path attentive field reachable" commandfor="feedback" command="show-modal" onClick={opening}>Feedback</button>
    {has(sentTo) && <output className="feedback-sent caption">Sent. <a className="signpost" href={sentTo}>Read it on GitHub</a></output>}
    <dialog id="feedback" className="feedback card rounded-corners" closedby="any" aria-labelledby="feedback-title" onClick={closesOnTheVeil} onToggle={fieldFirst}>
      <form className="feedback-form" onSubmit={send}>
        <hgroup className="feedback-heading">
          <h2 id="feedback-title" className="sub-title bold">Feedback</h2>
          <p className="caption">It goes to <a className="signpost" href={thread}>this page’s thread on GitHub</a>, where you can read what others said.</p>
          <p className="paragraph">About: {page.name}</p>
        </hgroup>
        <button type="button" className="feedback-close reachable" commandfor="feedback" command="close" aria-label="Close">×</button>
        <label className="feedback-field caption">What did you find?
          <textarea className="feedback-words paragraph" name="words" required enterKeyHint="send" onKeyDown={sendsOnEnter}/>
        </label>
        <label className="feedback-field caption">A way to reach you, if you like
          <input className="feedback-reach paragraph" type="text" name="reach" autoComplete="email" enterKeyHint="send"/>
        </label>
        {sending.state === 'refused' && <output className="feedback-refused caption">GitHub did not take the note: {sending.why}. Your words are still here.</output>}
        <button type="submit" className="feedback-send reachable" disabled={sending.state === 'sending'}>Send</button>
        <button type="button" className="feedback-cancel reachable" commandfor="feedback" command="close">Cancel</button>
      </form>
    </dialog>
  </li>;
};
