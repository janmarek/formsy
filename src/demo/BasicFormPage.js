import React, { Component } from 'react';
import {Form} from '../form';
import FormStateExplorer from './FormStateExplorer';

class BasicFormPage extends Component {
    constructor() {
        super();

        this.form = new Form({
            getState: () => this.state.formState,
            setState: formState => this.setState({formState}),
            submitHandler: this.handleSubmit,
        });
        this.state = {
            formState: null,
        };
    }

    handleSubmit = (values, done) => {
        setTimeout(() => {
            done();
        }, 1000);
    }

    render() {
        return <div>
            <p className="source">
                <a href="https://github.com/janmarek/formsy/blob/master/src/demo/BasicFormPage.js">Source Code</a>
            </p>
            <form onSubmit={this.form.handleSubmit}>
                <div>
                    <label className="label">Text</label>
                    <input type="password" className="input"
                        {...this.form.input('text')} />
                </div>
                <div>
                    <label className="label">Password</label>
                    <input type="password" className="input"
                        {...this.form.input('password')} />
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
                    <label className="label">Select multiple</label>
                    <select {...this.form.input('multiple-select', [])} multiple={true}>
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

            <FormStateExplorer formState={this.form.getState()} />
        </div>;
    }

}

export default BasicFormPage;
