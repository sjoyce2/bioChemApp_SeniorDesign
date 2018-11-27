const moduleEdit = require('./moduleEdit');

test('testClickSaveBtn should return true', () => {
    var countSubstrates = 0;
    var countProducts = 0;

    // const mock = jest.fn();
    // const border = jest.fn();
    // const canvas = jest.fn();
    // border.left = 10;
    // border.top = 10;
    // mock.clientX = 110;
    // mock.clientY = 110;
    expect(moduleEdit.testClickSaveBtn("click")).toBe(false);
    expect(moduleEdit.testClickSaveBtn("no click")).toBe(true);
    moduleEdit.setReaction([['Phosphoglucoisomerase','Fructose-6-Phosphate']],[['Phosphoglucoisomerase','Glucose-6-Phosphate']]);
    expect(countProducts).toBe(2);
    //Need to set getMouePosition to return border
});
