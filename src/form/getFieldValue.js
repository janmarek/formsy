export default function getFieldValue(input) {
    if (input.type === 'select-multiple') {
        const value = [];
        for (let i = 0; i < input.selectedOptions.length; i++) {
            value.push(input.selectedOptions[i].value);
        }
        return value;
    }

    if (input.type === 'checkbox') {
        return input.checked;
    }

    return input.value;
};
