import {ActionDispatch, createContext} from 'react';
import {FeedbackChange} from './feedbackChange';
import {Draft, feedbackDraft} from './feedbackDraft';

export const drafting = createContext<[Draft, ActionDispatch<[FeedbackChange]>]>([feedbackDraft.initial('/'), () => undefined]);
