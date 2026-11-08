import * as schema from 'schemawax';
import {isValid} from 'date-fns';
import {asyncFailure, asyncResult, asyncSuccess, maybe, Result} from '@ryandur/sand';
import {env} from '@frame/state/env';
import {http} from '@transport';
import {decoded} from '@transport';
import {HTTPError} from '@transport';
import {NewUser, User} from '../profile';
import {usersServer} from '../usersServer';

export type UsersAPI = {
  getAll: () => Result.Async<User[], HTTPError>;
  get: (id: string) => Result.Async<User, HTTPError>;
  add: (user: NewUser) => Result.Async<User[], HTTPError>;
  update: (user: User) => Result.Async<User[], HTTPError>;
  delete: (user: User) => Result.Async<User[], HTTPError>;
};

const AddressDecoder = schema.object({
  required: {streetAddress: schema.string, city: schema.string, state: schema.string, zip: schema.string},
  optional: {streetAddressTwo: schema.string}
});

const PersonDecoder = schema.object({
  required: {firstName: schema.string, lastName: schema.string, email: schema.string},
  optional: {dateOfBirth: schema.string.andThen(day => new Date(day))}
}).andThen(({dateOfBirth, ...person}) => isValid(dateOfBirth) ? {...person, dateOfBirth} : person);

const UserDecoder = schema.object({
  required: {
    id: schema.string,
    person: PersonDecoder,
    friends: schema.array(schema.string),
    homeAddress: AddressDecoder,
    avatar: schema.string
  },
  optional: {work: schema.oneOf(schema.literal('home'), AddressDecoder), details: schema.string}
});

const {usersDomain} = env;
const usersServerUrl = `${import.meta.env.BASE_URL}${usersServer.script}`;
const patience = 10_000;

const claimed = (workers: ServiceWorkerContainer): Result.Async<ServiceWorkerRegistration, unknown> =>
  asyncResult<ServiceWorkerRegistration, unknown>(workers.ready)
    .onSuccess(({active}) => active?.postMessage(usersServer.loadedUncontrolled));

const servedInTime = (workers: ServiceWorkerContainer): Result.Async<void, HTTPError> => workers.controller
  ? asyncSuccess(undefined)
  : asyncResult<void, unknown>(new Promise((resolve, reject) => {
    setTimeout(reject, patience);
    workers.addEventListener('controllerchange', () => resolve(), {once: true});
    asyncResult<ServiceWorkerRegistration, unknown>(workers.register(usersServerUrl))
      .onSuccess(() => workers.controller ? resolve() : claimed(workers))
      .onFailure(reject);
  })).or(() => asyncFailure(HTTPError.NETWORK_ERROR));

const whenServed = <T>(asked: () => Result.Async<T, HTTPError>): Result.Async<T, HTTPError> =>
  maybe(navigator.serviceWorker)
    .map(servedInTime)
    .orElse(asyncSuccess(undefined))
    .mBind(asked);

const getAll = (): Result.Async<User[], HTTPError> =>
  whenServed(() => http.get(usersDomain)).mBind(decoded.by(schema.array(UserDecoder)));

export const usersApi: UsersAPI = {
  getAll,
  get: id => whenServed(() => http.get(`${usersDomain}/${id}`)).mBind(decoded.by(UserDecoder)),
  add: user => whenServed(() => http.post(usersDomain, user)).mBind(decoded.by(schema.array(UserDecoder))),
  update: user => whenServed(() => http.put(`${usersDomain}/${user.id}`, user)).mBind(getAll),
  delete: user => whenServed(() => http.delete(`${usersDomain}/${user.id}`)).mBind(getAll)
};
