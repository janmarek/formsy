import toPath from 'lodash/toPath';

const pathCache = {};

function toArrayPath(path) {
    const cached = pathCache[path];

    if (cached) {
        return cached;
    }

    const arrayPath = toPath(path);
    pathCache[path] = arrayPath;

    return arrayPath;
}

export default toArrayPath;
