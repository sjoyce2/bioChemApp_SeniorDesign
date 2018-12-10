const moduleEdit = require('./moduleEdit');

test('testClickSaveBtn should return true', () => {
    expect(moduleEdit.testClickSaveBtn("click")).toBe(false);
    expect(moduleEdit.testClickSaveBtn("no click")).toBe(true);
});

test('test initialXCoor', () => {
    expect(moduleEdit.setInitialXCoor(1)).toBe(330);
});
