import {UserInformation} from '../index';
import {act, render, screen, waitFor} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {Consumer, UserInfo} from '../types';
import {details, homeAddress, user, workAddress} from '../../../__tests__/util';

describe('a user form', () => {
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
            userEvent.type(firstNameInput, user.firstName);
            userEvent.type(lastNameInput, user.lastName);
            userEvent.type(emailInput, user.email);

            userEvent.type(homeStreetNameInput, homeAddress.streetAddress);
            userEvent.type(homeStreetName2Input, homeAddress.streetAddressTwo);
            userEvent.type(homeCityInout, homeAddress.city);
            userEvent.selectOptions(homeStateInput, homeAddress.state);

            userEvent.type(workStreetNameInput, workAddress.streetAddress);
            userEvent.type(workStreetName2Input, workAddress.streetAddressTwo);
            userEvent.type(workCityInout, workAddress.city);
            userEvent.selectOptions(workStateInput, workAddress.state);
            userEvent.type(workZipInput, workAddress.zip);

            userEvent.type(homeZipInput, homeAddress.zip);
            userEvent.type(userDetails, details);
        });

        it('should be resettable', () => {
            expect(firstNameInput).toHaveDisplayValue(user.firstName);
            expect(lastNameInput).toHaveDisplayValue(user.lastName);
            expect(emailInput).toHaveDisplayValue(user.email);

            expect(homeStreetNameInput).toHaveDisplayValue(homeAddress.streetAddress);
            expect(homeStreetName2Input).toHaveDisplayValue(homeAddress.streetAddressTwo);
            expect(homeCityInout).toHaveDisplayValue(homeAddress.city);
            expect(homeStateInput).toHaveDisplayValue(homeAddress.state);
            expect(homeZipInput).toHaveDisplayValue(homeAddress.zip);

            expect(workStreetNameInput).toHaveDisplayValue(workAddress.streetAddress);
            expect(workStreetName2Input).toHaveDisplayValue(workAddress.streetAddressTwo);
            expect(workCityInout).toHaveDisplayValue(workAddress.city);
            expect(workStateInput).toHaveDisplayValue(workAddress.state);
            expect(workZipInput).toHaveDisplayValue(workAddress.zip);
            expect(userDetails).toHaveDisplayValue(details);

            act(() => {
                userEvent.click(screen.getByText('Reset'));
            });

            expect(firstNameInput).not.toHaveDisplayValue(user.firstName);
            expect(lastNameInput).not.toHaveDisplayValue(user.lastName);
            expect(emailInput).not.toHaveDisplayValue(user.email);

            expect(homeStreetNameInput).not.toHaveDisplayValue(homeAddress.streetAddress);
            expect(homeStreetName2Input).not.toHaveDisplayValue(homeAddress.streetAddressTwo);
            expect(homeCityInout).not.toHaveDisplayValue(homeAddress.city);
            expect(homeStateInput).not.toHaveDisplayValue(homeAddress.state);
            expect(homeZipInput).not.toHaveDisplayValue(homeAddress.zip);

            expect(workStreetNameInput).not.toHaveDisplayValue(workAddress.streetAddress);
            expect(workStreetName2Input).not.toHaveDisplayValue(workAddress.streetAddressTwo);
            expect(workCityInout).not.toHaveDisplayValue(workAddress.city);
            expect(workStateInput).not.toHaveDisplayValue(workAddress.state);
            expect(workZipInput).not.toHaveDisplayValue(workAddress.zip);
            expect(userDetails).not.toHaveDisplayValue(details);
        });

        describe('when adding a user', () => {
            it('should submit all the data', () => {
            act(() => {
                userEvent.click(screen.getByText('Add'));
            });

            expect(consumer).toHaveBeenCalledWith({
                user,
                homeAddress,
                workAddress,
                details
            });
        });

            it('should reset the form', () => {
                expect(firstNameInput).toHaveDisplayValue(user.firstName);
                expect(lastNameInput).toHaveDisplayValue(user.lastName);
                expect(emailInput).toHaveDisplayValue(user.email);

                expect(homeStreetNameInput).toHaveDisplayValue(homeAddress.streetAddress);
                expect(homeStreetName2Input).toHaveDisplayValue(homeAddress.streetAddressTwo);
                expect(homeCityInout).toHaveDisplayValue(homeAddress.city);
                expect(homeStateInput).toHaveDisplayValue(homeAddress.state);
                expect(homeZipInput).toHaveDisplayValue(homeAddress.zip);

                expect(workStreetNameInput).toHaveDisplayValue(workAddress.streetAddress);
                expect(workStreetName2Input).toHaveDisplayValue(workAddress.streetAddressTwo);
                expect(workCityInout).toHaveDisplayValue(workAddress.city);
                expect(workStateInput).toHaveDisplayValue(workAddress.state);
                expect(workZipInput).toHaveDisplayValue(workAddress.zip);
                expect(userDetails).toHaveDisplayValue(details);

                act(() => {
                    userEvent.click(screen.getByText('Add'));
                });

                expect(firstNameInput).not.toHaveDisplayValue(user.firstName);
                expect(lastNameInput).not.toHaveDisplayValue(user.lastName);
                expect(emailInput).not.toHaveDisplayValue(user.email);

                expect(homeStreetNameInput).not.toHaveDisplayValue(homeAddress.streetAddress);
                expect(homeStreetName2Input).not.toHaveDisplayValue(homeAddress.streetAddressTwo);
                expect(homeCityInout).not.toHaveDisplayValue(homeAddress.city);
                expect(homeStateInput).not.toHaveDisplayValue(homeAddress.state);
                expect(homeZipInput).not.toHaveDisplayValue(homeAddress.zip);

                expect(workStreetNameInput).not.toHaveDisplayValue(workAddress.streetAddress);
                expect(workStreetName2Input).not.toHaveDisplayValue(workAddress.streetAddressTwo);
                expect(workCityInout).not.toHaveDisplayValue(workAddress.city);
                expect(workStateInput).not.toHaveDisplayValue(workAddress.state);
                expect(workZipInput).not.toHaveDisplayValue(workAddress.zip);
                expect(userDetails).not.toHaveDisplayValue(details);
            });
        });

        describe('work address', () => {
            beforeEach(() => {
                act(() => {
                    userEvent.click(screen.getByLabelText('Same as Home'));
                });
            });

            test('should allow the user to auto copy the home address', async () => {
                await waitFor(() => expect(workStreetNameInput).toHaveValue(homeAddress.streetAddress));
                expect(workStreetName2Input).toHaveValue(homeAddress.streetAddressTwo);
                expect(workCityInout).toHaveValue(homeAddress.city);
                expect(workStateInput).toHaveValue(homeAddress.state);
                expect(workZipInput).toHaveValue(homeAddress.zip);

                userEvent.click(screen.getByText('Add'));

                expect(consumer).toHaveBeenCalledWith({
                    user,
                    homeAddress,
                    workAddress: homeAddress,
                    details
                });
            });

            test('work address should be disabled', () => {
                expect(workStreetNameInput).toHaveAttribute('disabled');
                expect(workStreetName2Input).toHaveAttribute('disabled');
                expect(workCityInout).toHaveAttribute('disabled');
                expect(workStateInput).toHaveAttribute('disabled');
                expect(workZipInput).toHaveAttribute('disabled');
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