import computeValid from './computeValid';

it('computeValid', () => {
    expect(computeValid()).toBe(true);
    expect(computeValid(null)).toBe(true);
    expect(computeValid({})).toBe(true);
    expect(computeValid([])).toBe(true);
    expect(computeValid({
        a: {b: {}},
    })).toBe(true);
    expect(computeValid({a: 'some error'})).toBe(false);
    expect(computeValid({
        a: {b: 'some error'},
        c: null,
    })).toBe(false);
});
