import * as schema from 'schemawax';
import {asyncFailure, asyncResult, asyncSuccess, maybe, Result} from '@ryandur/sand';
import {env} from '@env';
import {http} from '@transport/http';
import {validate} from '@transport/validate';
import {HTTPError} from '@transport/types';
import {NewUser, User} from '@components/Users/UserInfo/user';
import {loadedUncontrolled, usersServerScript} from './usersServer';

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

const InfoDecoder = schema.object({
  required: {firstName: schema.string, lastName: schema.string, email: schema.string},
  optional: {dob: schema.string.andThen(day => new Date(day))}
});

const UserDecoder = schema.object({
  required: {
    id: schema.string,
    info: InfoDecoder,
    friends: schema.array(schema.string),
    homeAddress: AddressDecoder,
    avatar: schema.string
  },
  optional: {work: schema.oneOf(schema.literal('home'), AddressDecoder), details: schema.string}
});

const {usersDomain} = env;
const usersServerUrl = `${import.meta.env.BASE_URL}${usersServerScript}`;
const patience = 10_000;

const claimed = (workers: ServiceWorkerContainer): Promise<unknown> => new Promise(resolve => {
  workers.addEventListener('controllerchange', resolve, {once: true});
  void workers.ready.then(({active}) => active?.postMessage(loadedUncontrolled));
});

const gaveUp = (): Promise<never> => new Promise((_, reject) => {
  setTimeout(reject, patience);
});

const served = (workers: ServiceWorkerContainer): Promise<unknown> => workers.register(usersServerUrl)
  .then(() => workers.controller ? undefined : claimed(workers));

const servedInTime = (workers: ServiceWorkerContainer): Result.Async<unknown, HTTPError> => workers.controller
  ? asyncSuccess(undefined)
  : asyncResult<unknown, unknown>(Promise.race([served(workers), gaveUp()])).or(() => asyncFailure(HTTPError.NETWORK_ERROR));

const whenServed = <T>(asked: () => Result.Async<T, HTTPError>): Result.Async<T, HTTPError> =>
  maybe(navigator.serviceWorker)
    .map(servedInTime)
    .orElse(asyncSuccess(undefined))
    .mBind(asked);

const getAll = (): Result.Async<User[], HTTPError> =>
  whenServed(() => http.get(usersDomain)).mBind(validate(schema.array(UserDecoder)));

export const users: UsersAPI = {
  getAll,
  get: id => whenServed(() => http.get(`${usersDomain}/${id}`)).mBind(validate(UserDecoder)),
  add: user => whenServed(() => http.post(usersDomain, user)).mBind(validate(schema.array(UserDecoder))),
  update: user => whenServed(() => http.put(`${usersDomain}/${user.id}`, user)).mBind(getAll),
  delete: user => whenServed(() => http.delete(`${usersDomain}/${user.id}`)).mBind(getAll)
};
