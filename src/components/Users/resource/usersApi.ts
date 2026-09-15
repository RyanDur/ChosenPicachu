import * as schema from 'schemawax';
import {Result} from '@ryandur/sand';
import {env} from '@env';
import {http} from '@transport/http';
import {validate} from '@transport/validate';
import {HTTPError} from '@transport/types';
import {NewUser, User} from '@components/Users/UserInfo/user';

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

const getAll = (): Result.Async<User[], HTTPError> => http.get(usersDomain).mBind(validate(schema.array(UserDecoder)));

export const users: UsersAPI = {
  getAll,
  get: id => http.get(`${usersDomain}/${id}`).mBind(validate(UserDecoder)),
  add: user => http.post(usersDomain, user).mBind(validate(schema.array(UserDecoder))),
  update: user => http.put(`${usersDomain}/${user.id}`, user).mBind(getAll),
  delete: user => http.delete(`${usersDomain}/${user.id}`).mBind(getAll)
};
