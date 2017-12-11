import get from 'lodash/get';
import set from 'lodash/fp/set';
import * as formState from './formState';
import toArrayPath from './toArrayPath';
import getFieldValue from './getFieldValue';

export function setValue(values, arrayPath, value) {
    return set(arrayPath, value, values);
}

export const getValue = get;

class Form {

    constructor({
        getState,
        setState,
        validate,
        submitHandler,
        initValues,
        setValueCallback,
        getValueCallback
    }) {
        this.getStateCallback = getState;
        this.setState = setState;
        this.validate = validate || (() => null);
        this.submitHandler = submitHandler;
        this.initValues = initValues;
        this.setValueCallback = setValueCallback || setValue;
        this.getValueCallback = getValueCallback || getValue;
    }

    getState() {
        return this.getStateCallback() || this.getInitState();
    }

    getInitState() {
        return formState.getInitState(this.initValues, this.validate);
    }

    getValues() {
        return this.getState().values;
    }

    getValue(path) {
        return this.getValueCallback(this.getValues(), toArrayPath(path));
    }

    getErrors(path) {
        return formState.getErrors(this.getState(), path);
    }

    getVisibleErrors(path) {
        return formState.getVisibleErrors(this.getState(), path);
    }

    isSubmitting() {
        return this.getState().submitting;
    }

    setValues(values) {
        const state = this.getState();
        this.setState(formState.setValues(state, values, this.validate));
    }

    // field props

    input(path, defaultValue = '') {
        return {
            name: path,
            value: this.getValue(path) || defaultValue,
            onChange: this.handleChange,
            onFocus: this.handleFocus,
            onBlur: this.handleBlur,
        };
    }

    checkbox(path) {
        return {
            name: path,
            checked: this.getValue(path) === true,
            onChange: this.handleChange,
            onFocus: this.handleFocus,
            onBlur: this.handleBlur,
        };
    }

    radio(path, value) {
        return {
            name: path,
            value,
            checked: this.getValue(path) === value,
            onChange: this.handleChange,
            onFocus: this.handleFocus,
            onBlur: this.handleBlur,
        };
    }

    // event handlers

    handleSubmit = event => {
        event.preventDefault();
        let state = this.getState();
        const {valid, values, submitting, isSubmitted} = state;

        if (!isSubmitted) {
            state = formState.setSubmitted(state);
        }

        const shouldSubmit = !submitting && valid;
        if (shouldSubmit) {
            state = formState.setSubmitting(state, true);
        }

        this.setState(state);

        if (shouldSubmit) {
            this.submitHandler(values, this._done);
        }
    }

    _done = () => {
        this.setState(formState.setSubmitting(this.getState(), false));
    }

    handleChange = event => {
        const state = this.getState();

        const newValues = this.setValueCallback(
            state.values,
            toArrayPath(event.target.name),
            getFieldValue(event.target)
        );

        this.setState(formState.setValues(state, newValues, this.validate));
    }

    handleFocus = event => {
        this.setState(
            formState.setFocus(this.getState(), event.target.name)
        );
    }

    handleBlur = event => {
        this.setState(
            formState.removeFocus(this.getState(), event.target.name)
        );
    }

}

export default Form;
