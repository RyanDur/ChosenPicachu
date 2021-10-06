import {users, UsersAPI} from '../index';
import {createRandomUsers, createUser, users as allUsers} from '../../../__tests__/util';
import {User} from '../../../components/UserInfo/types';
import * as faker from 'faker';
import {OnAsyncEvent} from '@ryandur/sand';
import {Explanation, HTTPError} from '../../types';

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

    describe('updating a user and friends', () => {
        let users: OnAsyncEvent<User[], Explanation<HTTPError>>;
        const [firstUser, secondUser, thirdUser] = allUsers;

        beforeEach(() => {
            users = usersApi.update({...firstUser, friends: [secondUser]});
        });

        it('should add the user to friends list al well as the friend to the user', done => {
            users.onLoad(([first, second]) => {
                const firstUsersFriends = first.friends.map(f => f.id);
                expect(firstUsersFriends).toContain(second.id);

                const thirdUsersFriends = second.friends.map(f => f.id);
                expect(thirdUsersFriends).toContain(first.id);
                done();
            });
        });

        it('should remove the user from the friends list when the user has removed them', done => {
            users.onLoad(() => usersApi.update({...firstUser, friends: []}).onLoad(([first, second]) => {
                const firstUsersFriends = first.friends.map(f => f.id);
                expect(firstUsersFriends).not.toContain(second.id);

                const thirdUsersFriends = second.friends.map(f => f.id);
                expect(thirdUsersFriends).not.toContain(first.id);
                done();
            }));
        });

        it('should not add a friend twice', done => {
            users.onLoad(() => usersApi.update({
                ...firstUser,
                friends: [secondUser, thirdUser]
            }).onLoad(([first, second, third]) => {
                const firstUsersFriends = first.friends.map(f => f.id);
                expect(firstUsersFriends.length).toEqual(2);

                const secondUsersFriends = second.friends.map(f => f.id);
                expect(secondUsersFriends.length).toEqual(1);

                const thirdUsersFriends = third.friends.map(f => f.id);
                expect(thirdUsersFriends.length).toEqual(1);
            })).onLoad(([first, second, third])  => {
                users.onLoad(() => usersApi.update({
                    ...third,
                    friends: [first, second]
                }).onLoad( ([firstAgain, secondAgain, thirdAgain]) => {
                    const firstUsersFriends = firstAgain.friends.map(f => f.id);
                    expect(firstUsersFriends.length).toEqual(2);
                    expect(firstUsersFriends).toContain(secondAgain.id);
                    expect(firstUsersFriends).toContain(thirdAgain.id);

                    const secondUsersFriends = secondAgain.friends.map(f => f.id);
                    expect(secondUsersFriends.length).toEqual(2);
                    expect(secondUsersFriends).toContain(firstAgain.id);
                    expect(secondUsersFriends).toContain(thirdAgain.id);

                    const thirdUsersFriends = thirdAgain.friends.map(f => f.id);
                    expect(thirdUsersFriends.length).toEqual(2);
                    expect(thirdUsersFriends).toContain(firstAgain.id);
                    expect(thirdUsersFriends).toContain(secondAgain.id);
                })).onLoad(([moreFirst, moreSecond, morethird])  => {
                    users.onLoad(() => usersApi.update({
                        ...morethird,
                        friends: [moreFirst, moreSecond]
                    }).onLoad( ([moreFirstAgain, moreSecondAgain, morethirdAgain]) => {
                        const moreFirstUsersFriends = moreFirstAgain.friends.map(f => f.id);
                        expect(moreFirstUsersFriends.length).toEqual(2);
                        expect(moreFirstUsersFriends).toContain(moreSecondAgain.id);
                        expect(moreFirstUsersFriends).toContain(morethirdAgain.id);

                        const moreSecondUsersFriends = moreSecondAgain.friends.map(f => f.id);
                        expect(moreSecondUsersFriends.length).toEqual(2);
                        expect(moreSecondUsersFriends).toContain(moreFirstAgain.id);
                        expect(moreSecondUsersFriends).toContain(morethirdAgain.id);

                        const morethirdUsersFriends = morethirdAgain.friends.map(f => f.id);
                        expect(morethirdUsersFriends.length).toEqual(2);
                        expect(morethirdUsersFriends).toContain(moreFirstAgain.id);
                        expect(morethirdUsersFriends).toContain(moreSecondAgain.id);
                        done();
                    }));
                });
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