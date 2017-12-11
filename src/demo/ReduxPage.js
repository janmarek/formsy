import React, {Component} from 'react';
import {Form} from '../form';
import FormStateExplorer from './FormStateExplorer';
import {createStore, combineReducers} from 'redux';
import {Provider, connect} from 'react-redux';

const initFormReducerState = {
    state: null,
};

const SET_FORM_STATE_ACTION = 'SET_FORM_STATE_ACTION';

function formReducer(state = initFormReducerState, action) {
    switch (action.type) {
        case SET_FORM_STATE_ACTION:
            return {...state, state: action.state};
        default:
            return state;
    }
}

function setFormStateAction(state) {
    return {
        type: SET_FORM_STATE_ACTION,
        state,
    };
}

const reducer = combineReducers({
    form: formReducer,
});

const store = createStore(reducer);

class ReduxPage extends Component {
    constructor(props) {
        super(props);

        this.form = new Form({
            getState: () => this.props.formState,
            setState: this.props.setFormState,
            submitHandler: this.handleSubmit,
        });
    }

    handleSubmit = (values, done) => {
        setTimeout(() => {
            console.log(values);
            done();
        }, 1000);
    }

    render() {
        return <div>
            <p className="source">
                <a href="https://github.com/janmarek/formsy/blob/master/src/demo/ReduxPage.js">Source Code</a>
            </p>
            <form onSubmit={this.form.handleSubmit}>
                <div>
                    <label className="label">Text</label>
                    <input type="password" className="input"
                        {...this.form.input('text')} />
                </div>
                <div>
                    <label className="label">Textarea</label>
                    <textarea rows="5" cols="50" className="input"
                        {...this.form.input('textarea')} />
                </div>
                <div>
                    <label className="label">
                        <input type="checkbox" {...this.form.checkbox('checkbox')} />
                        Checkbox
                    </label>
                </div>

                <div>
                    <label className="label">Select</label>
                    <select {...this.form.input('select')}>
                        <option value="a">Choose A</option>
                        <option value="b">Choose B</option>
                        <option value="c">Choose C</option>
                    </select>
                </div>

                <div>
                    <label className="label">Radio buttons</label>
                    <label><input type="radio" {...this.form.radio('radio', 'a')} /> A</label>
                    <label><input type="radio" {...this.form.radio('radio', 'b')} /> B</label>
                    <label><input type="radio" {...this.form.radio('radio', 'c')} /> C</label>
                </div>

                <p>
                    <button type="submit" className="button block-button">
                        {this.form.isSubmitting() ? 'Submitting…' : 'Submit'}
                    </button>
                </p>
            </form>

            <FormStateExplorer formState={this.props.formState} />
        </div>;
    }

}

const ReduxPageConnected = connect(
    state => ({
        formState: state.form.state,
    }),
    {
        setFormState: setFormStateAction,
    }
)(ReduxPage);

function ProviderWrapper() {
    return <Provider store={store}>
        <ReduxPageConnected />
    </Provider>;
}

export default ProviderWrapper;
