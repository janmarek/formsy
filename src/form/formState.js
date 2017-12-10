import get from 'lodash/get';
import toArrayPath from './toArrayPath';
import computeValid from './computeValid';

export const emptyObject = {};

export const emptyState = {
    values: emptyObject,
    errors: emptyObject,
    valid: null,
    submitting: false,
    isSubmitted: false,
    touchedFields: emptyObject,
    focusedFields: emptyObject,
};

export function getInitState(values, validate) {
    return setValues(emptyState, values == null ? emptyObject : values, validate);
}

export function setValues(state, values, validate) {
    const errors = validate(values);
    const valid = computeValid(errors);

    return {
        ...state,
        errors,
        valid,
        values,
    };
}

export function setFocus(state, path) {
    return {
        ...state,
        focusedFields: {
            ...state.focusedFields,
            [path]: true,
        },
        touchedFields: {
            ...state.touchedFields,
            [path]: true,
        },
    };
}

export function removeFocus(state, path) {
    return {
        ...state,
        focusedFields: {
            ...state.focusedFields,
            [path]: false,
        },
    };
}

export function setSubmitting(state, submitting) {
    return {
        ...state,
        submitting,
    };
}

export function setSubmitted(state) {
    return {
        ...state,
        isSubmitted: true,
    };
}

export function getErrors(state, path) {
    if (typeof path === 'undefined') {
        return state.errors;
    }

    return get(state.errors, toArrayPath(path), null);
}

export function getVisibleErrors(state, path) {
    const {focusedFields, touchedFields, isSubmitted} = state;

    if (!focusedFields[path] && (isSubmitted || touchedFields[path])) {
        return getErrors(state, path);
    }

    return null;
}
