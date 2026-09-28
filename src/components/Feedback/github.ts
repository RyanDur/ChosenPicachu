import {asyncFailure, Maybe, maybe, Result} from '@ryandur/sand';
import * as schema from 'schemawax';
import {http} from '@transport/http';
import {HTTPError} from '@transport/types';
import {validate} from '@transport/validate';

const endpoint = 'https://api.github.com/graphql';
const repositoryId = 'MDEwOlJlcG9zaXRvcnkzNzY2NzE1OTU=';
const feedbackCategoryId = 'DIC_kwDOFnONa84DGhfO';

export const discussions = 'https://github.com/RyanDur/ChosenPicachu/discussions';

export type Page = {key: string; name: string};
export type Note = {page: Page; words: string; reach?: string; from: string};

type Thread = {id: string; url: string};

const refusal = schema.object({
  required: {errors: schema.array(schema.object({optional: {type: schema.string}}))}
});

const failureIn = ({errors}: schema.Output<typeof refusal>): HTTPError =>
  errors.some(({type}) => type === 'NOT_FOUND') ? HTTPError.NOT_FOUND : HTTPError.FORBIDDEN;

const answered = <T>(data: schema.Decoder<T>) => schema.object({required: {data}});

const asked = <T>(token: string, query: string, variables: Record<string, string>, data: schema.Decoder<T>): Result.Async<T, HTTPError> =>
  http.post<unknown>(endpoint, {query, variables}, {headers: {authorization: `bearer ${token}`}})
    .mBind(reply => maybe(refusal.decode(reply))
      .map(refused => asyncFailure<HTTPError, T>(failureIn(refused)))
      .orElse(validate(answered(data))(reply).map(answer => answer.data)));

export const titleOf = ({key, name}: Page): string => `Feedback: ${name} (${key})`;

const searching = `query($search: String!) {
  search(query: $search, type: DISCUSSION, first: 5) { nodes { ... on Discussion { id url title } } }
}`;

const found = schema.object({
  required: {
    search: schema.object({
      required: {nodes: schema.array(schema.object({required: {id: schema.string, url: schema.string, title: schema.string}}))}
    })
  }
});

export const threadFor = (token: string, page: Page): Result.Async<Maybe<Thread>, HTTPError> =>
  asked(token, searching, {search: `repo:RyanDur/ChosenPicachu in:title "(${page.key})"`}, found)
    .map(({search}) => maybe(search.nodes.find(node => node.title.endsWith(`(${page.key})`)))
      .map(({id, url}) => ({id, url})));

const opening = `mutation($repositoryId: ID!, $categoryId: ID!, $title: String!, $body: String!) {
  createDiscussion(input: {repositoryId: $repositoryId, categoryId: $categoryId, title: $title, body: $body}) { discussion { id url } }
}`;

const opened = schema.object({
  required: {createDiscussion: schema.object({required: {discussion: schema.object({required: {url: schema.string}})}})}
});

const replying = `mutation($discussionId: ID!, $body: String!) {
  addDiscussionComment(input: {discussionId: $discussionId, body: $body}) { comment { url } }
}`;

const commented = schema.object({
  required: {addDiscussionComment: schema.object({required: {comment: schema.object({required: {url: schema.string}})}})}
});

const bodyOf = ({words, reach, from}: Note): string =>
  [words, ...maybe(reach).map(way => [`A way to reach them: ${way}`]).orElse([]), `Sent from ${from}`].join('\n\n');

export const sent = (token: string, note: Note): Result.Async<string, HTTPError> =>
  threadFor(token, note.page).mBind(thread => thread.either(
    ({id, url}) => asked(token, replying, {discussionId: id, body: bodyOf(note)}, commented).map(() => url),
    () => asked(token, opening, {repositoryId, categoryId: feedbackCategoryId, title: titleOf(note.page), body: bodyOf(note)}, opened)
      .map(({createDiscussion}) => createDiscussion.discussion.url)));
