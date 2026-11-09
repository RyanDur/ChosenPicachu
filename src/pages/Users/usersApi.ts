import * as schema from 'schemawax';
import {isValid} from 'date-fns';
import {Result} from '@ryandur/sand';
import {environment, http} from '@transport';
import {decoded} from '@transport';
import {HTTPError} from '@transport';
import {NewUser, User} from './profile';

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

const {usersDomain} = environment;

const getAll = (): Result.Async<User[], HTTPError> =>
  http.get(usersDomain).mBind(decoded.by(schema.array(UserDecoder)));

export const usersApi: UsersAPI = {
  getAll,
  get: id => http.get(`${usersDomain}/${id}`).mBind(decoded.by(UserDecoder)),
  add: user => http.post(usersDomain, user).mBind(decoded.by(schema.array(UserDecoder))),
  update: user => http.put(`${usersDomain}/${user.id}`, user).mBind(getAll),
  delete: user => http.delete(`${usersDomain}/${user.id}`).mBind(getAll)
};
