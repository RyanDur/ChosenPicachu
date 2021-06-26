import {Form} from '../index';
import {act, render, screen} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import * as faker from 'faker';
import {data} from '../../../data';

describe('a form', () => {
    const firstName = faker.name.firstName();
    const lastName = faker.name.lastName();

    beforeEach(() => {
        data.post = jest.fn();
        act(() => void render(<Form/>));
    });

    describe('complete', () => {
        it('should submit the form', () => {
            const firstNameInput = screen.getByLabelText('First Name');
            userEvent.type(firstNameInput, firstName);
            expect(firstNameInput.hasAttribute('required')).toBe(true);

            const surnameInput = screen.getByLabelText('Last Name');
            userEvent.type(surnameInput, lastName);
            expect(surnameInput.hasAttribute('required')).toBe(true);

            const submit = screen.getByText('Submit');
            userEvent.click(submit);

            expect(data.post).toHaveBeenCalledWith({name: `${firstName} ${lastName}`});
        });
    });

    describe('validity', () => {
        it('should not be valid if empty', () => {
            const form = document.querySelector('form');

            expect(form?.checkValidity()).toBe(false);
        });

        it('should not be valid if no first name', () => {
            const surnameInput = screen.getByLabelText('Last Name');
            userEvent.type(surnameInput, lastName);

            const form = document.querySelector('form');

            expect(form?.checkValidity()).toBe(false);
        });

        it('should not be valid if no last name', () => {
            const firstNameInput = screen.getByLabelText('First Name');
            userEvent.type(firstNameInput, firstName);

            const form = document.querySelector('form');

            expect(form?.checkValidity()).toBe(false);
        });
    });
});