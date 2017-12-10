import React from 'react';

function FormStateExplorer({formState}) {
    if (!formState) {
        return null;
    }

    return <div>
        <h2>Current values</h2>
        {JSON.stringify(formState.values)}

        <h2>Errors</h2>
        {JSON.stringify(formState.errors)}

        <h2>Form state</h2>
        {JSON.stringify(formState)}
    </div>;
}

export default FormStateExplorer;
