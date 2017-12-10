import toArrayPath from './toArrayPath';

describe('toArrayPath', () => {
    it('converts paths to array', () => {
        expect(toArrayPath('')).toEqual([]);
        expect(toArrayPath('a.b.cd')).toEqual(['a', 'b', 'cd']);
        expect(toArrayPath('a[3].b')).toEqual(['a', '3', 'b']);
    });

    it('caches data', () => {
        const result1 = toArrayPath('a.b');
        const result2 = toArrayPath('c');
        const result3 = toArrayPath('a.b');

        expect(result1).toEqual(['a', 'b']);
        expect(result2).toEqual(['c']);
        expect(result1 === result3).toBe(true);
    });
});
