import isEmpty from 'lodash/isEmpty';
import isObjectLike from 'lodash/isObjectLike';

function computeValid(errors) {
    if (isEmpty(errors)) {
        return true;
    }

    if (!isObjectLike(errors)) {
        return false;
    }

    for (var name in errors) {
        if (errors.hasOwnProperty(name)) {
            const result = computeValid(errors[name]);

            if (result == false) {
                return false;
            }
        }
    }

    return true;
}

export default computeValid;
