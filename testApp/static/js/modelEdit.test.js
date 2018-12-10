var getDotPos = require('./modelEditTesting');
 
test('Test getDotPos', () => {
    expect(getDotPos(50, 0, ["r"], 100)).toBe(50);
});