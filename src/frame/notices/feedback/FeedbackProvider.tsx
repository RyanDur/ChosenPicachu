import {FC, PropsWithChildren, useReducer} from 'react';
import {useLocation} from 'react-router';
import {drafting} from './drafting';
import {feedbackDraft} from './feedbackDraft';

export const FeedbackProvider: FC<PropsWithChildren> = ({children}) => {
  const {pathname} = useLocation();
  const kept = useReducer(feedbackDraft.reduce, pathname, feedbackDraft.initial);
  return <drafting.Provider value={kept}>{children}</drafting.Provider>;
};
