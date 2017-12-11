import React, {Component} from 'react';
import {Form, setValue} from '../form';
import FormStateExplorer from './FormStateExplorer';
import isEqual from 'lodash/isEqual';

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
            setValueCallback: this.setFormValue,
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

    setFormValue = (values, arrayPath, value) => {
        if (isEqual(arrayPath, ['rgb']) && isValidRgb(value)) {
            return {
                rgb: value,
                red: parseInt(value.substr(1, 2), 16),
                green: parseInt(value.substr(3, 2), 16),
                blue: parseInt(value.substr(5, 2), 16),
            };
        }

        if (
            (isEqual(arrayPath, ['red']) || isEqual(arrayPath, ['green']) || isEqual(arrayPath, ['blue'])) &&
            isValidColorPart(value)
        ) {
            const color = arrayPath[0];
            return {
                ...values,
                [color]: value,
                rgb: '#' + this.colorPartToString(color === 'red' ? value : values.red) +
                    this.colorPartToString(color === 'green' ? value : values.green) +
                    this.colorPartToString(color === 'blue' ? value : values.blue),
            };
        }

        return setValue(values, arrayPath, value);
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

    render() {
        return <div>
            <p className="source">
                <a href="https://github.com/janmarek/formsy/blob/master/src/demo/CustomSetPage.js">Source Code</a>
            </p>
            <form onSubmit={this.form.handleSubmit}>
                <div>
                    <label className="label">RGB</label>
                    <input type="text" className="input"
                        {...this.form.input('rgb')} />
                    {this.renderErrors('rgb')}
                </div>
                <div>
                    <label className="label">Red</label>
                    <input type="text" className="input"
                        {...this.form.input('red')} />
                    {this.renderErrors('red')}
                </div>
                <div>
                    <label className="label">Green</label>
                    <input type="text" className="input"
                        {...this.form.input('green')} />
                    {this.renderErrors('green')}
                </div>
                <div>
                    <label className="label">Blue</label>
                    <input type="text" className="input"
                        {...this.form.input('blue')} />
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
