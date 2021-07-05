import {UserInformation} from '../index';
import {act, render, screen} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {Consumer, UserInfo} from '../types';
import {users} from '../../../__tests__/util';
import {initialState} from '../reducer';

describe('a user form', () => {
    const [userInfo] = users;
    let firstNameInput: HTMLElement;
    let lastNameInput: HTMLElement;
    let emailInput: HTMLElement;

    let homeStreetNameInput: HTMLElement;
    let homeStreetName2Input: HTMLElement;
    let homeCityInout: HTMLElement;
    let homeStateInput: HTMLElement;
    let homeZipInput: HTMLElement;
    let workStreetNameInput: HTMLElement;

    let workStreetName2Input: HTMLElement;
    let workCityInout: HTMLElement;
    let workStateInput: HTMLElement;
    let workZipInput: HTMLElement;

    let userDetails: HTMLElement;
    let consumer: Consumer<UserInfo>;

    beforeEach(() => {
        consumer = jest.fn();
        render(<UserInformation onAdd={consumer}/>);

        firstNameInput = screen.getByLabelText('First Name');
        lastNameInput = screen.getByLabelText('Last Name');
        emailInput = screen.getByLabelText('Email');

        homeStreetNameInput = screen.getByTestId('home-street-address');
        homeStreetName2Input = screen.getByTestId('home-street-address-2');
        homeCityInout = screen.getByTestId('home-city');
        homeStateInput = screen.getByTestId('home-state');
        homeZipInput = screen.getByTestId('home-zip');

        workStreetNameInput = screen.getByTestId('work-street-address');
        workStreetName2Input = screen.getByTestId('work-street-address-2');
        workCityInout = screen.getByTestId('work-city');
        workStateInput = screen.getByTestId('work-state');
        workZipInput = screen.getByTestId('work-zip');

        userDetails = screen.getByLabelText('Details');
    });

    describe('filled out', () => {
        beforeEach(() => {
            userEvent.type(firstNameInput, userInfo.user.firstName);
            userEvent.type(lastNameInput, userInfo.user.lastName);
            userEvent.type(emailInput, userInfo.user.email!);

            userEvent.type(homeStreetNameInput, userInfo.homeAddress.streetAddress);
            userEvent.type(homeStreetName2Input, userInfo.homeAddress.streetAddressTwo!);
            userEvent.type(homeCityInout, userInfo.homeAddress.city);
            userEvent.selectOptions(homeStateInput, userInfo.homeAddress.state);

            userEvent.type(workStreetNameInput, userInfo.workAddress!.streetAddress);
            userEvent.type(workStreetName2Input, userInfo.workAddress!.streetAddressTwo!);
            userEvent.type(workCityInout, userInfo.workAddress!.city);
            userEvent.selectOptions(workStateInput, userInfo.workAddress!.state);
            userEvent.type(workZipInput, userInfo.workAddress!.zip);

            userEvent.type(homeZipInput, userInfo.homeAddress.zip);
            userEvent.type(userDetails, userInfo.details!);
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
            expect(homeStreetNameInput).not.toBeValid();
            expect(homeCityInout).not.toBeValid();
            expect(homeStateInput).not.toBeValid();
            expect(homeZipInput).not.toBeValid();
        });

        describe('for a zip code', () => {
            describe('for home', () => testZip('home'));
            describe('for work', () => testZip('work'));

            function testZip(kind: string) {
                let element: HTMLElement;
                beforeEach(() => {
                    element = screen.getByTestId(`${kind}-zip`);
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
            }
        });
    });

});