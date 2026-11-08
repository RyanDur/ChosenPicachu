import {faker} from '@faker-js/faker';
import {startOfDay} from 'date-fns';
import {Address, User} from '@pages/Users/profile';

type Traits = {
  readonly id?: string;
  readonly firstName?: string;
  readonly dateOfBirth?: Date;
  readonly work?: 'home' | Address;
  readonly friends?: readonly string[];
};

export const anAddress = (): Address => ({
  streetAddress: faker.location.streetAddress(),
  streetAddressTwo: faker.location.secondaryAddress(),
  city: faker.location.city(),
  state: faker.location.state({abbreviated: true}),
  zip: faker.location.zipCode('#####')
});

export const aUser = ({
  id = faker.string.nanoid(),
  firstName = faker.person.firstName(),
  dateOfBirth = startOfDay(faker.date.birthdate()),
  work = anAddress(),
  friends = []
}: Traits = {}): User => ({
  id,
  person: {firstName, lastName: faker.person.lastName(), email: faker.internet.email({firstName}), dateOfBirth},
  friends: [...friends],
  homeAddress: anAddress(),
  work,
  details: faker.lorem.words(3),
  avatar: faker.image.avatar()
});

export const someUsers = [aUser(), aUser({work: 'home'}), aUser()];
