var test = require('tape');
var sum = require('./modelEdit');
 
test('timing test', function (t) {
    expect(sum(1, 2)).toBe(3);
});