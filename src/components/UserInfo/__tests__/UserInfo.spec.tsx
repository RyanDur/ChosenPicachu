import {UserInformation} from '../index';
import {act, render, screen} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {User} from '../types';
import {fillOutAddress, fillOutUser, users} from '../../../__tests__/util';
import {initialState} from '../reducer';
import {Consumer} from '@ryandur/sand';
import {nanoid} from 'nanoid';
jest.mock('../../../avatars', () => ({
    generateAvatar: () => 'some random url'
}));
jest.mock('nanoid');
describe('a user form', () => {
    const [userInfo] = users;
    userInfo.avatar = 'some random url';
    let firstNameInput: HTMLElement;
    let lastNameInput: HTMLElement;
    let dobInput: HTMLElement;

    let homeStreetNameInput: HTMLElement;
    let homeCityInout: HTMLElement;
    let homeStateInput: HTMLElement;
    let homeZipInput: HTMLElement;

    let consumer: Consumer<User>;

    beforeEach(() => {
        (nanoid as jest.Mock).mockReturnValue(userInfo.info.id);
        consumer = jest.fn();
        render(<UserInformation onAdd={consumer}/>);

        firstNameInput = screen.getByLabelText('First Name');
        lastNameInput = screen.getByLabelText('Last Name');
        dobInput = screen.getByLabelText('Date Of Birth');

        homeStreetNameInput = screen.getByTestId('home-address-street');
        homeCityInout = screen.getByTestId('home-address-city');
        homeStateInput = screen.getByTestId('home-address-state');
        homeZipInput = screen.getByTestId('home-address-zip');
    });

    describe('filled out', () => {
        beforeEach(() => {
            fillOutUser(userInfo);
            fillOutAddress(userInfo.homeAddress, 'home');
            fillOutAddress(userInfo.workAddress!, 'work');
            userEvent.type(screen.getByLabelText('Details'), userInfo.details!);
        });

        it('should be resettable', async () => {
            act(() => {
                userEvent.click(screen.getByText('Reset'));
            });
            userEvent.click(screen.getByText('Add'));
            expect(consumer).toHaveBeenCalledWith(initialState);
        });

        describe('when adding a user', () => {
            beforeEach(() => {
                act(() => {
                    userEvent.click(screen.getByText('Add'));
                });
            });

            it('should submit all the data', () => {
                expect(consumer).toHaveBeenCalledWith(userInfo);
            });

            it('should reset the form', () => {
                act(() => {
                    userEvent.click(screen.getByText('Add'));
                });
                expect(consumer).toHaveBeenCalledWith(initialState);
            });
        });

        describe('work address', () => {
            beforeEach(() => {
                userEvent.click(screen.getByLabelText('Same as Home'));
            });

            test('should allow the user to auto copy the home address', async () => {
                userEvent.click(screen.getByText('Add'));

                expect(consumer).toHaveBeenCalledWith({
                    ...userInfo,
                    workAddress: userInfo.homeAddress,
                });
            });
        });
    });

    describe('validity', () => {
        it('should have some required fields', () => {
            expect(firstNameInput).not.toBeValid();
            expect(lastNameInput).not.toBeValid();
            expect(dobInput).not.toBeValid();
            expect(homeStreetNameInput).not.toBeValid();
            expect(homeCityInout).not.toBeValid();
            expect(homeStateInput).not.toBeValid();
            expect(homeZipInput).not.toBeValid();
        });

        describe('for a zip code', () => {
            const testZip = (kind: string): void => {
                let element: HTMLElement;
                beforeEach(() => {
                    element = screen.getByTestId(`${kind}-address-zip`);
                    userEvent.clear(element);
                });

                test('a non-numeric', () => {
                    userEvent.type(element, 'a');
                    expect(element).toHaveDisplayValue('a');
                    expect(element).not.toBeValid();
                });

                test('a partial numeric', () => {
                    userEvent.type(element, '1');
                    expect(element).toHaveDisplayValue('1');
                    expect(element).not.toBeValid();
                });

                test('partial zip', () => {
                    userEvent.type(element, '60012');
                    expect(element).toHaveDisplayValue('60012');
                    expect(element).toBeValid();
                });
                test('full zip', () => {
                    userEvent.type(element, '12345-1234');
                    expect(element).toHaveDisplayValue('12345-1234');
                    expect(element).toBeValid();
                });
            };

            describe('for home', () => {
                testZip('home');
            });
            describe('for work', () => {
                testZip('work');
            });
        });
    });
});