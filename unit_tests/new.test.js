const newFile = require('./new');

test("should work", () => {
    expect(newFile.add(1, 2)).toBe(3);
    expect(newFile.multiply(1, 2)).toBe(2);
    expect(newFile.divide(2, 1)).toBe(2);
    expect(newFile.subtract(2, 1)).toBe(1);
});