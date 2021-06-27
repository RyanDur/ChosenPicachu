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

        const firstNameInput = screen.getByLabelText('First Name');
        userEvent.type(firstNameInput, firstName);
        expect(firstNameInput.hasAttribute('required')).toBe(true);

        const surnameInput = screen.getByLabelText('Last Name');
        userEvent.type(surnameInput, lastName);
        expect(surnameInput.hasAttribute('required')).toBe(true);

        const homeStreetNameInput = screen.getByTestId('home-street-address');
        userEvent.type(homeStreetNameInput, homeStreetName);
        expect(homeStreetNameInput.hasAttribute('required')).toBe(true);

        const homeStreetName2Input = screen.getByTestId('home-street-address-2');
        userEvent.type(homeStreetName2Input, homeStreetName2);

        const homeCityInout = screen.getByTestId('home-city');
        userEvent.type(homeCityInout, homeCity);
        expect(homeCityInout.hasAttribute('required')).toBe(true);

        const homeStateInput = screen.getByTestId('home-state');
        userEvent.selectOptions(homeStateInput, homeState);
        expect(homeStateInput.hasAttribute('required')).toBe(true);

        const homeZipInput = screen.getByTestId('home-zip');
        userEvent.type(homeZipInput, homeZip);
        expect(homeZipInput.hasAttribute('required')).toBe(true);

        const details = screen.getByLabelText('Details');
        userEvent.type(details, description);
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

        const submit = screen.getByText('Submit');
        userEvent.click(submit);

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
        test('should allow the user to auto copy the home address', () => {
            const sameAsHome = screen.getByLabelText('Same as Home');
            userEvent.click(sameAsHome);

            const workStreetNameInput = screen.getByTestId('work-street-address');
            expect(workStreetNameInput).toHaveValue(homeStreetName);
            expect(workStreetNameInput).toHaveAttribute('readonly');

            const workStreetName2Input = screen.getByTestId('work-street-address-2');
            expect(workStreetName2Input).toHaveValue(homeStreetName2);
            expect(workStreetName2Input).toHaveAttribute('readonly');

            const workCityInout = screen.getByTestId('work-city');
            expect(workCityInout).toHaveValue(homeCity);
            expect(workCityInout).toHaveAttribute('readonly');

            const workStateInput = screen.getByTestId('work-state');
            expect(workStateInput).toHaveValue(homeState);
            expect(workStateInput).toHaveAttribute('disabled');

            const workZipInput = screen.getByTestId('work-zip');
            expect(workZipInput).toHaveValue(homeZip);
            expect(workZipInput).toHaveAttribute('readonly');

            const submit = screen.getByText('Submit');
            userEvent.click(submit);

            expect(data.post).toHaveBeenCalledWith({
                user: {firstName, lastName},
                homeAddress,
                workAddress: homeAddress,
                details: description
            });
        });
    });
});