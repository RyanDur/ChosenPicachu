import {Form} from '../index';
import {render, screen} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import * as faker from 'faker';
import {data} from '../../../data';

describe('a form', () => {
    const firstName = faker.name.firstName();
    const lastName = faker.name.lastName();

    const homeStreetName = faker.address.streetName();
    const homeStreetName2 = faker.address.secondaryAddress();
    const homeCity = faker.address.city();
    const homeState = faker.address.stateAbbr();
    const homeZip = faker.address.zipCodeByState(homeState);

    const workStreetName = faker.address.streetName();
    const workStreetName2 = faker.address.secondaryAddress();
    const workCity = faker.address.city();
    const workState = faker.address.stateAbbr();
    const workZip = faker.address.zipCode(workState);

    const description = faker.lorem.sentences(Math.floor(Math.random() * 10) + 1);

    let firstNameInput: HTMLElement;
    let surnameInput: HTMLElement;
    let homeStreetNameInput: HTMLElement;
    let homeStreetName2Input: HTMLElement;
    let homeCityInout: HTMLElement;
    let homeStateInput: HTMLElement;
    let homeZipInput: HTMLElement;
    let details: HTMLElement;

    const homeAddress = {
        city: homeCity,
        state: homeState,
        streetAddress: homeStreetName,
        streetAddressTwo: homeStreetName2,
        zip: homeZip
    };

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
        details = screen.getByLabelText('Details');

        userEvent.type(firstNameInput, firstName);
        userEvent.type(surnameInput, lastName);
        userEvent.type(homeStreetNameInput, homeStreetName);
        userEvent.type(homeStreetName2Input, homeStreetName2);
        userEvent.type(homeCityInout, homeCity);
        userEvent.selectOptions(homeStateInput, homeState);
        userEvent.type(homeZipInput, homeZip);
        userEvent.type(details, description);
    });

    it('should have some required fields', () => {
        expect(firstNameInput).toHaveAttribute('required');
        expect(surnameInput).toHaveAttribute('required');
        expect(homeStreetNameInput).toHaveAttribute('required');
        expect(homeCityInout).toHaveAttribute('required');
        expect(homeStateInput).toHaveAttribute('required');
        expect(homeZipInput).toHaveAttribute('required');
    });

    it('should submit all the data', () => {
        const workStreetNameInput = screen.getByTestId('work-street-address');
        userEvent.type(workStreetNameInput, workStreetName);

        const workStreetName2Input = screen.getByTestId('work-street-address-2');
        userEvent.type(workStreetName2Input, workStreetName2);

        const workCityInout = screen.getByTestId('work-city');
        userEvent.type(workCityInout, workCity);

        const workStateInput = screen.getByTestId('work-state');
        userEvent.selectOptions(workStateInput, workState);

        const workZipInput = screen.getByTestId('work-zip');
        userEvent.type(workZipInput, workZip);

        userEvent.click(screen.getByText('Submit'));

        expect(data.post).toHaveBeenCalledWith({
            user: {firstName, lastName},
            homeAddress,
            workAddress: {
                city: workCity,
                state: workState,
                streetAddress: workStreetName,
                streetAddressTwo: workStreetName2,
                zip: workZip
            },
            details: description
        });
    });

    describe('work address', () => {
        let workStreetNameInput: HTMLElement;
        let workStreetName2Input: HTMLElement;
        let workCityInout: HTMLElement;
        let workStateInput: HTMLElement;
        let workZipInput: HTMLElement;

        beforeEach(() => {
            userEvent.click(screen.getByLabelText('Same as Home'));
            workStreetNameInput = screen.getByTestId('work-street-address');
            workStreetName2Input = screen.getByTestId('work-street-address-2');
            workCityInout = screen.getByTestId('work-city');
            workStateInput = screen.getByTestId('work-state');
            workZipInput = screen.getByTestId('work-zip');
        });

        test('should allow the user to auto copy the home address', () => {
            expect(workStreetNameInput).toHaveValue(homeStreetName);
            expect(workStreetName2Input).toHaveValue(homeStreetName2);
            expect(workCityInout).toHaveValue(homeCity);
            expect(workStateInput).toHaveValue(homeState);
            expect(workZipInput).toHaveValue(homeZip);

            const submit = screen.getByText('Submit');
            userEvent.click(submit);

            expect(data.post).toHaveBeenCalledWith({
                user: {firstName, lastName},
                homeAddress,
                workAddress: homeAddress,
                details: description
            });
        });

        test('inputs should be disabled', () => {
            expect(workStreetNameInput).toHaveAttribute('disabled');
            expect(workStreetName2Input).toHaveAttribute('disabled');
            expect(workCityInout).toHaveAttribute('disabled');
            expect(workStateInput).toHaveAttribute('disabled');
            expect(workZipInput).toHaveAttribute('disabled');
        });
    });
});