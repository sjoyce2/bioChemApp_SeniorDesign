const modelEdit = require('./modelEdit');

test("Why wont this work", () => {
    var firstRectMidX = 100;
    var firstRectMidY = 0;
    var stepOrder = ["r"];
    var x = 0;
    expect(modelEdit.getDotPos(50)).toBe(50);
});