import userEvent from '@testing-library/user-event';
import {cleanup, render, screen} from '@testing-library/react';
import {FriendsList} from '@components/Users/SelectList/index';
import {users} from '@test-support/fixtures';

describe('the friends list', () => {
    const consumer = vi.fn();
    const firstUser = users[0];
    const secondUser = users[1];
    const thirdUser = users[2];
    const fullName = ({info}: typeof firstUser) => `${info.firstName} ${info.lastName}`;

    afterEach(() => {
        cleanup();
        vi.resetAllMocks();
    });

    it('should be able to add friends', async () => {
        render(<FriendsList users={users} user={firstUser} onChange={consumer}/>);
        await userEvent.selectOptions(screen.getByTestId(/select-friend/), [fullName(secondUser)]);

        expect(consumer).toHaveBeenCalledWith([secondUser.id]);
    });

    it('should not allow you to pick yourself', () => {
        render(<FriendsList users={users} user={firstUser} onChange={consumer}/>);
        expect(screen.getByTestId(/select-friend/)).not.toHaveTextContent(fullName(firstUser));
    });

    it('should display the friends the user already has', () => {
        const userWithFriends = {...firstUser, friends: [secondUser.id!, thirdUser.id!]};
        render(<FriendsList users={users} user={userWithFriends} onChange={consumer}/>);
        expect(screen.getByTestId('friends-list')).toHaveTextContent(fullName(thirdUser));
        expect(screen.getByTestId('friends-list')).toHaveTextContent(fullName(secondUser));
    });

    it('should display friends by their current name, not a snapshot', () => {
        const renamedSecond = {
            ...secondUser,
            info: {...secondUser.info, firstName: 'Renamed', lastName: 'Person'}
        };
        const userWithFriends = {...firstUser, friends: [secondUser.id!]};
        render(<FriendsList users={[firstUser, renamedSecond, thirdUser]} user={userWithFriends}
                            onChange={consumer}/>);
        expect(screen.getByTestId('friends-list')).toHaveTextContent('Renamed Person');
    });

    describe('removing a friend from the list', () => {
        beforeEach(() => {
            const userWithFriends = {...firstUser, friends: [secondUser.id!, thirdUser.id!]};
            render(<FriendsList users={users} user={userWithFriends} onChange={consumer}/>);
        });

        test('on mouse click', async () => {
            await userEvent.click(screen.getByTestId(`remove-${thirdUser.id}`));

            expect(consumer).toHaveBeenCalledWith([secondUser.id]);
        });

        test('on enter', async () => {
            screen.getByTestId(`remove-${thirdUser.id}`).focus();
            await userEvent.keyboard('{enter}');

            expect(consumer).toHaveBeenCalledWith([secondUser.id]);
        });

        test('on space', async () => {
            screen.getByTestId(`remove-${thirdUser.id}`).focus();
            await userEvent.keyboard(' ');

            expect(consumer).toHaveBeenCalledWith([secondUser.id]);
        });
    });

    it('should not allow a user to select something twice', () => {
        const userWithFriends = {...firstUser, friends: [secondUser.id!]};
        render(<FriendsList users={users} user={userWithFriends} onChange={consumer}/>);
        expect(screen.getByTestId(/select-friend/)).not.toHaveTextContent(fullName(secondUser));
    });

    it('should not allow to select a friend if no more friends are left', () => {
        const userWithFriends = {...firstUser, friends: [secondUser.id!, thirdUser.id!]};
        render(<FriendsList users={[firstUser, secondUser, thirdUser]} user={userWithFriends}
                            onChange={consumer}/>);

        expect(screen.queryByTestId(/select-friend/)).not.toBeInTheDocument();
    });
});
