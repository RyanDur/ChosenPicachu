import {users, UsersAPI} from '../index';
import {createRandomUsers, createUser, users as allUsers} from '../../../__tests__/util';
import {User} from '../../../components/UserInfo/types';
import * as faker from 'faker';

jest.mock('../../../__tests__/util', () => ({
    ...jest.requireActual('../../../__tests__/util'),
    createRandomUsers: jest.fn()
}));

describe('users data', () => {
    let usersApi: UsersAPI;
    beforeEach(() => {
        (createRandomUsers as jest.Mock)
            .mockReturnValueOnce(allUsers)
            .mockReturnValue([]);
        usersApi = users(allUsers);
    });

    test('getting the users', done => {
        usersApi.getAll().onLoad(data => {
            expect(data).toEqual(allUsers);
            expect(data).not.toBeUndefined();
            done();
        });

        usersApi.getAll().onLoad(data => {
            expect(data).toEqual(allUsers);
            expect(data).not.toBeUndefined();
            done();
        });
    });

    test('adding a user', done => {
        const user: User = {
            info: {
                firstName: faker.lorem.word(),
                lastName: faker.lorem.word(),
                email: faker.internet.email()
            },
            avatar: faker.internet.avatar(),
            friends: [],
            homeAddress: {
                streetAddress: faker.address.streetAddress(),
                city: faker.address.city(),
                state: faker.address.state(),
                zip: faker.address.zipCode()
            }
        };

        usersApi.add(user).onLoad(data => {
            expect(data.length).toEqual(allUsers.length + 1);
            expect(data[0].id).not.toBeUndefined();
            done();
        });

        const anotherUser = createUser();
        usersApi.add(anotherUser).onLoad(data => {
            expect(data.length).toEqual(allUsers.length + 2);
            done();
        });
    });

    test('getting a user', done => {
        const firstUser = allUsers[0];
        const lastUser = allUsers[allUsers.length - 1];

        usersApi.get(firstUser.id || '').onLoad(data => {
            expect(data).toEqual(firstUser);
            expect(data).not.toBeUndefined();
            done();
        });

        usersApi.get(lastUser.id || '').onLoad(data => {
            expect(data).toEqual(lastUser);
            expect(data).not.toBeUndefined();
            done();
        });
    });

    test('updating a user', done => {
        usersApi.update({...allUsers[0], friends: [allUsers[allUsers.length - 1]]}).onLoad(data => {
            const firstUsersFriends = data[0].friends.map(f => f.id);
            expect(firstUsersFriends).toContain(data[data.length - 1].id);

            const lastUsersFriends = data[data.length - 1].friends.map(f => f.id);
            expect(lastUsersFriends).toContain(data[0].id);
        }).onLoad(() => {
            usersApi.update({...allUsers[0], friends: []}).onLoad(data => {
                const firstUsersFriends = data[0].friends.map(f => f.id);
                expect(firstUsersFriends).not.toContain(data[data.length - 1].id);

                const lastUsersFriends = data[data.length - 1].friends.map(f => f.id);
                expect(lastUsersFriends).not.toContain(data[0].id);
                done();
            });
        });
    });

    describe('deleting a user', () => {
        it('should remove the user', done => {
            const secondUser = allUsers[1];

            usersApi.delete(secondUser).onLoad(data => {
                expect(data).not.toContain(secondUser);
                done();
            });
        });

        it('should remove the user from the other users friends list', done => {
            const firstUser = allUsers[0];
            usersApi
                .update({...firstUser, friends: [allUsers[allUsers.length - 1]]})
                .onLoad(() => usersApi.delete(firstUser).onLoad(data => {
                    const lastUsersFriends = data[data.length - 1].friends.map(f => f.id);
                    expect(lastUsersFriends).not.toContain(firstUser.id);
                    done();
                }));
        });
    });
});