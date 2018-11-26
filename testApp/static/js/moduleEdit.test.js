const moduleEdit = require('./moduleEdit');

test('mousePosition should return 100, 100', () => {
    const mock = jest.fn();
    const border = jest.fn();
    const canvas = jest.fn();
    border.left = 10;
    border.top = 10;
    mock.clientX = 110;
    mock.clientY = 110;
    //Need to set getMouePosition to return border
    expect(moduleEdit.getMousePosition(canvas, mock).toBe(100, 100));
});