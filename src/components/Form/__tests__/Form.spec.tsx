import {Form} from '../index';
import {act, render, screen, within} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import * as faker from 'faker';
import {data} from '../../../data';

describe('a form', () => {

    beforeEach(() => {
        data.post = jest.fn();
        render(<Form/>);
    });

    describe('complete', () => {
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
        const workZip = faker.address.zipCode();
        const description = faker.lorem.sentences(Math.floor(Math.random() * 10) + 1);

        it('should submit the form', () => {
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


            const details = screen.getByLabelText('Details');
            userEvent.type(details, description);

            const submit = screen.getByText('Submit');

            userEvent.click(submit);

            expect(data.post).toHaveBeenCalledWith({
                user: {firstName, lastName},
                homeAddress: {
                    city: homeCity,
                    state: homeState,
                    streetAddress: homeStreetName,
                    streetAddress2: homeStreetName2,
                    zip: homeZip
                },
                workAddress: {
                    city: workCity,
                    state: workState,
                    streetAddress: workStreetName,
                    streetAddress2: workStreetName2,
                    zip: workZip
                },
                details: description
            });
        });
    });
});