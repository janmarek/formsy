import * as formState from './formState';

function getEmptyInitState() {
    return formState.getInitState(undefined, () => null);
}

describe('formState', () => {
    it('get empty init state', () => {
        const state = getEmptyInitState();

        expect(state.valid).toBe(true);
        expect(state.values).toEqual({});
    });

    it('get init state with data', () => {
        const state = formState.getInitState({a: '', b: ''}, () => ({a: 'empty'}));

        expect(state.valid).toBe(false);
        expect(state.values).toEqual({a: '', b: ''});
    });

    it('set values', () => {
        const validate = values => values.a ? null : {a: 'empty'};

        const initState = formState.getInitState(undefined, () => null);

        const state1 = formState.setValues(initState, {a: ''}, validate);
        const state2 = formState.setValues(state1, {a: 'a'}, validate);

        expect(state1.values).toEqual({a: ''});
        expect(state1.valid).toBe(false);
        expect(state1.errors).toEqual({a: 'empty'});

        expect(state1.values).toEqual({a: ''});
        expect(state1.valid).toBe(false);
        expect(state1.errors).toEqual({a: 'empty'});
    });

    it('get errors', () => {
        const state = formState.getInitState({
            a: {
                b: 'test',
            },
        }, () => ({
            a: {
                b: 'error',
            },
        }));

        expect(formState.getErrors(state, 'a.b')).toBe('error');
        expect(formState.getErrors(state, 'c')).toBe(null);
        expect(formState.getErrors(state, 'a')).toEqual({b: 'error'});
    });

    it('get visible errors', () => {
        const validate = values => {
            const errors = {};
            if (values.firstName.length === 0) {
                errors.firstName = 'empty first name';
            }
            if (values.lastName.length === 0) {
                errors.lastName = 'empty last name';
            }

            return errors;
        };

        const initState = formState.getInitState({
            firstName: '',
            lastName: '',
        }, validate);

        // no visible errors before input is touched
        expect(formState.getVisibleErrors(initState, 'firstName')).toBe(null);
        expect(formState.getVisibleErrors(initState, 'lastName')).toBe(null);
        expect(formState.getVisibleErrors(initState, 'unknown')).toBe(null);

        // do not show error when input is focused
        const focusFirstNameState = formState.setFocus(initState, 'firstName');
        expect(formState.getVisibleErrors(focusFirstNameState, 'firstName')).toBe(null);
        expect(formState.getVisibleErrors(focusFirstNameState, 'lastName')).toBe(null);
        expect(formState.getVisibleErrors(focusFirstNameState, 'unknown')).toBe(null);

        // show errors on blur
        const blurFirstNameState = formState.removeFocus(focusFirstNameState, 'firstName');
        expect(formState.getVisibleErrors(blurFirstNameState, 'firstName')).toBe('empty first name');
        expect(formState.getVisibleErrors(blurFirstNameState, 'lastName')).toBe(null);
        expect(formState.getVisibleErrors(blurFirstNameState, 'unknown')).toBe(null);

        // show all errors on submit
        const submittedFormState = formState.setSubmitted(blurFirstNameState);
        expect(formState.getVisibleErrors(submittedFormState, 'firstName')).toBe('empty first name');
        expect(formState.getVisibleErrors(submittedFormState, 'lastName')).toBe('empty last name');
        expect(formState.getVisibleErrors(submittedFormState, 'unknown')).toBe(null);
    });
});
