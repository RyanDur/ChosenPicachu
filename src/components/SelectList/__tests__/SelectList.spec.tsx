import userEvent from '@testing-library/user-event';
import {render, screen} from '@testing-library/react';
import {FriendsList} from '../index';
import {users} from '../../../__tests__/util';

describe('the friends list', () => {
    const consumer = jest.fn();
    const firstUser = users[0];
    const secondUser = users[1];

    afterEach(() => jest.resetAllMocks());

    it('should be able to add friends', () => {
        render(<FriendsList users={users} friends={[]} onChange={consumer}/>);
        userEvent.selectOptions(screen.getByTestId('select-friend'), [
            `${secondUser.info.firstName} ${secondUser.info.lastName}`
        ]);

        expect(screen.getByTestId('friends-list')).toHaveTextContent(`${secondUser.info.firstName} ${secondUser.info.lastName}`);
        expect(consumer).toHaveBeenCalledWith([secondUser]);

        userEvent.selectOptions(screen.getByTestId('select-friend'), [
            `${firstUser.info.firstName} ${firstUser.info.lastName}`
        ]);

        expect(screen.getByTestId('friends-list')).toHaveTextContent(`${firstUser.info.firstName} ${firstUser.info.lastName}`);
        expect(consumer).toHaveBeenCalledWith([secondUser, firstUser]);
    });

    it('should display the friends the user already has', () => {
        render(<FriendsList users={users} friends={[firstUser, secondUser]} onChange={consumer}/>);
        expect(screen.getByTestId('friends-list')).toHaveTextContent(`${firstUser.info.firstName} ${firstUser.info.lastName}`);
        expect(screen.getByTestId('friends-list')).toHaveTextContent(`${secondUser.info.firstName} ${secondUser.info.lastName}`);
    });

    describe('removing a friend from the list', () => {
        beforeEach(() => {
            render(<FriendsList users={users} friends={[firstUser, secondUser]} onChange={consumer}/>);
        });

        test('on mouse click', () => {
            userEvent.click(screen.getByTestId(`remove-${firstUser.info.email}` || ''));
            expect(screen.getByTestId('friends-list')).not.toHaveTextContent(`${firstUser.info.firstName} ${firstUser.info.lastName}`);
            expect(screen.getByTestId('friends-list')).toHaveTextContent(`${secondUser.info.firstName} ${secondUser.info.lastName}`);
        });

        test('on enter', () => {
            userEvent.type(screen.getByTestId(`remove-${firstUser.info.email}` || ''), '{enter}');
            expect(screen.getByTestId('friends-list')).not.toHaveTextContent(`${firstUser.info.firstName} ${firstUser.info.lastName}`);
            expect(screen.getByTestId('friends-list')).toHaveTextContent(`${secondUser.info.firstName} ${secondUser.info.lastName}`);
        });
    });

    it('should not allow a user to select something twice', () => {
        render(<FriendsList users={users} friends={[]} onChange={consumer}/>);
        const selectFriend = screen.getByTestId('select-friend');
        userEvent.selectOptions(selectFriend, [
            `${secondUser.info.firstName} ${secondUser.info.lastName}`
        ]);

        expect(selectFriend).not.toHaveTextContent(`${secondUser.info.firstName} ${secondUser.info.lastName}`);
    });

    it('should not be able to select no one', async () => {
        render(<FriendsList users={[]} onChange={consumer}/>);

        expect(screen.queryByTestId('select-friend')).not.toBeInTheDocument();
    });
});