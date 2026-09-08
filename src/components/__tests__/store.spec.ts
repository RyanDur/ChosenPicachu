import {describe, expect, it} from 'vitest';
import {Reducer, Slice, sliced, store} from '../store';

type Count = {readonly count: number};
type Words = {readonly words: readonly string[]};
type Page = {readonly counting: Count; readonly saying: Words};
type Action = {readonly type: 'counted'} | {readonly type: 'said'; readonly word: string};

const count: Reducer<Count, Action> = (state, action) =>
  action.type === 'counted' ? {count: state.count + 1} : state;
const say: Reducer<Words, Action> = (state, action) =>
  action.type === 'said' ? {words: [...state.words, action.word]} : state;
const counting: Slice<Count, Action> = {initial: {count: 0}, reduce: count};
const saying: Slice<Words, Action> = {initial: {words: []}, reduce: say};

describe('a store sliced by key', () => {
  it('starts from the slices’ own initial states', () => {
    const page = store({slice: sliced<Page, Action>({counting, saying})});

    expect(page.state).toEqual({counting: {count: 0}, saying: {words: []}});
  });

  it('hands each slice its own state and the whole action, and keeps a slice that did not answer', () => {
    const page = store({slice: sliced<Page, Action>({counting, saying})});
    const before = page.state.saying;

    page.dispatch({type: 'counted'});
    page.dispatch({type: 'said', word: 'hello'});
    page.dispatch({type: 'counted'});

    expect(page.state).toEqual({counting: {count: 2}, saying: {words: ['hello']}});
    expect(page.state.saying).not.toBe(before);
  });

  it('a slice that ignores an action keeps its identity', () => {
    const page = store({slice: sliced<Page, Action>({counting, saying})});
    const before = page.state.saying;

    page.dispatch({type: 'counted'});

    expect(page.state.saying).toBe(before);
  });
});
