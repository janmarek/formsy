import React, {Component} from 'react';
import {Form} from '../form';
import FormStateExplorer from './FormStateExplorer';

const minPasswordLength = 4;

function validateEmail(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}

function validateForm(values) {
    const {name, email, password, confirmPassword, agree} = values;
    const errors = {};

    if (name === '') {
        errors.name = 'Please fill in name.';
    }

    if (email === '') {
        errors.email = 'Please fill in email.';
    } else if (!validateEmail(email)) {
        errors.email = 'Email is not valid.';
    }

    if (password === '') {
        errors.password = 'Please fill in password.';
    } else if (password.length < minPasswordLength) {
        errors.password = `Password should be at least ${minPasswordLength} characters long.`;
    }

    if (confirmPassword === '') {
        errors.confirmPassword = 'Please confirm password.';
    } else if (confirmPassword.length < minPasswordLength) {
        errors.confirmPassword = `Password should be at least ${minPasswordLength} characters long.`;
    } else if (password !== '' && confirmPassword !== '' && password !== confirmPassword) {
        errors.confirmPassword = 'Passwords do not match.';
    }

    if (!agree) {
        errors.agree = 'You have to agree with conditions.';
    }

    return errors;
}

class ValidationPage extends Component {
    constructor() {
        super();

        this.form = new Form({
            getState: () => this.state.formState,
            setState: formState => this.setState({formState}),
            validate: validateForm,
            submitHandler: this.handleSubmit,
            initValues: {
                name: '',
                email: '',
                password: '',
                confirmPassword: '',
                agree: false,
            },
        });
        this.state = {
            formState: null,
        };
    }

    handleSubmit = (values, done) => {
        done();
    }

    renderErrors(path) {
        const err = this.form.getVisibleErrors(path);

        if (typeof err !== 'string') {
            return null;
        }

        return <p className="error">{err}</p>;
    }

    render() {
        return <div>
            <form onSubmit={this.form.handleSubmit}>
                <div>
                    <label className="label">Name</label>
                    <input type="text" className="input"
                        {...this.form.input('name')} />
                    {this.renderErrors('name')}
                </div>
                <div>
                    <label className="label">Email</label>
                    <input type="text" className="input"
                        {...this.form.input('email')} />
                    {this.renderErrors('email')}
                </div>
                <div>
                    <label className="label">Password</label>
                    <input type="password" className="input"
                        {...this.form.input('password')} />
                    {this.renderErrors('password')}
                </div>
                <div>
                    <label className="label">Confirm Password</label>
                    <input type="password" className="input"
                        {...this.form.input('confirmPassword')} />
                    {this.renderErrors('confirmPassword')}
                </div>
                <div>
                    <label className="label">
                        <input type="checkbox" {...this.form.checkbox('agree')} />
                        Agree with conditions
                    </label>
                    {this.renderErrors('agree')}
                </div>

                <p><button type="submit" className="button">Register</button></p>
            </form>

            <FormStateExplorer formState={this.form.getState()} />
        </div>;
    }

}

export default ValidationPage;
