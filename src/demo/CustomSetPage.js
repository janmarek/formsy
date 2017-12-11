import React, {Component} from 'react';
import {Form} from '../form';
import FormStateExplorer from './FormStateExplorer';

function isValidRgb(color) {
    var re = /^#[0-9A-F]{6}$/;
    return re.test(color);
}

function isValidColorPart(input) {
    const intInput = parseInt(input, 10);
    return intInput >= 0 && intInput <= 255;
}

function validateForm(values) {
    const errors = {};

    if (!isValidRgb(values.rgb)) {
        errors.rgb = 'Color is not valid.';
    }

    ['red', 'green', 'blue'].forEach(part => {
        if (!isValidColorPart(values[part])) {
            errors[part] = 'Insert number 0 - 255.';
        }
    });

    return errors;
}

class CustomSetPage extends Component {
    constructor() {
        super();

        this.form = new Form({
            getState: () => this.state.formState,
            setState: formState => this.setState({formState}),
            validate: validateForm,
            submitHandler: this.handleSubmit,
            initValues: {
                rgb: '#FFFFFF',
                red: '255',
                green: '255',
                blue: '255',
            },
        });
        this.state = {
            formState: null,
            color: '#FFFFFF',
            isDark: false,
        };
    }

    handleSubmit = (values, done) => {
        this.setState({
            color: values.rgb,
            isDark: this.isDark(values),
        });
        done();
    }

    renderErrors(path) {
        const err = this.form.getVisibleErrors(path);

        if (typeof err !== 'string') {
            return null;
        }

        return <p className="error">{err}</p>;
    }

    isDark(values) {
        const limit = 255 * 3 / 2;

        return parseInt(values.red, 10) + parseInt(values.blue, 10) + parseInt(values.green, 10) < limit;
    }

    handleChangeRgb = event => {
        const value = event.target.value;

        this.form.handleChange(event);
        if (isValidRgb(value)) {
            this.form.setValues({
                rgb: value,
                red: parseInt(value.substr(1, 2), 16),
                green: parseInt(value.substr(3, 2), 16),
                blue: parseInt(value.substr(5, 2), 16),
            })
        }
    }

    colorPartToString(input) {
        const intInput = parseInt(input, 10);
        const out = intInput.toString(16).toUpperCase();

        if (out.length == 1) {
            return '0' + out;
        } else {
            return out;
        }
    }

    handleChangeColorPart = event => {
        this.form.handleChange(event);

        setTimeout(() => {
            const values = this.form.getValues();

            if (isValidColorPart(values.red) && isValidColorPart(values.green) && isValidColorPart(values.blue)) {
                this.form.setValues({
                    ...values,
                    rgb: '#' + this.colorPartToString(values.red) +
                        this.colorPartToString(values.green) +
                        this.colorPartToString(values.blue),
                })
            }
        });
    }

    render() {
        return <div>
            <p className="source">
                <a href="https://github.com/janmarek/formsy/blob/master/src/demo/CustomSetPage.js">Source Code</a>
            </p>
            <form onSubmit={this.form.handleSubmit}>
                <div>
                    <label className="label">RGB</label>
                    <input type="text" className="input"
                        {...this.form.input('rgb')} onChange={this.handleChangeRgb} />
                    {this.renderErrors('rgb')}
                </div>
                <div>
                    <label className="label">Red</label>
                    <input type="text" className="input"
                        {...this.form.input('red')} onChange={this.handleChangeColorPart} />
                    {this.renderErrors('red')}
                </div>
                <div>
                    <label className="label">Green</label>
                    <input type="text" className="input"
                        {...this.form.input('green')} onChange={this.handleChangeColorPart} />
                    {this.renderErrors('green')}
                </div>
                <div>
                    <label className="label">Blue</label>
                    <input type="text" className="input"
                        {...this.form.input('blue')} onChange={this.handleChangeColorPart} />
                    {this.renderErrors('blue')}
                </div>

                <p><button type="submit" className="button">Set Color</button></p>
            </form>

            <div style={{
                background: this.state.color,
                padding: '3em',
                textAlign: 'center',
                color: this.state.isDark ? 'white' : 'black',
                border: '1px solid black',
            }}>
                {this.state.color}
            </div>

            <FormStateExplorer formState={this.form.getState()} />
        </div>;
    }

}

export default CustomSetPage;
