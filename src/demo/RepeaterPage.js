import React, { Component } from 'react';
import {Form} from '../form';
import FormStateExplorer from './FormStateExplorer';

let lastPersonId = 0;

function validateGroupName(name) {
    return name == '' ? 'Missing group name.' : null;
}

function validatePerson(person) {
    const errors = {};

    if (person.name === '') {
        errors.name = 'Missing name.';
    }

    return errors;
}

function validateForm(values) {
    return {
        name: validateGroupName(values.name),
        people: values.people.map(validatePerson),
    };
}

class RepeaterPage extends Component {
    constructor() {
        super();

        const initValues = {
            name: '',
            people: [],
        };

        this.form = new Form({
            getState: () => this.state.formState,
            setState: formState => this.setState({formState}),
            validate: validateForm,
            submitHandler: this.handleSubmit,
            initValues,
        });
        this.state = {
            formState: null,
        };
    }

    addPerson = () => {
        const values = this.form.getValues();

        this.form.setValues({
            ...values,
            people: values.people.concat({
                id: ++lastPersonId,
                name: '',
                sex: null,
            }),
        });
    }

    removePerson = index => {
        const values = this.form.getValues();

        this.form.setValues({
            ...values,
            people: values.people.filter(person => person.id != index),
        });
    }

    handleSubmit = (values, done) => {
        setTimeout(() => {
            alert(`You have ${values.people.length} people`);
            done();
        }, 500);
    }

    renderErrors(path) {
        const errors = this.form.getVisibleErrors(path);

        if (!errors) {
            return null;
        }

        return <p className="error">{errors}</p>;
    }

    renderPeopleList() {
        const people = this.form.getValues().people;

        if (people.length === 0) {
            return <p>No people</p>;
        }

        return <table>
            <thead>
                <tr>
                    <th>Name</th>
                    <th>Sex</th>
                    <th></th>
                </tr>
            </thead>
            <tbody>
                {people.map((person, index) => {
                    return <tr key={person.id}>
                        <td>
                            <input type="text" className="input"
                                {...this.form.input(`people[${index}].name`)} />
                            {this.renderErrors(`people[${index}].name`)}
                        </td>
                        <td>
                            <select {...this.form.input(`people[${index}].sex`)}>
                                <option>Choose</option>
                                <option value="male">Male</option>
                                <option value="female">Female</option>
                            </select>
                        </td>
                        <td>
                            <a className="button" onClick={() => this.removePerson(person.id)}>Remove</a>
                        </td>
                    </tr>;
                })}
            </tbody>
        </table>;
    }

    render() {
        return <div>
            <form onSubmit={this.form.handleSubmit}>
                <div>
                    <label className="label">Group Name</label>
                    <input type="text" className="input"
                        {...this.form.input('name')} />
                    {this.renderErrors('name')}
                </div>
                <h3>People</h3>
                {this.renderPeopleList()}
                <p>
                    <button className="button" onClick={this.addPerson}>
                        Add Person
                    </button>
                </p>

                <p>
                    <button type="submit" className="button">
                        {this.form.isSubmitting() ? 'Saving…' : 'Save'}
                    </button>
                </p>
            </form>

            <FormStateExplorer formState={this.form.getState()} />
        </div>;
    }

}

export default RepeaterPage;
