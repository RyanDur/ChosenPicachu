import userEvent from '@testing-library/user-event';
import {render, screen} from '@testing-library/react';
import {FriendsList} from '../index';
import {users} from '../../../__tests__/util';

describe('the friends list', () => {
    const consumer = jest.fn();
    const firstUser = users[0];
    const secondUser = users[1];
    const thirdUser = users[2];

    afterEach(() => jest.resetAllMocks());

    it('should be able to add friends', () => {
        render(<FriendsList users={users} user={firstUser} onChange={consumer}/>);
        userEvent.selectOptions(screen.getByTestId('select-friend'), [
            `${secondUser.info.firstName} ${secondUser.info.lastName}`
        ]);

        expect(screen.getByTestId('friends-list')).toHaveTextContent(`${secondUser.info.firstName} ${secondUser.info.lastName}`);
        expect(consumer).toHaveBeenCalledWith([secondUser]);

        userEvent.selectOptions(screen.getByTestId('select-friend'), [
            `${thirdUser.info.firstName} ${thirdUser.info.lastName}`
        ]);

        expect(screen.getByTestId('friends-list')).toHaveTextContent(`${thirdUser.info.firstName} ${thirdUser.info.lastName}`);
        expect(consumer).toHaveBeenCalledWith([secondUser, thirdUser]);
    });

    it('should not allow you to pick yourself', () => {
        render(<FriendsList users={users} user={firstUser} onChange={consumer}/>);
        expect(screen.getByTestId('select-friend')).not.toHaveTextContent(`${firstUser.info.firstName} ${firstUser.info.lastName}`);
    });

    it('should display the friends the user already has', () => {
        const userWithFriends = {...firstUser, friends: [secondUser, thirdUser]};
        render(<FriendsList users={users} user={userWithFriends} onChange={consumer}/>);
        expect(screen.getByTestId('friends-list')).toHaveTextContent(`${thirdUser.info.firstName} ${thirdUser.info.lastName}`);
        expect(screen.getByTestId('friends-list')).toHaveTextContent(`${secondUser.info.firstName} ${secondUser.info.lastName}`);
    });

    describe('removing a friend from the list', () => {
        beforeEach(() => {
            const userWithFriends = {...firstUser, friends: [secondUser, thirdUser]};
            render(<FriendsList users={users} user={userWithFriends} onChange={consumer}/>);
        });

        test('on mouse click', () => {
            userEvent.click(screen.getByTestId(`remove-${thirdUser.info.email}` || ''));
            expect(screen.getByTestId('friends-list')).not.toHaveTextContent(`${thirdUser.info.firstName} ${firstUser.info.lastName}`);
            expect(screen.getByTestId('friends-list')).toHaveTextContent(`${secondUser.info.firstName} ${secondUser.info.lastName}`);
        });

        test('on enter', () => {
            userEvent.type(screen.getByTestId(`remove-${thirdUser.info.email}` || ''), '{enter}');
            expect(screen.getByTestId('friends-list')).not.toHaveTextContent(`${thirdUser.info.firstName} ${firstUser.info.lastName}`);
            expect(screen.getByTestId('friends-list')).toHaveTextContent(`${secondUser.info.firstName} ${secondUser.info.lastName}`);
        });
    });

    it('should not allow a user to select something twice', () => {
        render(<FriendsList users={users} user={firstUser} onChange={consumer}/>);
        const selectFriend = screen.getByTestId('select-friend');
        userEvent.selectOptions(selectFriend, [
            `${secondUser.info.firstName} ${secondUser.info.lastName}`
        ]);

        expect(selectFriend).not.toHaveTextContent(`${secondUser.info.firstName} ${secondUser.info.lastName}`);
    });
});