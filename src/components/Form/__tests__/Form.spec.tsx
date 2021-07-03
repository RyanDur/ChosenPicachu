import {Form} from '../index';
import {render, screen} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import * as faker from 'faker';
import {data} from '../../../data';

describe('a form', () => {
    const user = {
        firstName: faker.name.firstName(),
        lastName: faker.name.lastName()
    };

    const homeAddress = {
        city: faker.address.city(),
        state: faker.address.stateAbbr(),
        streetAddress: faker.address.streetName(),
        streetAddressTwo: faker.address.secondaryAddress(),
        zip: faker.address.zipCode()
    };

    const workAddress = {
        city: faker.address.city(),
        state: faker.address.stateAbbr(),
        streetAddress: faker.address.streetName(),
        streetAddressTwo: faker.address.secondaryAddress(),
        zip: faker.address.zipCode()
    };

    const details = faker.lorem.sentences(Math.floor(Math.random() * 10) + 1);

    let firstNameInput: HTMLElement;
    let surnameInput: HTMLElement;
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

    beforeEach(() => {
        data.post = jest.fn();
        render(<Form/>);

        firstNameInput = screen.getByLabelText('First Name');
        surnameInput = screen.getByLabelText('Last Name');

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
            userEvent.type(surnameInput, user.lastName);

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

        it('should submit all the data', () => {
            userEvent.click(screen.getByText('Submit'));

            expect(data.post).toHaveBeenCalledWith({
                user,
                homeAddress,
                workAddress,
                details
            });
        });

        describe('work address', () => {
            beforeEach(() => userEvent.click(screen.getByLabelText('Same as Home')));

            test('should allow the user to auto copy the home address', () => {
                expect(workStreetNameInput).toHaveValue(homeAddress.streetAddress);
                expect(workStreetName2Input).toHaveValue(homeAddress.streetAddressTwo);
                expect(workCityInout).toHaveValue(homeAddress.city);
                expect(workStateInput).toHaveValue(homeAddress.state);
                expect(workZipInput).toHaveValue(homeAddress.zip);

                userEvent.click(screen.getByText('Submit'));

                expect(data.post).toHaveBeenCalledWith({
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
            expect(surnameInput).not.toBeValid();
            expect(homeStreetNameInput).not.toBeValid();
            expect(homeCityInout).not.toBeValid();
            expect(homeStateInput).not.toBeValid();
            expect(homeZipInput).not.toBeValid();
        });

        describe('for a zip code', () => {
            test('for home', () =>
                validate(screen.getByTestId('home-zip')));

            test('for work', () =>
                validate(screen.getByTestId('work-zip')));

            const validate = (element: HTMLElement) => {
                userEvent.clear(element);

                userEvent.type(element, 'a');
                expect(element).not.toBeValid();

                userEvent.clear(element);

                userEvent.type(element, '1');
                expect(element).not.toBeValid();
                userEvent.clear(element);

                userEvent.type(element, '60012');
                expect(element).toBeValid();
                userEvent.clear(element);

                userEvent.type(element, '60012-4567');
                expect(element).toBeValid();
                userEvent.clear(element);

                userEvent.type(element, '60232-467');
                expect(element).not.toBeValid();
                userEvent.clear(element);

                userEvent.type(element, faker.address.zipCode());
                expect(element).toBeValid();
            };
        });
    });

});